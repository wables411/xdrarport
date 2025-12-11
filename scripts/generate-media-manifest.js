import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const mediaDir = path.join(__dirname, '../public/media')
const outputFile = path.join(__dirname, '../src/data/media-manifest.json')

// R2 Configuration - videos will use R2 URLs, images use local paths
// Set R2_PUBLIC_URL environment variable or it will use local paths
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL || process.env.VITE_R2_PUBLIC_URL || null
const USE_R2_FOR_VIDEOS = !!R2_PUBLIC_URL

function getFileExtension(filename) {
  return filename.split('.').pop().toLowerCase()
}

function isImageFile(filename) {
  const ext = getFileExtension(filename)
  return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext)
}

function isVideoFile(filename) {
  const ext = getFileExtension(filename)
  return ['mp4', 'mov', 'avi', 'webm', 'ogg'].includes(ext)
}

function scanDirectoryForFiles(dir, basePath = '') {
  const files = []
  const items = fs.readdirSync(dir)

  for (const item of items) {
    const fullPath = path.join(dir, item)
    const relativePath = path.join(basePath, item).replace(/\\/g, '/')
    const stat = fs.statSync(fullPath)

    if (stat.isDirectory()) {
      // Recursively scan subdirectories for files
      files.push(...scanDirectoryForFiles(fullPath, relativePath))
    } else if (stat.isFile()) {
      const ext = getFileExtension(item)
      if (isImageFile(item) || isVideoFile(item)) {
        const isVideo = isVideoFile(item)
        // Use R2 URL for videos if configured, otherwise use local path
        const filePath = isVideo && USE_R2_FOR_VIDEOS
          ? `${R2_PUBLIC_URL}/media/${relativePath}`
          : `/media/${relativePath}`
        
        files.push({
          filename: item,
          path: filePath,
          type: isImageFile(item) ? 'image' : 'video',
          extension: ext,
          size: stat.size,
        })
      }
    }
  }

  return files
}

function scanForProjects(dir, basePath = '') {
  const projects = []
  const items = fs.readdirSync(dir)

  for (const item of items) {
    const fullPath = path.join(dir, item)
    const relativePath = path.join(basePath, item).replace(/\\/g, '/')
    const stat = fs.statSync(fullPath)

    if (stat.isDirectory()) {
      // Scan this directory for files
      const projectFiles = scanDirectoryForFiles(fullPath, relativePath)
      const projectImages = projectFiles.filter(f => f.type === 'image')
      const projectVideos = projectFiles.filter(f => f.type === 'video')
      
      // Use first image as thumbnail, or first video if no images
      const thumbnail = projectImages[0] || projectVideos[0]
      
      if (thumbnail && projectFiles.length > 0) {
        projects.push({
          name: item,
          folder: relativePath,
          path: `/media/${relativePath}`,
          thumbnail: thumbnail.path,
          thumbnailType: thumbnail.type,
          files: projectFiles,
          type: 'project',
        })
      }
    }
  }

  return projects
}

try {
  console.log('Scanning media directory...')
  if (USE_R2_FOR_VIDEOS) {
    console.log(`📦 Using R2 for videos: ${R2_PUBLIC_URL}`)
  } else {
    console.log('📁 Using local paths for all media (set R2_PUBLIC_URL to use R2)')
  }
  
  // Check if RBS folder exists
  const rbsPath = path.join(mediaDir, 'RBS')
  const hasRBS = fs.existsSync(rbsPath) && fs.statSync(rbsPath).isDirectory()
  
  let allFiles = []
  let allProjects = []
  
  // Scan RBS folder as ONE project (collect all videos from all subfolders)
  if (hasRBS) {
    const rbsFiles = scanDirectoryForFiles(rbsPath, 'RBS')
    const rbsVideos = rbsFiles.filter(f => f.type === 'video')
    const rbsImages = rbsFiles.filter(f => f.type === 'image')
    
    // Skip Lillard folder when selecting thumbnail - use first video/image that's NOT from Lillard folder
    const thumbnailVideos = rbsVideos.filter(v => !v.path.includes('/Lillard/'))
    const thumbnailImages = rbsImages.filter(i => !i.path.includes('/Lillard/'))
    const thumbnail = thumbnailVideos[0] || thumbnailImages[0] || rbsVideos[0] || rbsImages[0]
    
    if (thumbnail) {
      // Extract player names from folder paths
      const videosWithNames = rbsVideos.map(video => {
        // Extract folder name from path (e.g., "RBS/Lillard/video.mp4" -> "Lillard")
        const pathParts = video.path.split('/')
        const folderIndex = pathParts.findIndex(part => part === 'RBS')
        const playerName = folderIndex >= 0 && pathParts[folderIndex + 1] 
          ? pathParts[folderIndex + 1] 
          : video.filename.replace(/\.[^/.]+$/, '')
        
        return {
          ...video,
          playerName: playerName,
        }
      })
      
      allProjects.push({
        name: 'Rare Bet Sports Clips',
        folder: 'RBS',
        path: '/media/RBS',
        thumbnail: thumbnail.path,
        thumbnailType: thumbnail.type,
        files: rbsFiles,
        videos: videosWithNames,
        type: 'project',
      })
    }
  }
  
  // Handle CRYBABY folder - it contains sub-projects
  const crybabyPath = path.join(mediaDir, 'CRYBABY')
  if (fs.existsSync(crybabyPath) && fs.statSync(crybabyPath).isDirectory()) {
    const crybabyItems = fs.readdirSync(crybabyPath)
    for (const item of crybabyItems) {
      const itemPath = path.join(crybabyPath, item)
      if (fs.statSync(itemPath).isDirectory()) {
        // This is a sub-project in CRYBABY (e.g., "Matrix Rave", "Sith rave", "Blade_Rave")
        const projectFiles = scanDirectoryForFiles(itemPath, `CRYBABY/${item}`)
        if (projectFiles.length > 0) {
          const thumbnail = projectFiles[0]
          allProjects.push({
            name: item === 'Sith rave' ? 'Sith rave' : item === 'Matrix Rave' ? 'Matrix Rave' : item,
            folder: `CRYBABY/${item}`,
            path: `/media/CRYBABY/${item}`,
            thumbnail: thumbnail.path,
            thumbnailType: thumbnail.type,
            files: projectFiles,
            type: 'project',
          })
        }
      }
    }
  }
  
  // List of folders that should be treated as projects (excluding RBS and CRYBABY, already handled above)
  const projectFolders = [
    '411 logos',
    'Planeta Pisces logos',
    'petty mart',
    'portion club',
    'Text Me Records',
    'YNB',
    'The Brooklyn Bussdown',
    'Psyched SF',
    'XTRAFORMS',
    'JOOGMASTER J',
  ]
  
  // Map folder names to project display names
  const projectNameMap = {
    'Text me bridge logo': 'Text Me Records Logo',
    'Text Me Records': 'Text Me Records',
    'YNB': 'YNB',
    'Matrix Rave': 'Matrix Rave',
    'The Brooklyn Bussdown': 'The Brooklyn Bussdown',
    'Psyched SF': 'PSYCHED SF',
    'XTRAFORMS': 'XTRAFORMS',
    'JOOGMASTER J': 'JOOGMASTER J',
  }
  
  // Scan root media directory
  const items = fs.readdirSync(mediaDir)
  for (const item of items) {
    const fullPath = path.join(mediaDir, item)
    if (fs.statSync(fullPath).isDirectory() && item !== 'RBS') {
      // Check if this folder should be a project
      const folderName = item
      const isProjectFolder = projectFolders.some(pf => 
        folderName.toLowerCase().includes(pf.toLowerCase()) || 
        pf.toLowerCase().includes(folderName.toLowerCase())
      )
      
      if (isProjectFolder) {
        // Treat this folder as a project
        const projectFiles = scanDirectoryForFiles(fullPath, item)
        const projectImages = projectFiles.filter(f => f.type === 'image')
        const projectVideos = projectFiles.filter(f => f.type === 'video')
        
        // Use first image as thumbnail, or first video if no images
        const thumbnail = projectImages[0] || projectVideos[0]
        
        if (thumbnail && projectFiles.length > 0) {
          allProjects.push({
            name: projectNameMap[folderName] || folderName,
            folder: item,
            path: `/media/${item}`,
            thumbnail: thumbnail.path,
            thumbnailType: thumbnail.type,
            files: projectFiles,
            type: 'project',
          })
        }
      } else {
        // Check if this folder has subfolders (treat subfolders as projects)
        const subItems = fs.readdirSync(fullPath)
        const hasSubfolders = subItems.some(subItem => {
          const subPath = path.join(fullPath, subItem)
          return fs.statSync(subPath).isDirectory()
        })
        
        if (hasSubfolders) {
          // This folder has subfolders, treat them as projects
          const folderProjects = scanForProjects(fullPath, item)
          allProjects.push(...folderProjects)
        } else {
          // This folder has files, add them as individual files
          const folderFiles = scanDirectoryForFiles(fullPath, item)
          allFiles.push(...folderFiles)
        }
      }
    } else if (fs.statSync(fullPath).isFile()) {
      const ext = getFileExtension(item)
      if (isImageFile(item) || isVideoFile(item)) {
        const isVideo = isVideoFile(item)
        // Use R2 URL for videos if configured, otherwise use local path
        const filePath = isVideo && USE_R2_FOR_VIDEOS
          ? `${R2_PUBLIC_URL}/media/${item}`
          : `/media/${item}`
        
        allFiles.push({
          filename: item,
          path: filePath,
          type: isImageFile(item) ? 'image' : 'video',
          extension: ext,
          size: fs.statSync(fullPath).size,
        })
      }
    }
  }
  
  // Sort files by filename
  allFiles.sort((a, b) => a.filename.localeCompare(b.filename))
  
  // Sort projects by name
  allProjects.sort((a, b) => a.name.localeCompare(b.name))
  
  // Combine projects and files, projects first
  let allItems = [
    ...allProjects.map((project, index) => ({
      id: `project-${index + 1}`,
      ...project,
    })),
    ...allFiles.map((file, index) => ({
      id: `file-${index + 1}`,
      ...file,
    })),
  ]
  
  // Move XDRAR.mov to the first position if it exists
  const xdrarIndex = allItems.findIndex(item => 
    item.filename === 'XDRAR.mov' || item.path === '/media/XDRAR.mov'
  )
  if (xdrarIndex > 0) {
    const xdrarItem = allItems[xdrarIndex]
    allItems.splice(xdrarIndex, 1)
    allItems.unshift(xdrarItem)
    // Update the ID to ensure it's first
    xdrarItem.id = 'file-0'
  }

  // Ensure output directory exists
  const outputDir = path.dirname(outputFile)
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
  }

  // Write manifest with error handling
  try {
    const manifestJson = JSON.stringify(allItems, null, 2)
    // Validate JSON before writing
    JSON.parse(manifestJson)
    fs.writeFileSync(
      outputFile,
      manifestJson,
      'utf8'
    )
  } catch (error) {
    console.error('❌ Error writing manifest:', error.message)
    throw error
  }

  console.log(`✅ Generated media manifest with ${allItems.length} items`)
  console.log(`   Projects: ${allProjects.length}`)
  console.log(`   Individual files: ${allFiles.length}`)
  console.log(`   Images: ${allFiles.filter(f => f.type === 'image').length}`)
  console.log(`   Videos: ${allFiles.filter(f => f.type === 'video').length}`)
} catch (error) {
  console.error('Error generating media manifest:', error)
  process.exit(1)
}

