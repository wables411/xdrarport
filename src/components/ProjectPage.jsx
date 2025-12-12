import { useState, useEffect } from 'react'
import './ProjectPage.css'

// Color palette for hover effects - same as ImageGrid
const PROJECT_COLORS = [
  '#FF6B6B', // Red
  '#4ECDC4', // Teal
  '#45B7D1', // Blue
  '#FFA07A', // Light Salmon
  '#98D8C8', // Mint
  '#F7DC6F', // Yellow
  '#BB8FCE', // Purple
  '#85C1E2', // Sky Blue
  '#F8B739', // Orange
  '#52BE80', // Green
  '#EC7063', // Coral
  '#5DADE2', // Light Blue
]

function ProjectPage({ project, onClose, onMediaClick, filters = { locations: [], dates: [], mediaType: 'all' }, manifest = [] }) {
  const [showcasedMediaIndex, setShowcasedMediaIndex] = useState(0)
  
  if (!project) return null

  // Special layout for client pages - organize into sections
  const isTextMeRecords = project.name === 'Text Me Records' || project.folder === 'Text Me Records'
  const isCrybaby = project.folder === 'CRYBABY' || project.name === 'CRYBABY OAKLAND' || project.isCrybabyClient
  const isJoogmaster = project.folder === 'JOOGMASTER J' || project.name === 'JOOGMASTER J' || project.name === "Promo for JoogMaster J's BDAY BASH - December 2025"
  const isPortionClub = project.folder === 'portion club' || project.name === 'portion club' || project.name === 'Portion Club'
  const isLawbnexus = project.folder === 'LAWBNEXUS' || project.name === 'LAWBNEXUS NFT Collection' || project.name === 'LAWBNEXUS'
  
  // State for client page project spotlighted media indices
  const [textMeSectionIndices, setTextMeSectionIndices] = useState({})
  
  if (isTextMeRecords) {
    // Organize files by artist and project
    let rickyLakeFiles = project.files?.filter(f => 
      f.filename.toLowerCase().includes('ricky') || 
      f.filename.toLowerCase().includes('kizzy')
    ) || []
    
    // Sort so Ricky_Lake_Logo.mp4 is first (main asset)
    rickyLakeFiles.sort((a, b) => {
      if (a.filename.toLowerCase().includes('ricky_lake_logo')) return -1
      if (b.filename.toLowerCase().includes('ricky_lake_logo')) return 1
      return 0
    })
    
    // Separate Mikos files into "Oh My Gawd" and "Aloe"
    const ohMyGawdFiles = project.files?.filter(f => 
      f.filename.toLowerCase().includes('mikos') &&
      !f.filename.toLowerCase().includes('aloe')
    ) || []
    
    const aloeFiles = project.files?.filter(f => 
      f.filename.toLowerCase().includes('aloe')
    ) || []
    
    const logoFiles = project.files?.filter(f => 
      f.type === 'image' && (
        f.filename.toLowerCase().includes('logo') ||
        f.filename.toLowerCase().includes('text me')
      ) && !f.filename.toLowerCase().includes('aloe')
    ) || []
    
    const sections = [
      {
        artist: 'Ricky Lake',
        projects: [
          {
            title: "'Burdens' Album - 2025 - promo",
            files: rickyLakeFiles.filter(f => !f.filename.toLowerCase().includes('logo'))
          },
          {
            title: '3D LOGO',
            files: rickyLakeFiles.filter(f => f.filename.toLowerCase().includes('logo'))
          }
        ],
        key: 'rickyLake'
      },
      {
        artist: 'MIKOS DA GAWD',
        projects: [
          {
            title: 'Mikos Da Gawd, Seiji Oda & Jay Anthony - "Oh My Gawd" - cover art and promo',
            files: ohMyGawdFiles
          },
          {
            title: 'ALOE - cover art',
            files: aloeFiles
          }
        ],
        key: 'mikos'
      },
      {
        artist: null,
        projects: [
          {
            title: 'Text Me Records Logos',
            files: logoFiles
          }
        ],
        key: 'logos'
      }
    ]
    
    const handleTextMeThumbnailClick = (sectionKey, fileIndex) => {
      setTextMeSectionIndices(prev => ({
        ...prev,
        [sectionKey]: fileIndex
      }))
    }
    
    return (
      <div className="project-page">
        <button className="project-close" onClick={onClose}>
          ×
        </button>
        <div className="project-content text-me-records-layout">
          <div className="project-header text-me-header">
            <h1 className="project-title text-me-title">{project.name}</h1>
          </div>
          
          {sections.map((section, sectionIndex) => {
            return (
              <div key={sectionIndex} className="text-me-artist-section">
                {section.artist && (
                  <div className="text-me-artist-header">
                    <h2 className="text-me-artist-name">Artist: {section.artist}</h2>
                  </div>
                )}
                {section.projects.map((project, projectIndex) => {
                  if (project.files.length === 0) return null
                  
                  const projectKey = `${section.key}-${projectIndex}`
                  const spotlightIndex = textMeSectionIndices[projectKey] || 0
                  const mainAsset = project.files[spotlightIndex]
                  // Create array with all files except the spotlighted one
                  const subAssets = project.files.filter((_, idx) => idx !== spotlightIndex)
                  const mainAssetPath = mainAsset.path && (mainAsset.path.startsWith('http://') || mainAsset.path.startsWith('https://')) 
                    ? encodeURI(mainAsset.path)
                    : mainAsset.path.split('/').map(segment => encodeURIComponent(segment)).join('/')
                  
                  return (
                    <div key={projectIndex} className="text-me-project">
                      <div className="text-me-project-header">
                        <h3 className="text-me-project-title">{project.title}</h3>
                      </div>
                      <div className="text-me-section-content">
                        <div className="text-me-main-asset">
                          {mainAsset.type === 'video' ? (
                            <video
                              src={mainAssetPath}
                              loop
                              playsInline
                              preload="auto"
                              autoPlay
                              muted
                              style={{ width: '100%', height: 'auto', display: 'block', cursor: 'pointer' }}
                              onClick={() => {
                                const allPaths = project.files.map(f => {
                                  const p = f.path && (f.path.startsWith('http://') || f.path.startsWith('https://')) 
                                    ? encodeURI(f.path)
                                    : f.path.split('/').map(segment => encodeURIComponent(segment)).join('/')
                                  return p
                                })
                                onMediaClick(mainAssetPath, allPaths)
                              }}
                              onLoadedData={(e) => {
                                const video = e.target
                                video.muted = true
                                video.play().catch(err => {
                                  console.error('Video autoplay error:', err)
                                })
                              }}
                              onMouseEnter={(e) => {
                                const video = e.target
                                video.muted = false
                                video.play().catch(err => console.error('Video play error:', err))
                              }}
                              onMouseLeave={(e) => {
                                const video = e.target
                                video.muted = true
                                // Keep playing and looping, just muted
                              }}
                            />
                          ) : (
                            <img
                              src={mainAssetPath}
                              alt={mainAsset.filename}
                              style={{ width: '100%', height: 'auto', display: 'block', cursor: 'pointer' }}
                              onClick={() => {
                                const allPaths = project.files.map(f => {
                                  const p = f.path && (f.path.startsWith('http://') || f.path.startsWith('https://')) 
                                    ? encodeURI(f.path)
                                    : f.path.split('/').map(segment => encodeURIComponent(segment)).join('/')
                                  return p
                                })
                                onMediaClick(mainAssetPath, allPaths)
                              }}
                            />
                          )}
                        </div>
                        {subAssets.length > 0 && (
                          <div className="text-me-section-right">
                            <div className="text-me-sub-assets">
                              {subAssets.map((file, index) => {
                                const filePath = file.path && (file.path.startsWith('http://') || file.path.startsWith('https://')) 
                                  ? encodeURI(file.path)
                                  : file.path.split('/').map(segment => encodeURIComponent(segment)).join('/')
                                
                                // Find the original index in project.files
                                const originalIndex = project.files.findIndex(f => f.path === file.path)
                                
                                return (
                                  <div key={originalIndex} className="text-me-sub-asset">
                                    {file.type === 'video' ? (
                                      <video
                                        src={filePath}
                                        loop
                                        playsInline
                                        preload="metadata"
                                        muted
                                        style={{ width: '100%', height: 'auto', display: 'block', cursor: 'pointer' }}
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          handleTextMeThumbnailClick(projectKey, originalIndex)
                                        }}
                                        onMouseEnter={(e) => {
                                          const video = e.target
                                          video.play().catch(err => {
                                            console.error('Thumbnail video play error:', err)
                                          })
                                        }}
                                        onMouseLeave={(e) => {
                                          const video = e.target
                                          video.pause()
                                          if (video.duration && video.duration > 3) {
                                            video.currentTime = 3
                                          }
                                        }}
                                        onLoadedMetadata={(e) => {
                                          const video = e.target
                                          if (video.duration && video.duration > 3) {
                                            video.currentTime = 3
                                          }
                                        }}
                                      />
                                    ) : (
                                      <img
                                        src={filePath}
                                        alt={file.filename}
                                        style={{ width: '100%', height: 'auto', display: 'block', cursor: 'pointer' }}
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          handleTextMeThumbnailClick(projectKey, originalIndex)
                                        }}
                                      />
                                    )}
                                    <div className="thumbnail-filename-overlay">{file.filename || file.path?.split('/').pop() || 'File'}</div>
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )
          })}
        </div>
      </div>
    )
  }
  
  // Client page layout for CRYBABY OAKLAND
  if (isCrybaby && project.subProjects) {
    const sections = project.subProjects.map((subProject, index) => ({
      title: subProject.name,
      files: subProject.files || [],
      key: `crybaby-${index}`
    }))
    
    return (
      <div className="project-page">
        <button className="project-close" onClick={onClose}>
          ×
        </button>
        <div className="project-content text-me-records-layout">
          <div className="project-header text-me-header">
            <h1 className="project-title text-me-title">CRYBABY OAKLAND</h1>
          </div>
          
          {sections.map((section, sectionIndex) => {
            if (section.files.length === 0) return null
            
            const spotlightIndex = textMeSectionIndices[section.key] || 0
            const mainAsset = section.files[spotlightIndex]
            const subAssets = section.files.filter((_, idx) => idx !== spotlightIndex)
            const mainAssetPath = mainAsset.path && (mainAsset.path.startsWith('http://') || mainAsset.path.startsWith('https://')) 
              ? encodeURI(mainAsset.path)
              : mainAsset.path.split('/').map(segment => encodeURIComponent(segment)).join('/')
            
            return (
              <div key={sectionIndex} className="text-me-section">
                <div className="text-me-section-header">
                  <h2 className="text-me-section-title">{section.title}</h2>
                </div>
                <div className="text-me-section-content">
                  <div className="text-me-main-asset">
                    {mainAsset.type === 'video' ? (
                      <video
                        src={mainAssetPath}
                        loop
                        playsInline
                        preload="auto"
                        autoPlay
                        muted
                        style={{ width: '100%', height: 'auto', display: 'block', cursor: 'pointer' }}
                        onClick={() => {
                          const allPaths = section.files.map(f => {
                            const p = f.path && (f.path.startsWith('http://') || f.path.startsWith('https://')) 
                              ? encodeURI(f.path)
                              : f.path.split('/').map(segment => encodeURIComponent(segment)).join('/')
                            return p
                          })
                          onMediaClick(mainAssetPath, allPaths)
                        }}
                        onLoadedData={(e) => {
                          const video = e.target
                          video.muted = true
                          video.play().catch(err => {
                            console.error('Video autoplay error:', err)
                          })
                        }}
                        onMouseEnter={(e) => {
                          const video = e.target
                          video.muted = false
                          video.play().catch(err => console.error('Video play error:', err))
                        }}
                        onMouseLeave={(e) => {
                          const video = e.target
                          video.muted = true
                        }}
                      />
                    ) : (
                      <img
                        src={mainAssetPath}
                        alt={mainAsset.filename}
                        style={{ width: '100%', height: 'auto', display: 'block', cursor: 'pointer' }}
                        onClick={() => {
                          const allPaths = section.files.map(f => {
                            const p = f.path && (f.path.startsWith('http://') || f.path.startsWith('https://')) 
                              ? encodeURI(f.path)
                              : f.path.split('/').map(segment => encodeURIComponent(segment)).join('/')
                            return p
                          })
                          onMediaClick(mainAssetPath, allPaths)
                        }}
                      />
                    )}
                  </div>
                  {subAssets.length > 0 && (
                    <div className="text-me-section-right">
                      <div className="text-me-sub-assets">
                        {subAssets.map((file, index) => {
                          const filePath = file.path && (file.path.startsWith('http://') || file.path.startsWith('https://')) 
                            ? encodeURI(file.path)
                            : file.path.split('/').map(segment => encodeURIComponent(segment)).join('/')
                          
                          const originalIndex = section.files.findIndex(f => f.path === file.path)
                          
                          return (
                            <div key={originalIndex} className="text-me-sub-asset">
                              {file.type === 'video' ? (
                                <video
                                  src={filePath}
                                  loop
                                  playsInline
                                  preload="metadata"
                                  muted
                                  style={{ width: '100%', height: 'auto', display: 'block', cursor: 'pointer' }}
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    setTextMeSectionIndices(prev => ({
                                      ...prev,
                                      [section.key]: originalIndex
                                    }))
                                  }}
                                  onMouseEnter={(e) => {
                                    const video = e.target
                                    video.play().catch(err => {
                                      console.error('Thumbnail video play error:', err)
                                    })
                                  }}
                                  onMouseLeave={(e) => {
                                    const video = e.target
                                    video.pause()
                                    if (video.duration && video.duration > 3) {
                                      video.currentTime = 3
                                    }
                                  }}
                                  onLoadedMetadata={(e) => {
                                    const video = e.target
                                    if (video.duration && video.duration > 3) {
                                      video.currentTime = 3
                                    }
                                  }}
                                />
                              ) : (
                                <img
                                  src={filePath}
                                  alt={file.filename}
                                  style={{ width: '100%', height: 'auto', display: 'block', cursor: 'pointer' }}
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    setTextMeSectionIndices(prev => ({
                                      ...prev,
                                      [section.key]: originalIndex
                                    }))
                                  }}
                                />
                              )}
                              <div className="thumbnail-filename-overlay">{file.filename || file.path?.split('/').pop() || 'File'}</div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }
  
  // Client page layout for JOOGMASTER J
  if (isJoogmaster) {
    const spotlightIndex = textMeSectionIndices['joogmaster'] || 0
    const mainAsset = project.files?.[spotlightIndex]
    const subAssets = project.files?.filter((_, idx) => idx !== spotlightIndex) || []
    const mainAssetPath = mainAsset && (mainAsset.path.startsWith('http://') || mainAsset.path.startsWith('https://')) 
      ? encodeURI(mainAsset.path)
      : mainAsset?.path.split('/').map(segment => encodeURIComponent(segment)).join('/')
    
    return (
      <div className="project-page">
        <button className="project-close" onClick={onClose}>
          ×
        </button>
        <div className="project-content text-me-records-layout">
          <div className="project-header text-me-header">
            <h1 className="project-title text-me-title">JOOGMASTER J</h1>
          </div>
          
          <div className="text-me-section">
            <div className="text-me-section-header">
              <h2 className="text-me-section-title">Promo for JoogMaster J's BDAY BASH - December 2025</h2>
            </div>
            <div className="text-me-section-content">
              {mainAsset && (
                <div className="text-me-main-asset">
                  {mainAsset.type === 'video' ? (
                    <video
                      src={mainAssetPath}
                      loop
                      playsInline
                      preload="auto"
                      autoPlay
                      muted
                      style={{ width: '100%', height: 'auto', display: 'block', cursor: 'pointer' }}
                      onClick={() => {
                        const allPaths = project.files.map(f => {
                          const p = f.path && (f.path.startsWith('http://') || f.path.startsWith('https://')) 
                            ? encodeURI(f.path)
                            : f.path.split('/').map(segment => encodeURIComponent(segment)).join('/')
                          return p
                        })
                        onMediaClick(mainAssetPath, allPaths)
                      }}
                      onLoadedData={(e) => {
                        const video = e.target
                        video.muted = true
                        video.play().catch(err => {
                          console.error('Video autoplay error:', err)
                        })
                      }}
                      onMouseEnter={(e) => {
                        const video = e.target
                        video.muted = false
                        video.play().catch(err => console.error('Video play error:', err))
                      }}
                      onMouseLeave={(e) => {
                        const video = e.target
                        video.muted = true
                      }}
                    />
                  ) : (
                    <img
                      src={mainAssetPath}
                      alt={mainAsset.filename}
                      style={{ width: '100%', height: 'auto', display: 'block', cursor: 'pointer' }}
                      onClick={() => {
                        const allPaths = project.files.map(f => {
                          const p = f.path && (f.path.startsWith('http://') || f.path.startsWith('https://')) 
                            ? encodeURI(f.path)
                            : f.path.split('/').map(segment => encodeURIComponent(segment)).join('/')
                          return p
                        })
                        onMediaClick(mainAssetPath, allPaths)
                      }}
                    />
                  )}
                </div>
              )}
              {subAssets.length > 0 && (
                <div className="text-me-section-right">
                  <div className="text-me-sub-assets">
                    {subAssets.map((file, index) => {
                      const filePath = file.path && (file.path.startsWith('http://') || file.path.startsWith('https://')) 
                        ? encodeURI(file.path)
                        : file.path.split('/').map(segment => encodeURIComponent(segment)).join('/')
                      
                      const originalIndex = project.files.findIndex(f => f.path === file.path)
                      
                      return (
                        <div key={originalIndex} className="text-me-sub-asset">
                          {file.type === 'video' ? (
                            <video
                              src={filePath}
                              loop
                              playsInline
                              preload="metadata"
                              muted
                              style={{ width: '100%', height: 'auto', display: 'block', cursor: 'pointer' }}
                              onClick={(e) => {
                                e.stopPropagation()
                                setTextMeSectionIndices(prev => ({
                                  ...prev,
                                  'joogmaster': originalIndex
                                }))
                              }}
                              onMouseEnter={(e) => {
                                const video = e.target
                                video.play().catch(err => {
                                  console.error('Thumbnail video play error:', err)
                                })
                              }}
                              onMouseLeave={(e) => {
                                const video = e.target
                                video.pause()
                                if (video.duration && video.duration > 3) {
                                  video.currentTime = 3
                                }
                              }}
                              onLoadedMetadata={(e) => {
                                const video = e.target
                                if (video.duration && video.duration > 3) {
                                  video.currentTime = 3
                                }
                              }}
                            />
                          ) : (
                            <img
                              src={filePath}
                              alt={file.filename}
                              style={{ width: '100%', height: 'auto', display: 'block', cursor: 'pointer' }}
                              onClick={(e) => {
                                e.stopPropagation()
                                setTextMeSectionIndices(prev => ({
                                  ...prev,
                                  'joogmaster': originalIndex
                                }))
                              }}
                            />
                          )}
                          <div className="thumbnail-filename-overlay">{file.filename || file.path?.split('/').pop() || 'File'}</div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }
  
  // Client page layout for PORTION CLUB
  if (isPortionClub) {
    // Organize files into sections
    // PC Branding - 2022: images and branding files
    const brandingFiles = project.files?.filter(f => 
      f.type === 'image' || 
      (f.filename && (
        f.filename.toLowerCase().includes('logo') ||
        f.filename.toLowerCase().includes('cover') ||
        f.filename.toLowerCase().includes('banner') ||
        f.filename.toLowerCase().includes('pc69') ||
        f.filename.toLowerCase().includes('father pfp')
      ))
    ) || []
    
    // Video Promo for Petty Mart - December 2023: files in petty mart subfolder
    const pettyMartFiles = project.files?.filter(f => 
      f.path && f.path.includes('petty mart')
    ) || []
    
    // Other videos (not in petty mart)
    const otherVideos = project.files?.filter(f => 
      f.type === 'video' && 
      f.path && !f.path.includes('petty mart')
    ) || []
    
    // Combine other videos with branding if they're not petty mart
    const allBrandingFiles = [...brandingFiles, ...otherVideos]
    
    const sections = [
      {
        title: 'PC Branding - 2022',
        files: allBrandingFiles,
        key: 'branding'
      },
      {
        title: 'Video Promo for Petty Mart - December 2023',
        files: pettyMartFiles,
        key: 'pettyMart'
      }
    ]
    
    return (
      <div className="project-page">
        <button className="project-close" onClick={onClose}>
          ×
        </button>
        <div className="project-content text-me-records-layout">
          <div className="project-header text-me-header">
            <h1 className="project-title text-me-title">PORTION CLUB</h1>
          </div>
          
          {sections.map((section, sectionIndex) => {
            if (section.files.length === 0) return null
            
            const spotlightIndex = textMeSectionIndices[section.key] || 0
            const mainAsset = section.files[spotlightIndex]
            const subAssets = section.files.filter((_, idx) => idx !== spotlightIndex)
            const mainAssetPath = mainAsset.path && (mainAsset.path.startsWith('http://') || mainAsset.path.startsWith('https://')) 
              ? encodeURI(mainAsset.path)
              : mainAsset.path.split('/').map(segment => encodeURIComponent(segment)).join('/')
            
            return (
              <div key={sectionIndex} className="text-me-section">
                <div className="text-me-section-header">
                  <h2 className="text-me-section-title">{section.title}</h2>
                </div>
                <div className="text-me-section-content">
                  <div className="text-me-main-asset">
                    {mainAsset.type === 'video' ? (
                      <video
                        src={mainAssetPath}
                        loop
                        playsInline
                        preload="auto"
                        autoPlay
                        muted
                        style={{ width: '100%', height: 'auto', display: 'block', cursor: 'pointer' }}
                        onClick={() => {
                          const allPaths = section.files.map(f => {
                            const p = f.path && (f.path.startsWith('http://') || f.path.startsWith('https://')) 
                              ? encodeURI(f.path)
                              : f.path.split('/').map(segment => encodeURIComponent(segment)).join('/')
                            return p
                          })
                          onMediaClick(mainAssetPath, allPaths)
                        }}
                        onLoadedData={(e) => {
                          const video = e.target
                          video.muted = true
                          video.play().catch(err => {
                            console.error('Video autoplay error:', err)
                          })
                        }}
                        onMouseEnter={(e) => {
                          const video = e.target
                          video.muted = false
                          video.play().catch(err => console.error('Video play error:', err))
                        }}
                        onMouseLeave={(e) => {
                          const video = e.target
                          video.muted = true
                        }}
                      />
                    ) : (
                      <img
                        src={mainAssetPath}
                        alt={mainAsset.filename}
                        style={{ width: '100%', height: 'auto', display: 'block', cursor: 'pointer' }}
                        onClick={() => {
                          const allPaths = section.files.map(f => {
                            const p = f.path && (f.path.startsWith('http://') || f.path.startsWith('https://')) 
                              ? encodeURI(f.path)
                              : f.path.split('/').map(segment => encodeURIComponent(segment)).join('/')
                            return p
                          })
                          onMediaClick(mainAssetPath, allPaths)
                        }}
                      />
                    )}
                  </div>
                  {subAssets.length > 0 && (
                    <div className="text-me-section-right">
                      <div className="text-me-sub-assets">
                        {subAssets.map((file, index) => {
                          const filePath = file.path && (file.path.startsWith('http://') || file.path.startsWith('https://')) 
                            ? encodeURI(file.path)
                            : file.path.split('/').map(segment => encodeURIComponent(segment)).join('/')
                          
                          const originalIndex = section.files.findIndex(f => f.path === file.path)
                          
                          return (
                            <div key={originalIndex} className="text-me-sub-asset">
                              {file.type === 'video' ? (
                                <video
                                  src={filePath}
                                  loop
                                  playsInline
                                  preload="metadata"
                                  muted
                                  style={{ width: '100%', height: 'auto', display: 'block', cursor: 'pointer' }}
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    setTextMeSectionIndices(prev => ({
                                      ...prev,
                                      [section.key]: originalIndex
                                    }))
                                  }}
                                  onMouseEnter={(e) => {
                                    const video = e.target
                                    video.play().catch(err => {
                                      console.error('Thumbnail video play error:', err)
                                    })
                                  }}
                                  onMouseLeave={(e) => {
                                    const video = e.target
                                    video.pause()
                                    if (video.duration && video.duration > 3) {
                                      video.currentTime = 3
                                    }
                                  }}
                                  onLoadedMetadata={(e) => {
                                    const video = e.target
                                    if (video.duration && video.duration > 3) {
                                      video.currentTime = 3
                                    }
                                  }}
                                />
                              ) : (
                                <img
                                  src={filePath}
                                  alt={file.filename}
                                  style={{ width: '100%', height: 'auto', display: 'block', cursor: 'pointer' }}
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    setTextMeSectionIndices(prev => ({
                                      ...prev,
                                      [section.key]: originalIndex
                                    }))
                                  }}
                                />
                              )}
                              <div className="thumbnail-filename-overlay">{file.filename || file.path?.split('/').pop() || 'File'}</div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }
  
  // Client page layout for LAWBNEXUS
  if (isLawbnexus) {
    const spotlightIndex = textMeSectionIndices['lawbnexus'] || 0
    const mainAsset = project.files?.[spotlightIndex]
    const subAssets = project.files?.filter((_, idx) => idx !== spotlightIndex) || []
    const mainAssetPath = mainAsset && (mainAsset.path.startsWith('http://') || mainAsset.path.startsWith('https://')) 
      ? encodeURI(mainAsset.path)
      : mainAsset?.path.split('/').map(segment => encodeURIComponent(segment)).join('/')
    
    return (
      <div className="project-page">
        <button className="project-close" onClick={onClose}>
          ×
        </button>
        <div className="project-content text-me-records-layout">
          <div className="project-header text-me-header">
            <h1 className="project-title text-me-title">LAWBNEXUS NFT Collection</h1>
          </div>
          
          <div className="text-me-section">
            <div className="text-me-section-header">
              <h2 className="text-me-section-title">LAWBNEXUS NFT Collection - August 2025</h2>
            </div>
            <div className="text-me-section-content">
              {mainAsset && (
                <div className="text-me-main-asset">
                  {mainAsset.type === 'video' ? (
                    <video
                      src={mainAssetPath}
                      loop
                      playsInline
                      preload="auto"
                      autoPlay
                      muted
                      style={{ width: '100%', height: 'auto', display: 'block', cursor: 'pointer' }}
                      onClick={() => {
                        const allPaths = project.files.map(f => {
                          const p = f.path && (f.path.startsWith('http://') || f.path.startsWith('https://')) 
                            ? encodeURI(f.path)
                            : f.path.split('/').map(segment => encodeURIComponent(segment)).join('/')
                          return p
                        })
                        onMediaClick(mainAssetPath, allPaths)
                      }}
                      onLoadedData={(e) => {
                        const video = e.target
                        video.muted = true
                        video.play().catch(err => {
                          console.error('Video autoplay error:', err)
                        })
                      }}
                      onMouseEnter={(e) => {
                        const video = e.target
                        video.muted = false
                        video.play().catch(err => console.error('Video play error:', err))
                      }}
                      onMouseLeave={(e) => {
                        const video = e.target
                        video.muted = true
                      }}
                    />
                  ) : (
                    <img
                      src={mainAssetPath}
                      alt={mainAsset.filename}
                      style={{ width: '100%', height: 'auto', display: 'block', cursor: 'pointer' }}
                      onClick={() => {
                        const allPaths = project.files.map(f => {
                          const p = f.path && (f.path.startsWith('http://') || f.path.startsWith('https://')) 
                            ? encodeURI(f.path)
                            : f.path.split('/').map(segment => encodeURIComponent(segment)).join('/')
                          return p
                        })
                        onMediaClick(mainAssetPath, allPaths)
                      }}
                    />
                  )}
                </div>
              )}
              <div className="text-me-section-right">
                {/* Magic Eden Widget */}
                <div className="magic-eden-widget" style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  padding: '20px',
                  marginBottom: '30px'
                }}>
                  <h3 style={{
                    fontFamily: "'Neuebit', sans-serif",
                    fontWeight: 'bold',
                    fontSize: '18px',
                    color: '#fff',
                    margin: '0 0 15px 0',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    View on Magic Eden
                  </h3>
                  <a
                    href="https://magiceden.us/marketplace/lawbnexus"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-block',
                      padding: '12px 24px',
                      background: '#fff',
                      color: '#000',
                      textDecoration: 'none',
                      borderRadius: '4px',
                      fontFamily: "'Neuebit', sans-serif",
                      fontWeight: 'bold',
                      fontSize: '14px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      transition: 'opacity 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.target.style.opacity = '0.8'}
                    onMouseLeave={(e) => e.target.style.opacity = '1'}
                  >
                    Open Marketplace →
                  </a>
                  <p style={{
                    fontFamily: "'Neuebit', sans-serif",
                    fontSize: '12px',
                    color: 'rgba(255, 255, 255, 0.7)',
                    margin: '15px 0 0 0',
                    lineHeight: '1.5'
                  }}>
                    Check floor price, listings, and collection stats on Magic Eden
                  </p>
                </div>
                
                {subAssets.length > 0 && (
                  <div className="text-me-sub-assets">
                    {subAssets.map((file, index) => {
                      const filePath = file.path && (file.path.startsWith('http://') || file.path.startsWith('https://')) 
                        ? encodeURI(file.path)
                        : file.path.split('/').map(segment => encodeURIComponent(segment)).join('/')
                      
                      // Find the original index in project.files
                      const originalIndex = project.files.findIndex(f => f.path === file.path)
                      
                      return (
                        <div key={originalIndex} className="text-me-sub-asset">
                          {file.type === 'video' ? (
                            <video
                              src={filePath}
                              loop
                              playsInline
                              preload="metadata"
                              muted
                              style={{ width: '100%', height: 'auto', display: 'block', cursor: 'pointer' }}
                              onClick={(e) => {
                                e.stopPropagation()
                                setTextMeSectionIndices(prev => ({
                                  ...prev,
                                  'lawbnexus': originalIndex
                                }))
                              }}
                              onMouseEnter={(e) => {
                                const video = e.target
                                video.play().catch(err => {
                                  console.error('Thumbnail video play error:', err)
                                })
                              }}
                              onMouseLeave={(e) => {
                                const video = e.target
                                video.pause()
                                if (video.duration && video.duration > 3) {
                                  video.currentTime = 3
                                }
                              }}
                              onLoadedMetadata={(e) => {
                                const video = e.target
                                if (video.duration && video.duration > 3) {
                                  video.currentTime = 3
                                }
                              }}
                            />
                          ) : (
                            <img
                              src={filePath}
                              alt={file.filename}
                              style={{ width: '100%', height: 'auto', display: 'block', cursor: 'pointer' }}
                              onClick={(e) => {
                                e.stopPropagation()
                                setTextMeSectionIndices(prev => ({
                                  ...prev,
                                  'lawbnexus': originalIndex
                                }))
                              }}
                            />
                          )}
                          <div className="thumbnail-filename-overlay">{file.filename || file.path?.split('/').pop() || 'File'}</div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Filter project files based on filters
  const getFilteredFiles = () => {
    if (!project.files && !project.videos) return []

    const filesToFilter = project.videos || project.files || []
    let filtered = [...filesToFilter]

    // Filter by media type
    if (filters.mediaType !== 'all') {
      filtered = filtered.filter(file => file.type === filters.mediaType)
    }

    // Filter by location (already in project, so skip if project matches)
    if (filters.locations && filters.locations.length > 0) {
      // Map Matrix Rave and Petty Mart to Portion Club
      const locationMap = {
        'Matrix Rave': 'Portion Club',
        'petty mart': 'Portion Club',
        'portion club': 'Portion Club'
      }
      const mappedProjectLocation = locationMap[project.folder] || project.folder
      const projectMatches = project.folder && filters.locations.some(loc => {
        return mappedProjectLocation.toLowerCase() === loc.toLowerCase() ||
               project.folder.toLowerCase() === loc.toLowerCase()
      })
      if (!projectMatches) {
        return [] // Hide entire project if location doesn't match
      }
    }

    // Filter by date
    if (filters.dates && filters.dates.length > 0) {
      // Check project date
      let projectMatches = false
      if (project.date) {
        let projectDate
        if (typeof project.date === 'string') {
          projectDate = project.date
        } else if (project.date && project.date.year) {
          projectDate = `${project.date.year}-${String(project.date.month || 1).padStart(2, '0')}`
        }
        if (projectDate && filters.dates.includes(projectDate)) {
          projectMatches = true
        }
      }
      
      // If project doesn't match, check if any files match
      if (!projectMatches) {
        const hasMatchingFile = filtered.some(file => {
          if (file.date) {
            let fileDate
            if (typeof file.date === 'string') {
              fileDate = file.date
            } else if (file.date && file.date.year) {
              fileDate = `${file.date.year}-${String(file.date.month || 1).padStart(2, '0')}`
            }
            return fileDate && filters.dates.includes(fileDate)
          }
          return false
        })
        
        if (!hasMatchingFile) {
          // Filter out files that don't match the date
          filtered = filtered.filter(file => {
            if (file.date) {
              let fileDate
              if (typeof file.date === 'string') {
                fileDate = file.date
              } else if (file.date && file.date.year) {
                fileDate = `${file.date.year}-${String(file.date.month || 1).padStart(2, '0')}`
              }
              return fileDate && filters.dates.includes(fileDate)
            }
            return false
          })
        }
      }
    }

    return filtered
  }

  const filteredFiles = getFilteredFiles()
  const filteredVideos = project.videos ? getFilteredFiles() : null

  // Get all media files for the project
  const allMedia = filteredVideos || filteredFiles || []
  
  // Debug logging
  console.log('[ProjectPage] Project:', project.name, 'Files:', allMedia.length, 'Videos:', allMedia.filter(f => f.type === 'video').length)
  
  // Reset showcased media index when filters change or media changes
  useEffect(() => {
    if (allMedia.length > 0) {
      if (showcasedMediaIndex >= allMedia.length || showcasedMediaIndex < 0) {
        setShowcasedMediaIndex(0)
      }
    }
  }, [allMedia.length, showcasedMediaIndex])
  
  // Use showcasedMediaIndex to determine which media is showcased
  const validIndex = allMedia.length > 0 ? Math.min(showcasedMediaIndex, allMedia.length - 1) : 0
  const showcasedMedia = allMedia.length > 0 ? allMedia[validIndex] : null
  const thumbnailMedia = allMedia.filter((_, index) => index !== validIndex)

  // Get all paths for lightbox navigation
  const getAllMediaPaths = () => {
    if (project.videos) {
      return (filteredVideos || []).map(v => v.path)
    }
    if (project.files) {
      return (filteredFiles || []).map(f => f.path)
    }
    return []
  }

  const allMediaPaths = getAllMediaPaths()

  const handleShowcasedMediaClick = () => {
    // Clicking showcased media opens it in lightbox
    if (showcasedMedia) {
      const encodedPath = showcasedMedia.path && (showcasedMedia.path.startsWith('http://') || showcasedMedia.path.startsWith('https://'))
        ? encodeURI(showcasedMedia.path)
        : showcasedMedia.path.split('/').map(segment => encodeURIComponent(segment)).join('/')
      const encodedPaths = allMediaPaths.map(p => {
        if (!p) return p
        if (p.startsWith('http://') || p.startsWith('https://')) {
          return encodeURI(p)
        }
        return p.split('/').map(segment => encodeURIComponent(segment)).join('/')
      })
      onMediaClick(encodedPath, encodedPaths)
    }
  }

  const handleThumbnailClick = (index) => {
    // Clicking a thumbnail makes it the showcased media
    setShowcasedMediaIndex(index)
  }

  return (
    <div className="project-page">
      <button className="project-close" onClick={onClose}>
        ×
      </button>
      <div className="project-content">
        <div className="project-header">
          <h1 className="project-title">
            {project.title || project.name || project.filename?.replace(/\.[^/.]+$/, '') || `Project ${project.id}`}
          </h1>
        </div>
        
        {project.type === 'project' && allMedia.length > 0 ? (
          <div className="project-layout">
            {/* Left side: Showcased media */}
            <div className="project-showcase">
              {showcasedMedia && (
                <div 
                  className="project-showcase-media"
                  onClick={handleShowcasedMediaClick}
                >
                  {showcasedMedia.type === 'video' ? (
                    <video
                      src={showcasedMedia.path && (showcasedMedia.path.startsWith('http://') || showcasedMedia.path.startsWith('https://')) 
                        ? encodeURI(showcasedMedia.path)
                        : showcasedMedia.path.split('/').map(segment => encodeURIComponent(segment)).join('/')}
                      loop
                      playsInline
                      preload="auto"
                      autoPlay
                      style={{ width: '100%', height: 'auto', display: 'block', cursor: 'pointer' }}
                      onMouseEnter={(e) => {
                        const video = e.target
                        video.muted = false // Enable sound on hover
                        video.play().catch(err => {
                          console.error('Video play error:', err)
                        })
                      }}
                      onMouseLeave={(e) => {
                        const video = e.target
                        video.muted = true // Mute when not hovering
                        // Keep playing and looping, just muted
                      }}
                      onLoadedData={(e) => {
                        // Start playing and looping automatically
                        const video = e.target
                        video.muted = true // Start muted
                        video.play().catch(err => {
                          console.error('Video autoplay error:', err)
                        })
                      }}
                    >
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <img
                      src={showcasedMedia.path && (showcasedMedia.path.startsWith('http://') || showcasedMedia.path.startsWith('https://')) 
                        ? showcasedMedia.path 
                        : showcasedMedia.path.split('/').map(segment => encodeURIComponent(segment)).join('/')}
                      alt={showcasedMedia.filename || 'Showcased media'}
                      loading="eager"
                      style={{ width: '100%', height: 'auto', display: 'block', cursor: 'pointer' }}
                      onLoad={(e) => {
                        // For GIFs, ensure they loop (GIFs loop by default, but we can force reload if needed)
                        const isGif = showcasedMedia.filename && showcasedMedia.filename.toLowerCase().endsWith('.gif')
                        if (isGif) {
                          // GIFs loop automatically, but we can ensure it's set
                          const img = e.target
                          // Force reload to ensure looping if it stopped
                          if (img.complete) {
                            img.src = img.src // Force reload to restart animation
                          }
                        }
                      }}
                    />
                  )}
                </div>
              )}
            </div>

            {/* Right side: Description + Thumbnails */}
            <div className="project-sidebar">
              {/* Project Description */}
              <div className="project-description">
                {project.description ? (
                  <p>{project.description}</p>
                ) : (
                  <p className="project-description-placeholder">Project description coming soon...</p>
                )}
              </div>

              {/* Thumbnail Grid */}
              {thumbnailMedia.length > 0 && (
                <div className="project-thumbnails">
                  {thumbnailMedia.map((file, index) => {
                    // Find the original index in allMedia
                    const originalIndex = allMedia.findIndex(m => m.path === file.path)
                    return (
                      <div
                        key={index}
                        className="project-thumbnail-item"
                        onClick={() => handleThumbnailClick(originalIndex)}
                      >
                        {file.type === 'video' ? (
                          <video
                            src={file.path && (file.path.startsWith('http://') || file.path.startsWith('https://')) 
                              ? encodeURI(file.path)
                              : file.path.split('/').map(segment => encodeURIComponent(segment)).join('/')}
                            muted
                            loop
                            playsInline
                            preload="metadata"
                            onError={(e) => {
                              console.error('Video load error:', file.filename, file.path, e.target?.error)
                            }}
                            onLoadStart={() => {
                              console.log('Video loading:', file.filename, file.path)
                            }}
                            style={{ width: '100%', height: 'auto', display: 'block' }}
                            onMouseEnter={(e) => e.target.play()}
                            onMouseLeave={(e) => {
                              e.target.pause()
                              // Set all thumbnails to frame 3
                              if (e.target.duration && e.target.duration > 3) {
                                e.target.currentTime = 3
                              }
                            }}
                            onLoadedMetadata={(e) => {
                              // Set all video thumbnails to start at frame 3
                              const video = e.target
                              if (video.duration && video.duration > 3) {
                                video.currentTime = 3
                              }
                            }}
                            onLoadedData={(e) => {
                              // Also set on loadedData in case metadata doesn't fire
                              const video = e.target
                              if (video.duration && video.duration > 3) {
                                video.currentTime = 3
                              }
                            }}
                          />
                        ) : (
                          <img
                            src={file.path && (file.path.startsWith('http://') || file.path.startsWith('https://')) 
                              ? file.path 
                              : file.path.split('/').map(segment => encodeURIComponent(segment)).join('/')}
                            alt={file.filename || `Thumbnail ${index + 1}`}
                            loading="lazy"
                            style={{ width: '100%', height: 'auto', display: 'block' }}
                          />
                        )}
                        <div className="thumbnail-filename-overlay">{file.filename || file.path?.split('/').pop() || `Thumbnail ${index + 1}`}</div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        ) : allMedia.length === 0 ? (
          <div className="no-results">No media matches the current filters.</div>
        ) : project.type === 'video' ? (
          <video
            src={project.path}
            controls
            autoPlay
            loop
            className="project-image"
          >
            Your browser does not support the video tag.
          </video>
        ) : (
          <img
            src={project.path}
            alt={project.title || project.filename || `Project ${project.id}`}
            className="project-image"
          />
        )}
      </div>
    </div>
  )
}

export default ProjectPage

