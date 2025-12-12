import { useState, useEffect } from 'react'
import './FilterModal.css'

function FilterModal({ isOpen, onClose, onApplyFilters, currentFilters }) {
  const [selectedLocations, setSelectedLocations] = useState(currentFilters?.locations || [])
  const [selectedDates, setSelectedDates] = useState(currentFilters?.dates || [])
  const [selectedMediaType, setSelectedMediaType] = useState(currentFilters?.mediaType || 'all')
  const [manifest, setManifest] = useState([])

  // Load manifest on mount
  useEffect(() => {
    fetch('/media-manifest.json')
      .then(res => res.json())
      .then(data => setManifest(data))
      .catch(err => console.error('Failed to load manifest:', err))
  }, [])

  // Extract unique locations from manifest
  // Map Matrix Rave and Petty Mart to Portion Club
  const locationMap = {
    'Matrix Rave': 'Portion Club',
    'petty mart': 'Portion Club',
    'portion club': 'Portion Club'
  }
  
  const allLocations = manifest
    .filter(item => item.type === 'project' && item.folder)
    .map(item => {
      // Map Matrix Rave and Petty Mart to Portion Club
      const mappedLocation = locationMap[item.folder] || item.folder
      return mappedLocation
    })
    .concat(
      manifest
        .filter(item => item.type === 'project' && item.files)
        .flatMap(item => {
          return item.files.map(file => {
            // Extract location from path
            const pathParts = file.path.split('/')
            const mediaIndex = pathParts.indexOf('media')
            if (mediaIndex >= 0 && pathParts[mediaIndex + 1]) {
              const folderName = pathParts[mediaIndex + 1]
              // Map Matrix Rave and Petty Mart to Portion Club
              return locationMap[folderName] || folderName
            }
            return null
          })
        })
        .filter(Boolean)
    )
  
  const locations = [...new Set(allLocations)].sort()

  // Extract unique dates from manifest (both projects and files)
  const allDates = new Set()
  
  manifest.forEach(item => {
    // Check project date
    if (item.date) {
      let dateStr
      if (typeof item.date === 'string') {
        dateStr = item.date
      } else if (item.date && item.date.year) {
        dateStr = `${item.date.year}-${String(item.date.month || 1).padStart(2, '0')}`
      }
      if (dateStr) allDates.add(dateStr)
    }
    
    // Check file dates within projects
    if (item.files) {
      item.files.forEach(file => {
        if (file.date) {
          let dateStr
          if (typeof file.date === 'string') {
            dateStr = file.date
          } else if (file.date && file.date.year) {
            dateStr = `${file.date.year}-${String(file.date.month || 1).padStart(2, '0')}`
          }
          if (dateStr) allDates.add(dateStr)
        }
      })
    }
  })
  
  // Format dates for display and create a map
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December']
  
  const dates = Array.from(allDates)
    .sort()
    .reverse()
    .map(dateStr => {
      const [year, month] = dateStr.split('-')
      return {
        value: dateStr,
        display: `${monthNames[parseInt(month) - 1]} ${year}`
      }
    })

  useEffect(() => {
    if (isOpen && currentFilters) {
      setSelectedLocations(currentFilters.locations || [])
      setSelectedDates(currentFilters.dates || [])
      setSelectedMediaType(currentFilters.mediaType || 'all')
    }
  }, [isOpen, currentFilters])

  const handleLocationToggle = (location) => {
    setSelectedLocations(prev =>
      prev.includes(location)
        ? prev.filter(l => l !== location)
        : [...prev, location]
    )
  }

  const handleDateToggle = (date) => {
    setSelectedDates(prev =>
      prev.includes(date)
        ? prev.filter(d => d !== date)
        : [...prev, date]
    )
  }

  const handleApply = () => {
    onApplyFilters({
      locations: selectedLocations,
      dates: selectedDates,
      mediaType: selectedMediaType
    })
    onClose()
  }

  const handleClear = () => {
    setSelectedLocations([])
    setSelectedDates([])
    setSelectedMediaType('all')
    onApplyFilters({
      locations: [],
      dates: [],
      mediaType: 'all'
    })
  }

  if (!isOpen) return null

  return (
    <div className="filter-modal-overlay" onClick={onClose}>
      <div className="filter-modal" onClick={(e) => e.stopPropagation()}>
        <button className="filter-modal-close" onClick={onClose}>
          ×
        </button>
        <h2 className="filter-modal-title">Filter Media</h2>
        
        <div className="filter-section">
          <h3 className="filter-section-title">Media Type</h3>
          <div className="filter-radio-group">
            <label className="filter-radio">
              <input
                type="radio"
                name="mediaType"
                value="all"
                checked={selectedMediaType === 'all'}
                onChange={(e) => setSelectedMediaType(e.target.value)}
              />
              <span>All</span>
            </label>
            <label className="filter-radio">
              <input
                type="radio"
                name="mediaType"
                value="image"
                checked={selectedMediaType === 'image'}
                onChange={(e) => setSelectedMediaType(e.target.value)}
              />
              <span>Images Only</span>
            </label>
            <label className="filter-radio">
              <input
                type="radio"
                name="mediaType"
                value="video"
                checked={selectedMediaType === 'video'}
                onChange={(e) => setSelectedMediaType(e.target.value)}
              />
              <span>Videos Only</span>
            </label>
          </div>
        </div>

                <div className="filter-section">
                  <h3 className="filter-section-title">Clients</h3>
          <div className="filter-checkbox-group">
            {locations.map(location => (
              <label key={location} className="filter-checkbox">
                <input
                  type="checkbox"
                  checked={selectedLocations.includes(location)}
                  onChange={() => handleLocationToggle(location)}
                />
                <span>{location}</span>
              </label>
            ))}
          </div>
        </div>

        {dates.length > 0 && (
          <div className="filter-section">
            <h3 className="filter-section-title">Date</h3>
            <div className="filter-checkbox-group">
              {dates.map(dateObj => (
                <label key={dateObj.value} className="filter-checkbox">
                  <input
                    type="checkbox"
                    checked={selectedDates.includes(dateObj.value)}
                    onChange={() => handleDateToggle(dateObj.value)}
                  />
                  <span>{dateObj.display}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        <div className="filter-modal-actions">
          <button className="filter-button filter-button-clear" onClick={handleClear}>
            Clear
          </button>
          <button className="filter-button filter-button-apply" onClick={handleApply}>
            Apply
          </button>
        </div>
      </div>
    </div>
  )
}

export default FilterModal



