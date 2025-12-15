import { useState, useEffect } from 'react'
import ImageGrid from '../components/ImageGrid'

function HomePage() {
  const [manifest, setManifest] = useState([])
  
  useEffect(() => {
    fetch('/media-manifest.json')
      .then(res => res.json())
      .then(data => setManifest(data))
      .catch(err => console.error('Failed to load manifest:', err))
  }, [])

  return (
    <>
      <ImageGrid 
        onProjectClick={() => {}} 
        filters={{ locations: [], dates: [], mediaType: 'all' }} 
        manifest={manifest} 
      />
    </>
  )
}

export default HomePage
