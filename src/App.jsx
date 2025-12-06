import { useState } from 'react'
import Header from './components/Header'
import ImageGrid from './components/ImageGrid'
import ContactModal from './components/ContactModal'
import SocialButtons from './components/SocialButtons'
import ProjectPage from './components/ProjectPage'
import Lightbox from './components/Lightbox'

function App() {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false)
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
    const gridElement = document.querySelector('.image-grid-container')
    if (gridElement) {
      gridElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const handleScrollToSocials = () => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
  }

  const handleHomeClick = () => {
    setCurrentProject(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleProjectClick = (project) => {
    setCurrentProject(project)
  }

  const handleCloseProject = () => {
    setCurrentProject(null)
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

  return (
    <div className="app">
      <Header
        onContactClick={handleOpenContact}
        onPortfolioClick={handleScrollToPortfolio}
        onSocialsClick={handleScrollToSocials}
        onHomeClick={handleHomeClick}
      />
      {!currentProject ? (
        <>
          <ImageGrid onProjectClick={handleProjectClick} />
          <SocialButtons />
        </>
      ) : (
        <ProjectPage 
          project={currentProject} 
          onClose={handleCloseProject}
          onMediaClick={handleOpenLightbox}
        />
      )}
      {isContactModalOpen && <ContactModal onClose={handleCloseContact} />}
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

