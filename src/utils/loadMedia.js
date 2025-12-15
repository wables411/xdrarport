// Utility to load media files from the public/media directory

export function loadMediaFiles() {
  // In production, these will be served from /media
  // In development, Vite serves from public/
  
  const mediaFiles = []
  
  // Since we can't dynamically scan the filesystem in the browser,
  // we'll need to manually list files or use a build script
  // For now, return an empty array - we'll populate this with actual files
  
  return mediaFiles
}

// Helper to get file extension
export function getFileExtension(filename) {
  return filename.split('.').pop().toLowerCase()
}

// Check if file is an image
export function isImageFile(filename) {
  const ext = getFileExtension(filename)
  return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext)
}

// Check if file is a video
export function isVideoFile(filename) {
  const ext = getFileExtension(filename)
  return ['mp4', 'mov', 'avi', 'webm', 'ogg'].includes(ext)
}

// Get media type
export function getMediaType(filename) {
  if (isImageFile(filename)) return 'image'
  if (isVideoFile(filename)) return 'video'
  return 'unknown'
}











