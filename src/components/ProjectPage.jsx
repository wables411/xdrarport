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

function ProjectPage({ project, onClose, onMediaClick }) {
  if (!project) return null

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
        <div className="project-images">
          {project.type === 'project' && project.name === 'Rare Bet Sports Clips' && project.videos ? (
            // RBS: Display all videos in a grid matching portfolio style
            <div className="project-grid-container">
              <div className="project-grid">
                {project.videos.map((video, index) => {
                  const hoverColor = PROJECT_COLORS[index % PROJECT_COLORS.length]
                  const encodedPath = encodeURI(video.path)
                  const allVideoPaths = project.videos.map(v => v.path)
                  return (
                    <div
                      key={index}
                      className="project-grid-item"
                      style={{ '--hover-color': hoverColor }}
                      onClick={() => {
                        const encodedPath = encodeURI(video.path)
                        const encodedPaths = allVideoPaths.map(p => encodeURI(p))
                        onMediaClick(encodedPath, encodedPaths)
                      }}
                    >
                      <video
                        src={encodedPath}
                        muted
                        loop
                        playsInline
                        preload="auto"
                        style={{ width: '100%', height: 'auto', display: 'block' }}
                        onMouseEnter={(e) => {
                          e.target.play().catch(err => {
                            console.error('Video play error for', encodedPath, ':', err)
                          })
                        }}
                        onMouseLeave={(e) => {
                          e.target.pause()
                          e.target.currentTime = 0
                        }}
                        onError={(e) => {
                          console.error('Failed to load video:', encodedPath, video.path, e)
                        }}
                        onLoadedData={() => {
                          console.log('Successfully loaded video:', encodedPath)
                        }}
                      >
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  )
                })}
              </div>
            </div>
          ) : project.type === 'project' && project.files ? (
            // Display all files in the project using the same grid style as main portfolio
            <div className="project-grid-container">
              <div className="project-grid">
                {project.files.map((file, index) => {
                  const hoverColor = PROJECT_COLORS[index % PROJECT_COLORS.length]
                  const allMediaPaths = project.files.map(f => f.path)
                  const encodedPath = encodeURI(file.path)
                  
                  return (
                    <div
                      key={index}
                      className="project-grid-item"
                      style={{ '--hover-color': hoverColor }}
                      onClick={() => {
                        const encodedPath = encodeURI(file.path)
                        const encodedPaths = allMediaPaths.map(p => encodeURI(p))
                        onMediaClick(encodedPath, encodedPaths)
                      }}
                    >
                      {file.type === 'video' ? (
                        <video
                          src={encodedPath}
                          muted
                          loop
                          playsInline
                          preload="metadata"
                          style={{ width: '100%', height: 'auto' }}
                          onMouseEnter={(e) => e.target.play()}
                          onMouseLeave={(e) => {
                            e.target.pause()
                            e.target.currentTime = 0
                          }}
                        />
                      ) : (
                        <img
                          src={encodedPath}
                          alt={file.filename || `Project media ${index + 1}`}
                          loading="lazy"
                          style={{ width: '100%', height: 'auto' }}
                        />
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
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
        {project.description && (
          <div className="project-description">
            <p>{project.description}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProjectPage

