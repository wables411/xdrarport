#!/usr/bin/env node
/**
 * Upload media files from xdrar2 to Cloudflare R2
 * This script uploads all media from the Crybaby_Oakland folder structure
 */

import { config } from 'dotenv'
config()

import { S3Client, PutObjectCommand, ListObjectsV2Command, DeleteObjectCommand } from '@aws-sdk/client-s3'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// R2 Configuration
const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || 'xdrarport-media'
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL

// Validate environment variables
if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_BUCKET_NAME) {
  console.error('❌ Missing required environment variables:')
  console.error('   R2_ACCOUNT_ID')
  console.error('   R2_ACCESS_KEY_ID')
  console.error('   R2_SECRET_ACCESS_KEY')
  console.error('   R2_BUCKET_NAME')
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

// Client directories to upload
const clientDirs = [
  'Crybaby_Oakland',
  'Bussdown',
  'Planeta_Pisces_November_2025',
  'YNB',
  'ZMO',
  '411_Oakland'
]

// All media file extensions
const MEDIA_EXTENSIONS = ['mp4', 'mov', 'avi', 'webm', 'ogg', 'png', 'jpg', 'jpeg', 'gif', 'MP4', 'MOV', 'AVI', 'PNG', 'JPG', 'JPEG', 'GIF']

function isMediaFile(filename) {
  const ext = filename.split('.').pop()
  return MEDIA_EXTENSIONS.includes(ext)
}

function getContentType(filepath) {
  const ext = filepath.split('.').pop().toLowerCase()
  const contentTypes = {
    mp4: 'video/mp4',
    mov: 'video/quicktime',
    avi: 'video/x-msvideo',
    webm: 'video/webm',
    ogg: 'video/ogg',
    png: 'image/png',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    gif: 'image/gif',
  }
  return contentTypes[ext] || 'application/octet-stream'
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
  })

  try {
    await s3Client.send(command)
    return true
  } catch (error) {
    console.error(`❌ Failed to upload ${r2Key}:`, error.message)
    return false
  }
}

function scanForMedia(dir, basePath = '', clientDirName = '') {
  const media = []
  if (!fs.existsSync(dir)) {
    return media
  }
  
  const items = fs.readdirSync(dir)

  for (const item of items) {
    if (item === '.DS_Store') continue
    
    const fullPath = path.join(dir, item)
    const relativePath = path.join(basePath, item).replace(/\\/g, '/')
    const stat = fs.statSync(fullPath)

    if (stat.isDirectory()) {
      media.push(...scanForMedia(fullPath, relativePath, clientDirName))
    } else if (stat.isFile() && isMediaFile(item)) {
      media.push({
        localPath: fullPath,
        r2Key: `${clientDirName}/${relativePath}`,
        relativePath,
        size: stat.size,
      })
    }
  }

  return media
}

async function main() {
  console.log('🚀 Starting R2 upload for xdrar2 media...')
  console.log(`📦 Bucket: ${R2_BUCKET_NAME}`)
  console.log(`🌐 Public URL: ${R2_PUBLIC_URL || 'Not set'}`)
  console.log('')

  const mediaFiles = []
  const rootDir = path.join(__dirname, '..')

  // Scan all client directories
  for (const clientDir of clientDirs) {
    const clientDirPath = path.join(rootDir, clientDir)
    if (fs.existsSync(clientDirPath)) {
      console.log(`📂 Scanning for media files in ${clientDir}...`)
      const clientMedia = scanForMedia(clientDirPath, '', clientDir)
      mediaFiles.push(...clientMedia)
      console.log(`   Found ${clientMedia.length} files in ${clientDir}`)
    } else {
      console.warn(`⚠️  Client directory not found: ${clientDir}`)
    }
  }

  // Also check for XDRAR.mp4 in root directory
  const xdrarPath = path.join(rootDir, 'XDRAR.mp4')
  if (fs.existsSync(xdrarPath)) {
    const stat = fs.statSync(xdrarPath)
    mediaFiles.push({
      localPath: xdrarPath,
      r2Key: 'XDRAR.mp4',
      relativePath: 'XDRAR.mp4',
      size: stat.size,
    })
    console.log('📂 Found XDRAR.mp4 in root directory')
  }

  console.log(`   Found ${mediaFiles.length} media files\n`)

  if (mediaFiles.length === 0) {
    console.log('✅ No media files to upload')
    return
  }

  // Get existing objects to skip already uploaded files
  console.log('📋 Checking existing files in R2...')
  const existingObjects = await listExistingObjects()
  console.log(`   Found ${existingObjects.size} existing objects\n`)

  // Upload media
  let uploaded = 0
  let skipped = 0
  let failed = 0

  for (const file of mediaFiles) {
    const sizeMB = (file.size / (1024 * 1024)).toFixed(2)
    
    if (existingObjects.has(file.r2Key)) {
      console.log(`⏭️  Skipping (already exists): ${file.relativePath} (${sizeMB}MB)`)
      skipped++
      continue
    }

    process.stdout.write(`⬆️  Uploading: ${file.relativePath} (${sizeMB}MB)... `)
    
    const success = await uploadFile(file.localPath, file.r2Key)
    
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
  if (R2_PUBLIC_URL) {
    console.log(`\n🌐 Your media is available at: ${R2_PUBLIC_URL}/`)
    console.log(`   Client directories: ${clientDirs.join(', ')}`)
  }
}

main().catch(console.error)
