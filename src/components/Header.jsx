import { useState, useEffect, useRef } from 'react'
import './Header.css'

function Header({ onContactClick, onPortfolioClick, onHomeClick, onAboutClick, onProjectSelect, onArchiveClick, manifest = [] }) {
  const [isClientsDropdownOpen, setIsClientsDropdownOpen] = useState(false)
  const [isPersonalProjectsDropdownOpen, setIsPersonalProjectsDropdownOpen] = useState(false)
  const [selectedClient, setSelectedClient] = useState(null) // Track which client's submenu is shown
  const clientsDropdownRef = useRef(null)
  const personalProjectsDropdownRef = useRef(null)

  // Get all projects from manifest
  const allProjects = manifest.filter(item => item.type === 'project')

  // Define client structure with sub-projects
  const clientStructure = {
    'TEXT ME RECORDS': {
      mainProject: 'Text Me Records',
      subProjects: [
        // These projects may need to be created or are files within Text Me Records
        // For now, clicking TEXT ME RECORDS will open the main project
      ]
    },
    'CRYBABY': {
      mainProject: null, // CRYBABY is a parent folder, not a project itself
      subProjects: [
        'Matrix Rave',
        'Sith rave',
        'Blade Rave' // Will be found if it exists as a project in CRYBABY folder
      ]
    },
    'JOOGMASTER J': {
      mainProject: 'JOOGMASTER J',
      subProjects: []
    },
    'BUSSDOWN': {
      mainProject: 'The Brooklyn Bussdown',
      subProjects: []
    },
    'YNB': {
      mainProject: 'YNB',
      subProjects: []
    },
    'LOUIE EL SER': {
      mainProject: 'PSYCHED SF', // Maps to Psyched SF project
      subProjects: []
    },
    'RARE BET SPORTS': {
      mainProject: 'Rare Bet Sports Clips',
      subProjects: []
    }
  }

  // Build clients list with their projects
  const clients = Object.keys(clientStructure).map(clientName => {
    const structure = clientStructure[clientName]
    let mainProject = null
    let subProjects = []

    if (structure.mainProject) {
      // For JOOGMASTER J, find by folder since name changed
      if (clientName === 'JOOGMASTER J') {
        mainProject = allProjects.find(p => 
          p.folder === 'JOOGMASTER J' || 
          p.name === structure.mainProject || 
          p.name.toUpperCase() === structure.mainProject.toUpperCase()
        )
      } else if (clientName === 'PORTION CLUB') {
        mainProject = allProjects.find(p => 
          p.folder === 'portion club' || 
          p.name === 'portion club' ||
          p.name === structure.mainProject
        )
      } else if (clientName === '411') {
        mainProject = allProjects.find(p => 
          p.folder === '411 logos' || 
          p.name === '411 logos' ||
          p.name === structure.mainProject
        )
      } else if (clientName === 'PLANETA PISCES') {
        mainProject = allProjects.find(p => 
          p.folder === 'Planeta Pisces logos' || 
          p.name === 'Planeta Pisces' ||
          p.name === structure.mainProject
        )
      } else {
        mainProject = allProjects.find(p => 
          p.name === structure.mainProject || 
          p.name.toUpperCase() === structure.mainProject.toUpperCase() ||
          p.folder === structure.mainProject
        )
      }
    }

    if (structure.subProjects && structure.subProjects.length > 0) {
      subProjects = structure.subProjects
        .map(subName => {
          // For CRYBABY, look for projects in CRYBABY folder
          if (clientName === 'CRYBABY') {
            return allProjects.find(p => 
              (p.folder && p.folder.includes('CRYBABY') && (
                p.name === subName || 
                p.name.toUpperCase() === subName.toUpperCase() ||
                p.name.toUpperCase().includes(subName.toUpperCase()) ||
                subName.toUpperCase().includes(p.name.toUpperCase())
              ))
            )
          }
          // For other clients, match by name
          return allProjects.find(p => 
            p.name === subName || 
            p.name.toUpperCase() === subName.toUpperCase() ||
            p.name.toUpperCase().includes(subName.toUpperCase()) ||
            subName.toUpperCase().includes(p.name.toUpperCase())
          )
        })
        .filter(Boolean)
    }

    return {
      name: clientName,
      mainProject,
      subProjects,
      hasSubProjects: subProjects.length > 0
    }
  })

  const personalProjectMatches = [
    { search: 'XTRAFORMS', exact: 'XTRAFORMS' },
    { search: 'PORTION CLUB', exact: 'portion club' },
    { search: 'NEXUS', exact: null }, // Placeholder
    { search: 'FREQUENT FLYERS', exact: null } // Placeholder
  ]
  
  // Filter projects into personal projects (only show existing ones, not placeholders)
  const personalProjects = personalProjectMatches
    .map(match => {
      if (match.exact) {
        // Match by exact name or case-insensitive, or by folder name
        const found = allProjects.find(p => 
          p.name === match.exact || 
          p.name.toUpperCase() === match.exact.toUpperCase() ||
          (p.folder && (p.folder === match.exact || p.folder.toUpperCase() === match.exact.toUpperCase())) ||
          (p.folder && p.folder.toLowerCase().includes(match.exact.toLowerCase())) ||
          (p.name && p.name.toLowerCase().includes(match.exact.toLowerCase()))
        )
        if (!found && match.exact === 'portion club') {
          // Also try matching 'Portion Club' with different casing
          return allProjects.find(p => 
            p.name && p.name.toLowerCase() === 'portion club' ||
            p.folder && p.folder.toLowerCase() === 'portion club'
          )
        }
        return found
      }
      // For placeholders, return null (they don't exist yet)
      return null
    })
    .filter(Boolean) // Remove null/undefined entries (placeholders)


  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (clientsDropdownRef.current && !clientsDropdownRef.current.contains(event.target)) {
        setIsClientsDropdownOpen(false)
        setSelectedClient(null)
      }
      if (personalProjectsDropdownRef.current && !personalProjectsDropdownRef.current.contains(event.target)) {
        setIsPersonalProjectsDropdownOpen(false)
      }
    }

    if (isClientsDropdownOpen || isPersonalProjectsDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('touchstart', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
    }
  }, [isClientsDropdownOpen, isPersonalProjectsDropdownOpen])

  const handleClientsClick = (e) => {
    e.stopPropagation()
    const willOpen = !isClientsDropdownOpen
    setIsClientsDropdownOpen(willOpen)
    setIsPersonalProjectsDropdownOpen(false) // Close other dropdown
    if (!willOpen) {
      setSelectedClient(null) // Reset when closing
    }
  }

  const handlePersonalProjectsClick = (e) => {
    e.stopPropagation()
    setIsPersonalProjectsDropdownOpen(!isPersonalProjectsDropdownOpen)
    setIsClientsDropdownOpen(false) // Close other dropdown
  }

  const handleProjectClick = (project) => {
    setIsClientsDropdownOpen(false)
    setIsPersonalProjectsDropdownOpen(false)
    setSelectedClient(null)
    if (onProjectSelect) {
      onProjectSelect(project)
    }
  }

  const handleClientClick = (client, e) => {
    e.stopPropagation()
    if (client.name === 'CRYBABY') {
      // For CRYBABY, create a virtual client project that aggregates all CRYBABY sub-projects
      if (onProjectSelect) {
        // Find all CRYBABY projects from manifest
        const allProjects = manifest.filter(item => item.type === 'project')
        const crybabyProjects = allProjects.filter(p => 
          p.folder && p.folder.includes('CRYBABY')
        )
        
        // Create virtual client project
        const crybabyClient = {
          name: 'CRYBABY OAKLAND',
          folder: 'CRYBABY',
          isCrybabyClient: true,
          subProjects: crybabyProjects,
          type: 'project'
        }
        onProjectSelect(crybabyClient)
      }
    } else if (client.hasSubProjects) {
      // Show sub-projects in a new dropdown
      setSelectedClient(client.name)
    } else {
      // No sub-projects, open main project directly
      if (client.mainProject) {
        handleProjectClick(client.mainProject)
      }
    }
  }

  const handleBackToClients = (e) => {
    e.stopPropagation()
    setSelectedClient(null)
  }

  const handleSubProjectClick = (project, e) => {
    e.stopPropagation()
    handleProjectClick(project)
  }

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          <button className="header-name" onClick={onHomeClick}>
            XD.RAR
          </button>
        </div>
        <div className="header-right">
          <div className="header-dropdown-container" ref={clientsDropdownRef}>
            <button 
              className={`header-button ${isClientsDropdownOpen ? 'active' : ''}`}
              onClick={handleClientsClick}
            >
              Clients
            </button>
            {isClientsDropdownOpen && (
              <div className="header-dropdown">
                {selectedClient ? (
                  // Show sub-projects for selected client
                  <>
                    {(() => {
                      const client = clients.find(c => c.name === selectedClient)
                      if (!client || !client.hasSubProjects) return null
                      return (
                        <>
                          <button
                            className="header-dropdown-item back-button"
                            onClick={handleBackToClients}
                          >
                            ← {selectedClient}
                          </button>
                          {client.subProjects.map((subProject) => (
                            <button
                              key={subProject.id || subProject.path}
                              className="header-dropdown-item"
                              onClick={(e) => handleSubProjectClick(subProject, e)}
                            >
                              {subProject.name}
                            </button>
                          ))}
                        </>
                      )
                    })()}
                  </>
                ) : (
                  // Show main clients list
                  clients.map((client) => (
                    <button
                      key={client.name}
                      className={`header-dropdown-item ${client.hasSubProjects ? 'has-submenu' : ''}`}
                      onClick={(e) => handleClientClick(client, e)}
                    >
                      {client.name}
                      {client.hasSubProjects && (
                        <span className="dropdown-arrow">›</span>
                      )}
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
          <div className="header-dropdown-container" ref={personalProjectsDropdownRef}>
            <button 
              className={`header-button ${isPersonalProjectsDropdownOpen ? 'active' : ''}`}
              onClick={handlePersonalProjectsClick}
            >
              Personal Projects
            </button>
            {isPersonalProjectsDropdownOpen && (
              <div className="header-dropdown">
                {personalProjects.map((project) => (
                  <button
                    key={project.id || project.path}
                    className="header-dropdown-item"
                    onClick={() => handleProjectClick(project)}
                  >
                    {project.name}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button className="header-button" onClick={onArchiveClick}>
            Archive
          </button>
          <button className="header-button" onClick={onAboutClick}>
            About
          </button>
          <button className="header-button" onClick={onContactClick}>
            Contact
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header

