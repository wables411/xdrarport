import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import ProjectPage from '../components/ProjectPage'
import Lightbox from '../components/Lightbox'
import { slugToClientName, slugToName } from '../utils/urlSlug'

function ClientPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [project, setProject] = useState(null)
  const [manifest, setManifest] = useState([])
  const [lightboxImage, setLightboxImage] = useState(null)
  const [lightboxImages, setLightboxImages] = useState([])

  useEffect(() => {
    console.log('[ClientPage] Loading project for slug:', slug)
    
    // Don't try to load reserved routes as projects
    if (slug === 'archive') {
      navigate('/archive', { replace: true })
      return
    }

    fetch('/media-manifest.json')
      .then(res => res.json())
      .then(data => {
        console.log('[ClientPage] Manifest loaded, length:', data.length)
        setManifest(data)
        
        // Special handling for CRYBABY first
        if (slug === 'crybaby' || slug === 'crybaby-oakland') {
          const crybabyProjects = data.filter(p => 
            p.type === 'project' && p.folder && p.folder.includes('CRYBABY')
          )
          console.log('[ClientPage] Found CRYBABY projects:', crybabyProjects.length)
          if (crybabyProjects.length > 0) {
            setProject({
              name: 'CRYBABY OAKLAND',
              folder: 'CRYBABY',
              isCrybabyClient: true,
              subProjects: crybabyProjects,
              type: 'project'
            })
            return
          }
        }
        
        // Find project by slug
        const clientName = slugToClientName(slug)
        console.log('[ClientPage] Client name from slug:', clientName)
        if (clientName) {
          // Find by client name mapping
          const found = data.find(item => 
            item.type === 'project' && (
              item.name === clientName ||
              item.folder === clientName ||
              item.name.includes(clientName) ||
              clientName.includes(item.name)
            )
          )
          
          if (found) {
            console.log('[ClientPage] Found project by client name:', found.name)
            setProject(found)
            return
          }
        }
        
        // Try slug to name conversion
        const foundByName = slugToName(slug, data)
        if (foundByName) {
          console.log('[ClientPage] Found project by name:', foundByName.name)
          setProject(foundByName)
          return
        }
        
        // If no project found, redirect to home
        console.warn('[ClientPage] Project not found for slug:', slug)
        navigate('/', { replace: true })
      })
      .catch(err => {
        console.error('[ClientPage] Failed to load manifest:', err)
        navigate('/', { replace: true })
      })
  }, [slug, navigate])

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

export default ClientPage
