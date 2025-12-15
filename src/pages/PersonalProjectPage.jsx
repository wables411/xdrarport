import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import ProjectPage from '../components/ProjectPage'
import Lightbox from '../components/Lightbox'
import { slugToName } from '../utils/urlSlug'

function PersonalProjectPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [project, setProject] = useState(null)
  const [manifest, setManifest] = useState([])
  const [lightboxImage, setLightboxImage] = useState(null)
  const [lightboxImages, setLightboxImages] = useState([])

  useEffect(() => {
    fetch('/media-manifest.json')
      .then(res => res.json())
      .then(data => {
        setManifest(data)
        
        // Find project by slug
        const found = slugToName(slug, data)
        if (found) {
          setProject(found)
        }
      })
      .catch(err => console.error('Failed to load manifest:', err))
  }, [slug])

  const handleClose = () => {
    navigate('/')
  }

  const handleOpenLightbox = (imageSrc, allImages) => {
    setLightboxImages(allImages)
    setLightboxImage(imageSrc)
  }

  const handleCloseLightbox = () => {
    setLightboxImage(null)
    setLightboxImages([])
  }

  const handleLightboxNavigate = (direction) => {
    const currentIndex = lightboxImages.indexOf(lightboxImage)
    let newIndex

    if (direction === 'next') {
      newIndex = (currentIndex + 1) % lightboxImages.length
    } else {
      newIndex = currentIndex - 1 < 0 ? lightboxImages.length - 1 : currentIndex - 1
    }

    setLightboxImage(lightboxImages[newIndex])
  }

  if (!project) {
    return (
      <div style={{ color: '#fff', padding: '40px', textAlign: 'center' }}>
        Loading...
      </div>
    )
  }

  return (
    <>
      <ProjectPage 
        project={project} 
        onClose={handleClose}
        onMediaClick={handleOpenLightbox}
        filters={{ locations: [], dates: [], mediaType: 'all' }}
        manifest={manifest}
      />
      {lightboxImage && (
        <Lightbox
          image={lightboxImage}
          images={lightboxImages}
          onClose={handleCloseLightbox}
          onNavigate={handleLightboxNavigate}
        />
      )}
    </>
  )
}

export default PersonalProjectPage
