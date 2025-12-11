import { useState, useEffect } from 'react'
import Header from './components/Header'
import ImageGrid from './components/ImageGrid'
import ContactModal from './components/ContactModal'
import FilterModal from './components/FilterModal'
import SocialButtons from './components/SocialButtons'
import AboutSection from './components/AboutSection'
import ProjectPage from './components/ProjectPage'
import Lightbox from './components/Lightbox'

function App() {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false)
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)
  const [showSocialButtons, setShowSocialButtons] = useState(false)
  const [showAboutSection, setShowAboutSection] = useState(false)
  const [filters, setFilters] = useState({
    locations: [],
    dates: [],
    mediaType: 'all'
  })
  const [currentProject, setCurrentProject] = useState(null)
  const [lightboxImage, setLightboxImage] = useState(null)
  const [lightboxImages, setLightboxImages] = useState([])

  const handleOpenContact = () => {
    setIsContactModalOpen(true)
  }

  const handleCloseContact = () => {
    setIsContactModalOpen(false)
  }

  const handleScrollToPortfolio = () => {
    setShowSocialButtons(false)
    setShowAboutSection(false)
    const gridElement = document.querySelector('.image-grid-container')
    if (gridElement) {
      gridElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const handleScrollToSocials = () => {
    setShowSocialButtons(true)
    // Scroll to social buttons after a brief delay to ensure they're rendered
    setTimeout(() => {
      const socialElement = document.querySelector('.social-buttons')
      if (socialElement) {
        socialElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
      } else {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
      }
    }, 100)
  }

  const handleOpenFilter = () => {
    setIsFilterModalOpen(true)
  }

  const handleCloseFilter = () => {
    setIsFilterModalOpen(false)
  }

  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters)
  }

  const handleScrollToAbout = () => {
    setShowSocialButtons(false)
    setShowAboutSection(true)
    // Scroll to about section after a brief delay to ensure it's rendered
    setTimeout(() => {
      const aboutElement = document.getElementById('about')
      if (aboutElement) {
        aboutElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }, 100)
  }

  const handleArchiveClick = () => {
    setShowSocialButtons(false)
    setShowAboutSection(false)
    // TODO: Implement archive functionality
    console.log('Archive clicked')
  }

  const handleHomeClick = () => {
    setCurrentProject(null)
    setShowSocialButtons(false)
    setShowAboutSection(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleProjectClick = (project) => {
    // Check if this is a filtered file (has lightboxFiles) or a project
    if (project.lightboxFiles && project.lightboxFiles.length > 0) {
      // It's a filtered file - open in lightbox
      setLightboxImages(project.lightboxFiles)
      setLightboxImage(project.lightboxFiles[project.lightboxIndex] || project.lightboxFiles[0])
    } else {
      // It's a project - open project page
      setCurrentProject(project)
      // Update URL hash (project.id already includes "project-" prefix)
      if (project.id) {
        window.location.hash = `#${project.id}`
      }
      // Scroll to top when opening a project
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleProjectSelect = (project) => {
    setCurrentProject(project)
    setShowSocialButtons(false)
    setShowAboutSection(false)
    // Update URL hash (project.id already includes "project-" prefix)
    if (project.id) {
      window.location.hash = `#${project.id}`
    }
    // Scroll to top when opening a project
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleCloseProject = () => {
    setCurrentProject(null)
    setShowSocialButtons(false)
    setShowAboutSection(false)
    // Clear hash
    window.location.hash = ''
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

  const [manifest, setManifest] = useState([])

  // Load manifest on mount
  useEffect(() => {
    fetch('/media-manifest.json')
      .then(res => res.json())
      .then(data => setManifest(data))
      .catch(err => console.error('Failed to load manifest:', err))
  }, [])

  // Handle hash routing for project pages
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash
      if (manifest.length === 0) {
        // Manifest not loaded yet, wait for it
        return
      }
      
      console.log('[App] Hash change:', hash, 'Manifest length:', manifest.length)
      if (hash && hash.startsWith('#')) {
        const projectId = hash.replace('#', '')
        console.log('[App] Looking for project:', projectId)
        // Find project in manifest (projectId is already "project-10" format)
        const project = manifest.find(p => p.id === projectId && p.type === 'project')
        console.log('[App] Found project:', project ? project.name : 'NOT FOUND')
        if (project) {
          setCurrentProject(project)
        }
      } else if (!hash) {
        setCurrentProject(null)
      }
    }

    // Check hash whenever manifest loads or hash changes
    handleHashChange()

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [manifest])

  return (
    <div className="app">
      <Header
        onContactClick={handleOpenContact}
        onPortfolioClick={handleScrollToPortfolio}
        onHomeClick={handleHomeClick}
        onAboutClick={handleScrollToAbout}
        onProjectSelect={handleProjectSelect}
        onArchiveClick={handleArchiveClick}
      />
      {!currentProject ? (
        <>
          <ImageGrid onProjectClick={handleProjectClick} filters={filters} />
          {showSocialButtons && <SocialButtons />}
          {showAboutSection && <AboutSection />}
        </>
      ) : (
        <ProjectPage 
          project={currentProject} 
          onClose={handleCloseProject}
          onMediaClick={handleOpenLightbox}
          filters={filters}
        />
      )}
      {isContactModalOpen && <ContactModal onClose={handleCloseContact} />}
      {isFilterModalOpen && (
        <FilterModal
          isOpen={isFilterModalOpen}
          onClose={handleCloseFilter}
          onApplyFilters={handleApplyFilters}
          currentFilters={filters}
        />
      )}
      {lightboxImage && (
        <Lightbox
          image={lightboxImage}
          images={lightboxImages}
          onClose={handleCloseLightbox}
          onNavigate={handleLightboxNavigate}
        />
      )}
    </div>
  )
}

export default App

