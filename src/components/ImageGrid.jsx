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

function ImageGrid({ onProjectClick }) {
  const [mediaItems, setMediaItems] = useState([])

  useEffect(() => {
    // Load media files from manifest
    console.log('Media manifest loaded:', mediaManifest.length, 'items')
    const planetaProject = mediaManifest.find(item => item.name && item.name.includes('Planeta'))
    if (planetaProject) {
      console.log('Planeta Pisces project found:', planetaProject)
      console.log('Thumbnail path:', planetaProject.thumbnail)
    }
    setMediaItems(mediaManifest)
  }, [])

  const handleMediaClick = (item) => {
    onProjectClick(item)
  }

  return (
    <div className="image-grid-wrapper">
      <div className="image-grid-container">
        <div className="image-grid">
          {mediaItems.map((item, index) => {
            const hoverColor = PROJECT_COLORS[index % PROJECT_COLORS.length]
            const title = item.type === 'project' 
              ? item.name 
              : item.filename?.replace(/\.[^/.]+$/, '') || `Item ${item.id}`
            
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
              displayPath = item.path
              displayType = item.type
            }
            
            // Encode paths with spaces for proper URL handling
            const encodedPath = displayPath ? encodeURI(displayPath) : displayPath
            
            return (
              <div
                key={item.id}
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
                  const wrapperEl = e.currentTarget.querySelector('.thumbnail-overlay-text-wrapper');
                  if (overlayEl) {
                    overlayEl.style.opacity = '1';
                    overlayEl.style.visibility = 'visible';
                  }
                  if (wrapperEl) {
                    wrapperEl.style.animation = 'scroll-text-horizontal 6s linear infinite';
                  }
                }}
                onTouchEnd={(e) => {
                  // Stop animation on touch end for mobile
                  const overlayEl = e.currentTarget.querySelector('.thumbnail-overlay-text');
                  const wrapperEl = e.currentTarget.querySelector('.thumbnail-overlay-text-wrapper');
                  if (overlayEl) {
                    overlayEl.style.opacity = '0';
                    overlayEl.style.visibility = 'hidden';
                  }
                  if (wrapperEl) {
                    wrapperEl.style.animation = 'none';
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
                      e.target.currentTime = 0
                    }}
                    onError={(e) => {
                      console.error('Failed to load video:', encodedPath, displayPath, e)
                    }}
                    onLoadedData={() => {
                      console.log('Successfully loaded video:', encodedPath)
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

export default ImageGrid

