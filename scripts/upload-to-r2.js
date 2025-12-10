#!/usr/bin/env node
/**
 * Upload video files to Cloudflare R2
 * 
 * Prerequisites:
 * 1. Install: npm install @aws-sdk/client-s3 dotenv
 * 2. Set environment variables in .env file or export them
 */

import { config } from 'dotenv'
config()

import { S3Client, PutObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// R2 Configuration
const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL || `https://${R2_BUCKET_NAME}.r2.dev`

// Validate environment variables
if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_BUCKET_NAME) {
  console.error('❌ Missing required environment variables:')
  console.error('   R2_ACCOUNT_ID')
  console.error('   R2_ACCESS_KEY_ID')
  console.error('   R2_SECRET_ACCESS_KEY')
  console.error('   R2_BUCKET_NAME')
  console.error('\n💡 Optional: R2_PUBLIC_URL (defaults to https://bucket-name.r2.dev)')
  console.error('\n📝 Create a .env file or export these variables before running this script')
  process.exit(1)
}

// Initialize S3 client for R2
const s3Client = new S3Client({
  region: 'auto',
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
})

const mediaDir = path.join(__dirname, '../public/media')

// Video file extensions
const VIDEO_EXTENSIONS = ['mp4', 'mov', 'avi', 'webm', 'ogg', 'MP4', 'MOV', 'AVI']

function isVideoFile(filename) {
  const ext = filename.split('.').pop()
  return VIDEO_EXTENSIONS.includes(ext)
}

async function listExistingObjects() {
  try {
    const command = new ListObjectsV2Command({
      Bucket: R2_BUCKET_NAME,
    })
    const response = await s3Client.send(command)
    return new Set((response.Contents || []).map(obj => obj.Key))
  } catch (error) {
    console.warn('⚠️  Could not list existing objects:', error.message)
    return new Set()
  }
}

async function uploadFile(localPath, r2Key) {
  const fileContent = fs.readFileSync(localPath)
  const contentType = getContentType(localPath)
  
  const command = new PutObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: r2Key,
    Body: fileContent,
    ContentType: contentType,
    // Make files publicly readable
    ACL: 'public-read',
  })

  try {
    await s3Client.send(command)
    return true
  } catch (error) {
    console.error(`❌ Failed to upload ${r2Key}:`, error.message)
    return false
  }
}

function getContentType(filepath) {
  const ext = filepath.split('.').pop().toLowerCase()
  const contentTypes = {
    mp4: 'video/mp4',
    mov: 'video/quicktime',
    avi: 'video/x-msvideo',
    webm: 'video/webm',
    ogg: 'video/ogg',
  }
  return contentTypes[ext] || 'application/octet-stream'
}

function scanForVideos(dir, basePath = '') {
  const videos = []
  const items = fs.readdirSync(dir)

  for (const item of items) {
    const fullPath = path.join(dir, item)
    const relativePath = path.join(basePath, item).replace(/\\/g, '/')
    const stat = fs.statSync(fullPath)

    if (stat.isDirectory()) {
      videos.push(...scanForVideos(fullPath, relativePath))
    } else if (stat.isFile() && isVideoFile(item)) {
      videos.push({
        localPath: fullPath,
        r2Key: `media/${relativePath}`,
        relativePath,
        size: stat.size,
      })
    }
  }

  return videos
}

async function main() {
  console.log('🚀 Starting R2 upload...')
  console.log(`📦 Bucket: ${R2_BUCKET_NAME}`)
  console.log(`🌐 Public URL: ${R2_PUBLIC_URL}`)
  console.log('')

  // Check if media directory exists
  if (!fs.existsSync(mediaDir)) {
    console.error(`❌ Media directory not found: ${mediaDir}`)
    process.exit(1)
  }

  // Scan for videos
  console.log('📂 Scanning for video files...')
  const videos = scanForVideos(mediaDir)
  console.log(`   Found ${videos.length} video files\n`)

  if (videos.length === 0) {
    console.log('✅ No videos to upload')
    return
  }

  // Get existing objects to skip already uploaded files
  console.log('📋 Checking existing files in R2...')
  const existingObjects = await listExistingObjects()
  console.log(`   Found ${existingObjects.size} existing objects\n`)

  // Upload videos
  let uploaded = 0
  let skipped = 0
  let failed = 0

  for (const video of videos) {
    const sizeMB = (video.size / (1024 * 1024)).toFixed(2)
    
    if (existingObjects.has(video.r2Key)) {
      console.log(`⏭️  Skipping (already exists): ${video.relativePath} (${sizeMB}MB)`)
      skipped++
      continue
    }

    process.stdout.write(`⬆️  Uploading: ${video.relativePath} (${sizeMB}MB)... `)
    
    const success = await uploadFile(video.localPath, video.r2Key)
    
    if (success) {
      console.log('✅')
      uploaded++
    } else {
      console.log('❌')
      failed++
    }
  }

  console.log('\n📊 Upload Summary:')
  console.log(`   ✅ Uploaded: ${uploaded}`)
  console.log(`   ⏭️  Skipped: ${skipped}`)
  console.log(`   ❌ Failed: ${failed}`)
  console.log(`\n🌐 Your videos are available at: ${R2_PUBLIC_URL}/media/`)
  console.log('\n💡 Next step: Run "npm run generate-media" to update the manifest with R2 URLs')
}

main().catch(console.error)



