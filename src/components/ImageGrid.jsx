import { useState, useEffect } from 'react'
import './ImageGrid.css'
import mediaManifest from '../data/media-manifest.json'

// Color palette for hover effects - each project gets a unique color
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

function ImageGrid({ onProjectClick, filters = { locations: [], dates: [], mediaType: 'all' } }) {
  const [mediaItems, setMediaItems] = useState([])
  const [filteredItems, setFilteredItems] = useState([])

  useEffect(() => {
    // Homepage now shows only XDRAR video, no projects
    // Don't set mediaItems to empty - we need it for filtering
    // But homepage should show XDRAR video when no filters
    setMediaItems([])
  }, [])

  useEffect(() => {
    // Check if any filter is active
    const hasActiveFilter = filters.mediaType !== 'all' || 
                           (filters.locations && filters.locations.length > 0) ||
                           (filters.dates && filters.dates.length > 0)

    if (!hasActiveFilter) {
      // No filters: show empty (homepage will show XDRAR video)
      setFilteredItems([])
      return
    }

    // Filters active: flatten all files from all projects and filter them
    const allFiles = []
    
    mediaManifest.forEach(item => {
      if (item.type === 'project' && item.files) {
        // Add all files from this project
        item.files.forEach((file, fileIndex) => {
          allFiles.push({
            ...file,
            id: file.id || `filtered-${item.id}-${fileIndex}`,
            projectId: item.id,
            projectName: item.name,
            projectFolder: item.folder
          })
        })
      } else if (item.type !== 'project') {
        // Individual files (not in projects)
        allFiles.push({
          ...item,
          id: item.id || `filtered-file-${allFiles.length}`
        })
      }
    })

    let filtered = [...allFiles]

    // Filter by media type
    if (filters.mediaType !== 'all') {
      filtered = filtered.filter(file => file.type === filters.mediaType)
    }

    // Filter by location
    if (filters.locations && filters.locations.length > 0) {
      // Map Matrix Rave and Petty Mart to Portion Club
      const locationMap = {
        'Matrix Rave': 'Portion Club',
        'petty mart': 'Portion Club',
        'portion club': 'Portion Club'
      }
      
      filtered = filtered.filter(file => {
        // Check if file path contains any selected location
        if (file.path) {
          const pathParts = file.path.split('/')
          const mediaIndex = pathParts.indexOf('media')
          if (mediaIndex >= 0 && pathParts[mediaIndex + 1]) {
            const folderName = pathParts[mediaIndex + 1]
            const mappedLocation = locationMap[folderName] || folderName
            return filters.locations.some(loc => {
              // Normalize comparison (case-insensitive)
              return mappedLocation.toLowerCase() === loc.toLowerCase() ||
                     folderName.toLowerCase() === loc.toLowerCase()
            })
          }
        }
        // Also check project folder if available
        if (file.projectFolder) {
          const mappedLocation = locationMap[file.projectFolder] || file.projectFolder
          return filters.locations.some(loc => {
            return mappedLocation.toLowerCase() === loc.toLowerCase() ||
                   file.projectFolder.toLowerCase() === loc.toLowerCase()
          })
        }
        return false
      })
    }

    // Filter by date
    if (filters.dates && filters.dates.length > 0) {
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

    setFilteredItems(filtered)
  }, [mediaItems, filters])

  const handleMediaClick = (item) => {
    // If it's a project, open project page
    // If it's a file (from filtered view), open in lightbox
    if (item.type === 'project') {
      onProjectClick(item)
    } else {
      // For filtered files, use the filteredItems for lightbox navigation
      // This ensures we only navigate through the filtered results
      const filteredFilePaths = filteredItems
        .filter(f => f.type === item.type)
        .map(f => f.path.split('/').map(segment => encodeURIComponent(segment)).join('/'))
      
      const currentPath = item.path.split('/').map(segment => encodeURIComponent(segment)).join('/')
      const currentIndex = filteredFilePaths.indexOf(currentPath)
      
      onProjectClick({
        type: item.type,
        path: item.path,
        filename: item.filename,
        lightboxFiles: filteredFilePaths,
        lightboxIndex: currentIndex >= 0 ? currentIndex : 0
      })
    }
  }

  // Check if we should show XDRAR video on homepage (no filters active)
  const hasActiveFilter = (filters?.mediaType && filters.mediaType !== 'all') || 
                         (filters?.locations && filters.locations.length > 0) ||
                         (filters?.dates && filters.dates.length > 0)

  // If filters are active, show filtered items; otherwise show XDRAR video
  // Always show XDRAR video on homepage when no filters and no items
  if (!hasActiveFilter && filteredItems.length === 0 && mediaItems.length === 0) {
    // Find XDRAR video from manifest
    const xdrarVideo = mediaManifest.find(item => 
      (item.filename && item.filename.toUpperCase().includes('XDRAR')) || 
      (item.path && item.path.toUpperCase().includes('XDRAR'))
    )
    const videoSrc = xdrarVideo ? xdrarVideo.path : 'https://pub-e843659987fb49ce82d3227ae212d21c.r2.dev/media/XDRAR.mp4'
    
    return (
      <div className="homepage-video-container">
        <video
          src={videoSrc}
          loop
          playsInline
          preload="auto"
          muted
          className="homepage-video"
          onClick={() => {
            // Open in lightbox when clicked
            const xdrarVideo = mediaManifest.find(item => 
              (item.filename && item.filename.toUpperCase().includes('XDRAR')) || 
              (item.path && item.path.toUpperCase().includes('XDRAR'))
            )
            const videoPath = xdrarVideo ? xdrarVideo.path : 'https://pub-e843659987fb49ce82d3227ae212d21c.r2.dev/media/XDRAR.mp4'
            onProjectClick({
              type: 'video',
              path: videoPath,
              filename: xdrarVideo?.filename || 'XDRAR.mp4',
              lightboxFiles: [videoPath],
              lightboxIndex: 0
            })
          }}
          onMouseEnter={(e) => {
            const video = e.target
            video.muted = false // Enable sound on hover
            video.play().catch(err => console.error('Video play error:', err))
          }}
          onMouseLeave={(e) => {
            const video = e.target
            video.muted = true // Mute when not hovering
            // Keep playing and looping
          }}
          onLoadedData={(e) => {
            // Try to play on load, but don't fail if autoplay is blocked
            const video = e.target
            video.muted = true // Start muted
            video.play().catch(() => {
              // Autoplay blocked - user will need to interact first
              // This is expected behavior and not an error
            })
          }}
        >
          Your browser does not support the video tag.
        </video>
      </div>
    )
  }

  // If we have items to show, render the grid
  const itemsToShow = filteredItems.length > 0 ? filteredItems : mediaItems
  
  if (itemsToShow.length > 0) {
    return (
      <div className="image-grid-wrapper">
        <div className="image-grid-container">
          <div className="image-grid">
            {itemsToShow.map((item, index) => {
            const hoverColor = PROJECT_COLORS[index % PROJECT_COLORS.length]
            const title = item.type === 'project' 
              ? item.name 
              : item.filename?.replace(/\.[^/.]+$/, '') || item.path?.split('/').pop()?.replace(/\.[^/.]+$/, '') || `Item ${index}`
            
            // #region agent log
            fetch('http://127.0.0.1:7242/ingest/74edaf60-af37-4359-ab5b-b4267d8ddea6',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'ImageGrid.jsx:45',message:'Title computed for item',data:{itemId:item.id,itemType:item.type,title:title,titleLength:title?.length,hasTitle:!!title},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
            // #endregion
            
            // For all projects, use thumbnail; for files, use the file itself
            let displayPath, displayType
            if (item.type === 'project') {
              // Use thumbnail (which excludes Lillard for RBS)
              displayPath = item.thumbnail
              displayType = item.thumbnailType
            } else {
              // For filtered files, use the file path directly
              displayPath = item.path
              displayType = item.type
            }
            
            // Encode paths properly, handling special characters like ? and spaces
            const encodedPath = displayPath ? displayPath.split('/').map(segment => encodeURIComponent(segment)).join('/') : displayPath
            
            return (
              <div
                key={item.id || item.path || `item-${index}`}
                className="image-item"
                onClick={() => handleMediaClick(item)}
                style={{ '--hover-color': hoverColor }}
                onMouseEnter={(e) => {
                  // #region agent log
                  console.log('[DEBUG] Hover enter - itemId:', item.id, 'title:', title, 'titleLength:', title?.length);
                  // #endregion
                  const overlayEl = e.currentTarget.querySelector('.thumbnail-overlay-text');
                  const wrapperEl = e.currentTarget.querySelector('.thumbnail-overlay-text-wrapper');
                  // #region agent log
                  console.log('[DEBUG] DOM - overlay exists:', !!overlayEl, 'wrapper exists:', !!wrapperEl, 'wrapper text:', wrapperEl?.textContent);
                  // #endregion
                  if (overlayEl) {
                    const computedStyle = window.getComputedStyle(overlayEl);
                    const rect = overlayEl.getBoundingClientRect();
                    // #region agent log
                    console.log('[DEBUG] Overlay - opacity:', computedStyle.opacity, 'display:', computedStyle.display, 'zIndex:', computedStyle.zIndex, 'width:', rect.width, 'height:', rect.height);
                    // #endregion
                  }
                  if (wrapperEl) {
                    const wrapperStyle = window.getComputedStyle(wrapperEl);
                    const wrapperRect = wrapperEl.getBoundingClientRect();
                    const parentRect = wrapperEl.parentElement?.getBoundingClientRect();
                    // #region agent log
                    console.log('[DEBUG] Wrapper - animation:', wrapperStyle.animation, 'animationName:', wrapperStyle.animationName, 'transform:', wrapperStyle.transform, 'wrapper width:', wrapperRect.width, 'parent width:', parentRect?.width);
                    // #endregion
                  }
                }}
                onMouseLeave={() => {
                  // #region agent log
                  console.log('[DEBUG] Hover leave - itemId:', item.id);
                  // #endregion
                }}
                onTouchStart={(e) => {
                  // For mobile devices - trigger the hover effect on touch
                  const overlayEl = e.currentTarget.querySelector('.thumbnail-overlay-text');
                  if (overlayEl) {
                    overlayEl.style.opacity = '1';
                    overlayEl.style.visibility = 'visible';
                  }
                }}
                onTouchEnd={(e) => {
                  // Hide text on touch end for mobile
                  const overlayEl = e.currentTarget.querySelector('.thumbnail-overlay-text');
                  if (overlayEl) {
                    overlayEl.style.opacity = '0';
                    overlayEl.style.visibility = 'hidden';
                  }
                }}
              >
                {displayType === 'image' ? (
                  <img
                    src={encodedPath}
                    alt={title}
                    loading="lazy"
                    style={{ width: '100%', height: 'auto', display: 'block', margin: 0, padding: 0 }}
                    onError={(e) => {
                      console.error('Failed to load image:', encodedPath, displayPath, e)
                    }}
                    onLoad={() => {
                      console.log('Successfully loaded image:', encodedPath)
                    }}
                  />
                ) : (
                  <video
                    src={encodedPath}
                    muted
                    loop
                    playsInline
                    preload="auto"
                    style={{ width: '100%', height: 'auto', display: 'block', margin: 0, padding: 0 }}
                    onMouseEnter={(e) => {
                      e.target.play().catch(err => console.error('Video play error:', err))
                    }}
                    onMouseLeave={(e) => {
                      e.target.pause()
                      // For Matrix Rave, keep the later frame; for others, reset to start
                      const isMatrixRave = item.folder && (item.folder.includes('Matrix Rave') || item.folder === 'Matrix Rave')
                      if (!isMatrixRave) {
                        e.target.currentTime = 0
                      } else {
                        // Keep at 3 seconds for Matrix Rave
                        if (e.target.duration && e.target.duration > 3) {
                          e.target.currentTime = 3
                        }
                      }
                    }}
                    onError={(e) => {
                      console.error('Failed to load video:', encodedPath, displayPath, e)
                    }}
                    onLoadedData={(e) => {
                      console.log('Successfully loaded video:', encodedPath)
                      // For Matrix Rave thumbnails, set to a frame 3 seconds later
                      const isMatrixRave = item.folder && (item.folder.includes('Matrix Rave') || item.folder === 'Matrix Rave')
                      if (item.type === 'project' && isMatrixRave) {
                        const video = e.target
                        if (video.duration && video.duration > 3) {
                          video.currentTime = 3 // Set to 3 seconds in
                        }
                      }
                    }}
                    onLoadedMetadata={(e) => {
                      // Also set on metadata load in case loadedData doesn't fire
                      const isMatrixRave = item.folder && (item.folder.includes('Matrix Rave') || item.folder === 'Matrix Rave')
                      if (item.type === 'project' && isMatrixRave) {
                        const video = e.target
                        if (video.duration && video.duration > 3) {
                          video.currentTime = 3 // Set to 3 seconds in
                        }
                      }
                    }}
                  />
                )}
                <div className="thumbnail-overlay-text">
                  <span className="thumbnail-overlay-text-wrapper">{title}</span>
                </div>
              </div>
            )
            })}
          </div>
        </div>
      </div>
    )
  }
  
  // If no items and no filters, show nothing (XDRAR video should have been shown above)
  return null
}

export default ImageGrid

