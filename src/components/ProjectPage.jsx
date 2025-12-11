import { useState, useEffect } from 'react'
import './ProjectPage.css'

// Color palette for hover effects - same as ImageGrid
const PROJECT_COLORS = [
  '#FF6B6B', // Red
  '#4ECDC4', // Teal
  '#45B7D1', // Blue
  '#FFA07A', // Light Salmon
  '#98D8C8', // Mint
  '#F7DC6F', // Yellow
  '#BB8FCE', // Purple
  '#85C1E2', // Sky Blue
  '#F8B739', // Orange
  '#52BE80', // Green
  '#EC7063', // Coral
  '#5DADE2', // Light Blue
]

function ProjectPage({ project, onClose, onMediaClick, filters = { locations: [], dates: [], mediaType: 'all' } }) {
  const [showcasedMediaIndex, setShowcasedMediaIndex] = useState(0)
  
  if (!project) return null

  // Filter project files based on filters
  const getFilteredFiles = () => {
    if (!project.files && !project.videos) return []

    const filesToFilter = project.videos || project.files || []
    let filtered = [...filesToFilter]

    // Filter by media type
    if (filters.mediaType !== 'all') {
      filtered = filtered.filter(file => file.type === filters.mediaType)
    }

    // Filter by location (already in project, so skip if project matches)
    if (filters.locations && filters.locations.length > 0) {
      // Map Matrix Rave and Petty Mart to Portion Club
      const locationMap = {
        'Matrix Rave': 'Portion Club',
        'petty mart': 'Portion Club',
        'portion club': 'Portion Club'
      }
      const mappedProjectLocation = locationMap[project.folder] || project.folder
      const projectMatches = project.folder && filters.locations.some(loc => {
        return mappedProjectLocation.toLowerCase() === loc.toLowerCase() ||
               project.folder.toLowerCase() === loc.toLowerCase()
      })
      if (!projectMatches) {
        return [] // Hide entire project if location doesn't match
      }
    }

    // Filter by date
    if (filters.dates && filters.dates.length > 0) {
      // Check project date
      let projectMatches = false
      if (project.date) {
        let projectDate
        if (typeof project.date === 'string') {
          projectDate = project.date
        } else if (project.date && project.date.year) {
          projectDate = `${project.date.year}-${String(project.date.month || 1).padStart(2, '0')}`
        }
        if (projectDate && filters.dates.includes(projectDate)) {
          projectMatches = true
        }
      }
      
      // If project doesn't match, check if any files match
      if (!projectMatches) {
        const hasMatchingFile = filtered.some(file => {
          if (file.date) {
            let fileDate
            if (typeof file.date === 'string') {
              fileDate = file.date
            } else if (file.date && file.date.year) {
              fileDate = `${file.date.year}-${String(file.date.month || 1).padStart(2, '0')}`
            }
            return fileDate && filters.dates.includes(fileDate)
          }
          return false
        })
        
        if (!hasMatchingFile) {
          // Filter out files that don't match the date
          filtered = filtered.filter(file => {
            if (file.date) {
              let fileDate
              if (typeof file.date === 'string') {
                fileDate = file.date
              } else if (file.date && file.date.year) {
                fileDate = `${file.date.year}-${String(file.date.month || 1).padStart(2, '0')}`
              }
              return fileDate && filters.dates.includes(fileDate)
            }
            return false
          })
        }
      }
    }

    return filtered
  }

  const filteredFiles = getFilteredFiles()
  const filteredVideos = project.videos ? getFilteredFiles() : null

  // Get all media files for the project
  const allMedia = filteredVideos || filteredFiles || []
  
  // Debug logging
  console.log('[ProjectPage] Project:', project.name, 'Files:', allMedia.length, 'Videos:', allMedia.filter(f => f.type === 'video').length)
  
  // Reset showcased media index when filters change or media changes
  useEffect(() => {
    if (allMedia.length > 0) {
      if (showcasedMediaIndex >= allMedia.length || showcasedMediaIndex < 0) {
        setShowcasedMediaIndex(0)
      }
    }
  }, [allMedia.length, showcasedMediaIndex])
  
  // Use showcasedMediaIndex to determine which media is showcased
  const validIndex = allMedia.length > 0 ? Math.min(showcasedMediaIndex, allMedia.length - 1) : 0
  const showcasedMedia = allMedia.length > 0 ? allMedia[validIndex] : null
  const thumbnailMedia = allMedia.filter((_, index) => index !== validIndex)

  // Get all paths for lightbox navigation
  const getAllMediaPaths = () => {
    if (project.videos) {
      return (filteredVideos || []).map(v => v.path)
    }
    if (project.files) {
      return (filteredFiles || []).map(f => f.path)
    }
    return []
  }

  const allMediaPaths = getAllMediaPaths()

  const handleShowcasedMediaClick = () => {
    // Clicking showcased media opens it in lightbox
    if (showcasedMedia) {
      const encodedPath = showcasedMedia.path && (showcasedMedia.path.startsWith('http://') || showcasedMedia.path.startsWith('https://'))
        ? encodeURI(showcasedMedia.path)
        : showcasedMedia.path.split('/').map(segment => encodeURIComponent(segment)).join('/')
      const encodedPaths = allMediaPaths.map(p => {
        if (!p) return p
        if (p.startsWith('http://') || p.startsWith('https://')) {
          return encodeURI(p)
        }
        return p.split('/').map(segment => encodeURIComponent(segment)).join('/')
      })
      onMediaClick(encodedPath, encodedPaths)
    }
  }

  const handleThumbnailClick = (index) => {
    // Clicking a thumbnail makes it the showcased media
    setShowcasedMediaIndex(index)
  }

  return (
    <div className="project-page">
      <button className="project-close" onClick={onClose}>
        ×
      </button>
      <div className="project-content">
        <div className="project-header">
          <h1 className="project-title">
            {project.title || project.name || project.filename?.replace(/\.[^/.]+$/, '') || `Project ${project.id}`}
          </h1>
        </div>
        
        {project.type === 'project' && allMedia.length > 0 ? (
          <div className="project-layout">
            {/* Left side: Showcased media */}
            <div className="project-showcase">
              {showcasedMedia && (
                <div 
                  className="project-showcase-media"
                  onClick={handleShowcasedMediaClick}
                >
                  {showcasedMedia.type === 'video' ? (
                    <video
                      src={showcasedMedia.path && (showcasedMedia.path.startsWith('http://') || showcasedMedia.path.startsWith('https://')) 
                        ? encodeURI(showcasedMedia.path)
                        : showcasedMedia.path.split('/').map(segment => encodeURIComponent(segment)).join('/')}
                      loop
                      playsInline
                      preload="auto"
                      autoPlay
                      style={{ width: '100%', height: 'auto', display: 'block', cursor: 'pointer' }}
                      onMouseEnter={(e) => {
                        const video = e.target
                        video.muted = false // Enable sound on hover
                        video.play().catch(err => {
                          console.error('Video play error:', err)
                        })
                      }}
                      onMouseLeave={(e) => {
                        const video = e.target
                        video.muted = true // Mute when not hovering
                        // Keep playing and looping, just muted
                      }}
                      onLoadedData={(e) => {
                        // Start playing and looping automatically
                        const video = e.target
                        video.muted = true // Start muted
                        video.play().catch(err => {
                          console.error('Video autoplay error:', err)
                        })
                      }}
                    >
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <img
                      src={showcasedMedia.path && (showcasedMedia.path.startsWith('http://') || showcasedMedia.path.startsWith('https://')) 
                        ? showcasedMedia.path 
                        : showcasedMedia.path.split('/').map(segment => encodeURIComponent(segment)).join('/')}
                      alt={showcasedMedia.filename || 'Showcased media'}
                      loading="eager"
                      style={{ width: '100%', height: 'auto', display: 'block', cursor: 'pointer' }}
                      onLoad={(e) => {
                        // For GIFs, ensure they loop (GIFs loop by default, but we can force reload if needed)
                        const isGif = showcasedMedia.filename && showcasedMedia.filename.toLowerCase().endsWith('.gif')
                        if (isGif) {
                          // GIFs loop automatically, but we can ensure it's set
                          const img = e.target
                          // Force reload to ensure looping if it stopped
                          if (img.complete) {
                            img.src = img.src // Force reload to restart animation
                          }
                        }
                      }}
                    />
                  )}
                </div>
              )}
            </div>

            {/* Right side: Description + Thumbnails */}
            <div className="project-sidebar">
              {/* Project Description */}
              <div className="project-description">
                {project.description ? (
                  <p>{project.description}</p>
                ) : (
                  <p className="project-description-placeholder">Project description coming soon...</p>
                )}
              </div>

              {/* Thumbnail Grid */}
              {thumbnailMedia.length > 0 && (
                <div className="project-thumbnails">
                  {thumbnailMedia.map((file, index) => {
                    // Find the original index in allMedia
                    const originalIndex = allMedia.findIndex(m => m.path === file.path)
                    return (
                      <div
                        key={index}
                        className="project-thumbnail-item"
                        onClick={() => handleThumbnailClick(originalIndex)}
                      >
                        {file.type === 'video' ? (
                          <video
                            src={file.path && (file.path.startsWith('http://') || file.path.startsWith('https://')) 
                              ? encodeURI(file.path)
                              : file.path.split('/').map(segment => encodeURIComponent(segment)).join('/')}
                            muted
                            loop
                            playsInline
                            preload="metadata"
                            onError={(e) => {
                              console.error('Video load error:', file.filename, file.path, e.target?.error)
                            }}
                            onLoadStart={() => {
                              console.log('Video loading:', file.filename, file.path)
                            }}
                            style={{ width: '100%', height: 'auto', display: 'block' }}
                            onMouseEnter={(e) => e.target.play()}
                            onMouseLeave={(e) => {
                              e.target.pause()
                              // For Matrix Rave, keep the later frame; for others, reset to start
                              const isMatrixRave = project.folder && (project.folder.includes('Matrix Rave') || project.folder === 'Matrix Rave')
                              if (!isMatrixRave) {
                                e.target.currentTime = 0
                              } else {
                                // Keep at 3 seconds for Matrix Rave
                                if (e.target.duration && e.target.duration > 3) {
                                  e.target.currentTime = 3
                                }
                              }
                            }}
                            onLoadedData={(e) => {
                              // For Matrix Rave thumbnails, set to a frame 3 seconds later
                              const isMatrixRave = project.folder && (project.folder.includes('Matrix Rave') || project.folder === 'Matrix Rave')
                              if (isMatrixRave) {
                                const video = e.target
                                if (video.duration && video.duration > 3) {
                                  video.currentTime = 3 // Set to 3 seconds in
                                }
                              }
                            }}
                            onLoadedMetadata={(e) => {
                              // Also set on metadata load in case loadedData doesn't fire
                              const isMatrixRave = project.folder && (project.folder.includes('Matrix Rave') || project.folder === 'Matrix Rave')
                              if (isMatrixRave) {
                                const video = e.target
                                if (video.duration && video.duration > 3) {
                                  video.currentTime = 3 // Set to 3 seconds in
                                }
                              }
                            }}
                          />
                        ) : (
                          <img
                            src={file.path && (file.path.startsWith('http://') || file.path.startsWith('https://')) 
                              ? file.path 
                              : file.path.split('/').map(segment => encodeURIComponent(segment)).join('/')}
                            alt={file.filename || `Thumbnail ${index + 1}`}
                            loading="lazy"
                            style={{ width: '100%', height: 'auto', display: 'block' }}
                          />
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        ) : allMedia.length === 0 ? (
          <div className="no-results">No media matches the current filters.</div>
        ) : project.type === 'video' ? (
          <video
            src={project.path}
            controls
            autoPlay
            loop
            className="project-image"
          >
            Your browser does not support the video tag.
          </video>
        ) : (
          <img
            src={project.path}
            alt={project.title || project.filename || `Project ${project.id}`}
            className="project-image"
          />
        )}
      </div>
    </div>
  )
}

export default ProjectPage

