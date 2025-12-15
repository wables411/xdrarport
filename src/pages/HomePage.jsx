import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import ImageGrid from '../components/ImageGrid'
import AboutSection from '../components/AboutSection'

function HomePage() {
  const location = useLocation()
  const [manifest, setManifest] = useState([])
  
  useEffect(() => {
    fetch('/media-manifest.json')
      .then(res => res.json())
      .then(data => setManifest(data))
      .catch(err => console.error('Failed to load manifest:', err))
  }, [])

  // Handle hash navigation
  useEffect(() => {
    if (location.hash === '#about') {
      setTimeout(() => {
        const aboutElement = document.getElementById('about')
        if (aboutElement) {
          aboutElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }, 100)
    }
  }, [location.hash])

  return (
    <>
      <ImageGrid 
        onProjectClick={() => {}} 
        filters={{ locations: [], dates: [], mediaType: 'all' }} 
        manifest={manifest} 
      />
      <AboutSection />
    </>
  )
}

export default HomePage
