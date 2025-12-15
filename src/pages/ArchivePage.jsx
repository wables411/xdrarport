import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import ImageGrid from '../components/ImageGrid'
import FilterModal from '../components/FilterModal'
import './ArchivePage.css'

function ArchivePage() {
  const [filters, setFilters] = useState({
    locations: [],
    dates: [],
    mediaType: 'all'
  })
  const [archiveMediaType, setArchiveMediaType] = useState('all')
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)
  const [manifest, setManifest] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    fetch('/media-manifest.json')
      .then(res => res.json())
      .then(data => setManifest(data))
      .catch(err => console.error('Failed to load manifest:', err))
  }, [])

  const handleProjectClick = (project) => {
    // This is only called for lightbox files, not projects
    // Projects are handled by ImageGrid's navigation
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

  return (
    <>
      <ImageGrid 
        onProjectClick={handleProjectClick} 
        filters={filters}
        archiveMode={true}
        archiveMediaType={archiveMediaType}
        manifest={manifest}
        archiveDateFilter={filters.dates && filters.dates.length > 0 ? filters.dates[0] : null}
      />
      <div className="archive-filter-button">
        <button 
          onClick={() => {
            const types = ['all', 'image', 'video']
            const currentIndex = types.indexOf(archiveMediaType)
            const nextIndex = (currentIndex + 1) % types.length
            setArchiveMediaType(types[nextIndex])
          }}
          className="archive-filter-btn"
          style={{ marginBottom: '8px', display: 'block', width: '100%' }}
        >
          Type: {archiveMediaType === 'all' ? 'All' : archiveMediaType === 'image' ? 'Images' : 'Videos'}
        </button>
        <button
          onClick={handleOpenFilter}
          className="archive-filter-btn"
          style={{ display: 'block', width: '100%' }}
        >
          Filter by Date
        </button>
      </div>
      {isFilterModalOpen && (
        <FilterModal
          isOpen={isFilterModalOpen}
          onClose={handleCloseFilter}
          onApplyFilters={handleApplyFilters}
          currentFilters={filters}
        />
      )}
    </>
  )
}

export default ArchivePage
