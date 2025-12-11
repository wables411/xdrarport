import { useEffect } from 'react'
import './Lightbox.css'

function Lightbox({ image, images, onClose, onNavigate }) {
  const currentIndex = images.indexOf(image)

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose()
      } else if (e.key === 'ArrowLeft') {
        onNavigate('prev')
      } else if (e.key === 'ArrowRight') {
        onNavigate('next')
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset'
    }
  }, [onClose, onNavigate])

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const handlePrevClick = (e) => {
    e.stopPropagation()
    onNavigate('prev')
  }

  const handleNextClick = (e) => {
    e.stopPropagation()
    onNavigate('next')
  }

  return (
    <div className="lightbox-overlay" onClick={handleOverlayClick}>
      <button className="lightbox-close" onClick={onClose}>
        ×
      </button>
      {images.length > 1 && (
        <>
          <button className="lightbox-nav lightbox-prev" onClick={handlePrevClick}>
            ‹
          </button>
          <button className="lightbox-nav lightbox-next" onClick={handleNextClick}>
            ›
          </button>
        </>
      )}
      <div className="lightbox-content">
        {(() => {
          // Decode URL-encoded path to check extension properly
          const decodedImage = decodeURIComponent(image)
          const lowerImage = decodedImage.toLowerCase()
          const isVideo = lowerImage.endsWith('.mp4') || 
                         lowerImage.endsWith('.mov') || 
                         lowerImage.endsWith('.avi') || 
                         lowerImage.endsWith('.webm') ||
                         lowerImage.endsWith('.ogg')
          
          return isVideo ? (
            <video
              src={image}
              controls
              loop={false}
              muted={false}
              style={{ maxWidth: '100%', maxHeight: '90vh', width: 'auto', height: 'auto' }}
              onError={(e) => {
                console.error('Failed to load video in lightbox:', image, e.target?.error)
              }}
              onLoadedData={(e) => {
                console.log('Successfully loaded video in lightbox:', image)
                // Try to play after load, but don't fail if blocked
                e.target.play().catch(() => {
                  // Autoplay blocked - user can click play button
                })
              }}
            >
              Your browser does not support the video tag.
            </video>
          ) : (
            <img 
              src={image} 
              alt="Portfolio" 
              style={{ maxWidth: '100%', maxHeight: '90vh', width: 'auto', height: 'auto' }}
              onError={(e) => {
                console.error('Failed to load image in lightbox:', image, e)
              }}
            />
          )
        })()}
      </div>
    </div>
  )
}

export default Lightbox

