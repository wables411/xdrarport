// R2 Media Configuration
// Set this to your R2 public URL after uploading media
// Can be set via window.R2_PUBLIC_URL in index.html or directly here
const R2_PUBLIC_URL = (typeof window !== 'undefined' && window.R2_PUBLIC_URL) || '';

// Helper function to get R2 media URL
function getMediaUrl(relativePath) {
    if (!relativePath) return '';
    
    if (R2_PUBLIC_URL && relativePath) {
        // Ensure path starts with Crybaby_Oakland/
        const path = relativePath.startsWith('Crybaby_Oakland/') 
            ? relativePath 
            : `Crybaby_Oakland/${relativePath}`;
        return `${R2_PUBLIC_URL}/${path}`;
    }
    // Fallback to local path (for development)
    return relativePath;
}

// Theme Toggle
const themeToggle = document.getElementById('themeToggle');
const body = document.body;
let currentTheme = localStorage.getItem('theme') || 'dark';

// Set initial theme
document.documentElement.setAttribute('data-theme', currentTheme);
body.setAttribute('data-theme', currentTheme);

function updateThemeIcon() {
    if (themeToggle) {
        const icon = themeToggle.querySelector('.theme-icon');
        if (icon) {
            icon.textContent = currentTheme === 'dark' ? '☀' : '☾';
        }
    }
}

// Initialize theme icon
updateThemeIcon();

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', currentTheme);
        body.setAttribute('data-theme', currentTheme);
        localStorage.setItem('theme', currentTheme);
        updateThemeIcon();
    });
}

// Custom Cursor
let cursor, cursorFollower;
let mouseX = 0;
let mouseY = 0;
let followerX = 0;
let followerY = 0;

// Initialize cursor immediately
(function initCursor() {
    cursor = document.getElementById('cursor');
    cursorFollower = document.getElementById('cursorFollower');
    
    if (!cursor || !cursorFollower) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initCursor);
        } else {
            setTimeout(initCursor, 100);
        }
        return;
    }
    
    // Initial position at center
    mouseX = window.innerWidth / 2;
    mouseY = window.innerHeight / 2;
    followerX = mouseX;
    followerY = mouseY;
    
    // Set initial styles - make sure cursor is visible
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
    cursor.style.opacity = '1';
    cursor.style.visibility = 'visible';
    cursor.style.display = 'block';
    cursor.style.pointerEvents = 'none';
    
    cursorFollower.style.left = followerX + 'px';
    cursorFollower.style.top = followerY + 'px';
    cursorFollower.style.opacity = '1';
    cursorFollower.style.visibility = 'visible';
    cursorFollower.style.display = 'block';
    cursorFollower.style.pointerEvents = 'none';
    
    // Mouse move - use single event listener
    const handleMouseMove = (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursor.style.left = mouseX + 'px';
        cursor.style.top = mouseY + 'px';
    };
    document.addEventListener('mousemove', handleMouseMove);

    // Animate follower
    (function animateFollower() {
        if (cursorFollower) {
            followerX += (mouseX - followerX) * 0.1;
            followerY += (mouseY - followerY) * 0.1;
            cursorFollower.style.left = followerX + 'px';
            cursorFollower.style.top = followerY + 'px';
        }
        requestAnimationFrame(animateFollower);
    })();

    // Interactive elements
    const addCursorInteractions = () => {
        document.querySelectorAll('a, button, .project-item, .nav-link, .client-item').forEach(el => {
            el.addEventListener('mouseenter', () => {
                if (cursor) cursor.classList.add('active');
                if (cursorFollower) cursorFollower.classList.add('active');
            });
            el.addEventListener('mouseleave', () => {
                if (cursor) cursor.classList.remove('active');
                if (cursorFollower) cursorFollower.classList.remove('active');
            });
        });
    };
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', addCursorInteractions);
    } else {
        addCursorInteractions();
    }
})();

// Parallax Effect
const parallaxElements = document.querySelectorAll('[data-parallax]');
let ticking = false;

function updateParallax() {
    const scrollY = window.pageYOffset;
    const viewportHeight = window.innerHeight;
    const viewportCenter = scrollY + (viewportHeight / 2);
    
    parallaxElements.forEach(element => {
        const speed = parseFloat(element.getAttribute('data-parallax'));
        const rect = element.getBoundingClientRect();
        const elementTop = rect.top + scrollY;
        const elementCenter = elementTop + (rect.height / 2);
        
        // Calculate parallax offset based on distance from viewport center
        // Use a smoother calculation with reduced intensity
        const distanceFromCenter = elementCenter - viewportCenter;
        const normalizedDistance = distanceFromCenter / viewportHeight;
        const yPos = normalizedDistance * speed * 50; // Reduced multiplier for smoother effect
        
        // Apply parallax transform with CSS transition for smoothness
        element.style.transform = `translateY(${yPos}px)`;
    });
    
    ticking = false;
}

function requestParallaxTick() {
    if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
    }
}

window.addEventListener('scroll', requestParallaxTick);
window.addEventListener('resize', updateParallax);

// Initial parallax on load with animation
window.addEventListener('load', () => {
    updateParallax();
    
    // Animate elements on load
    const projectItems = document.querySelectorAll('.project-item');
    projectItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            item.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, index * 100);
    });

    // Animate hero on load
    const heroTitle = document.querySelector('.hero-title');
    const heroMeta = document.querySelector('.hero-meta');
    if (heroTitle) {
        heroTitle.style.opacity = '0';
        heroTitle.style.transform = 'translateY(20px)';
        setTimeout(() => {
            heroTitle.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
            heroTitle.style.opacity = '1';
            heroTitle.style.transform = 'translateY(0)';
        }, 200);
    }
    if (heroMeta) {
        heroMeta.style.opacity = '0';
        setTimeout(() => {
            heroMeta.style.transition = 'opacity 0.8s ease-out';
            heroMeta.style.opacity = '1';
        }, 400);
    }
});

// Get project items
const projectItems = document.querySelectorAll('.project-item');

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerHeight = document.querySelector('.header').offsetHeight;
            const targetPosition = target.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Header scroll effect
const header = document.getElementById('header');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    const theme = body.getAttribute('data-theme');
    
    if (currentScroll > 100) {
        if (header) {
            header.style.background = theme === 'light' 
                ? 'rgba(255, 255, 255, 0.95)' 
                : 'rgba(0, 0, 0, 0.95)';
        }
    } else {
        if (header) {
            header.style.background = theme === 'light' 
                ? 'rgba(255, 255, 255, 0.9)' 
                : 'rgba(0, 0, 0, 0.9)';
        }
    }
});

// Update header background on theme change
const observer = new MutationObserver(() => {
    const theme = body.getAttribute('data-theme');
    if (header) {
        if (theme === 'light') {
            header.style.background = 'rgba(255, 255, 255, 0.9)';
            header.style.borderBottomColor = '#e0e0e0';
        } else {
            header.style.background = 'rgba(0, 0, 0, 0.9)';
            header.style.borderBottomColor = '#333333';
        }
    }
});

if (body) {
    observer.observe(body, { attributes: true, attributeFilter: ['data-theme'] });
}

// Project item hover effects
projectItems.forEach(item => {
    item.addEventListener('mouseenter', function() {
        const thumbnail = this.querySelector('.project-thumbnail-frame');
        if (thumbnail) {
            thumbnail.style.borderColor = 'var(--accent-color)';
        }
    });
    
    item.addEventListener('mouseleave', function() {
        const thumbnail = this.querySelector('.project-thumbnail-frame');
        if (thumbnail) {
            thumbnail.style.borderColor = 'var(--border-color)';
        }
    });
});

// Dynamic parallax on scroll with easing
let scrollTimeout;
window.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
        updateParallax();
    }, 10);
});

// Scroll-based scaling for projects
let lastScrollY = 0;
let scalingTicking = false;

function updateProjectScaling() {
    const scrollY = window.pageYOffset;
    const viewportHeight = window.innerHeight;
    
    projectItems.forEach((item) => {
        if (item.offsetParent === null) return; // Skip hidden items
        
        const rect = item.getBoundingClientRect();
        const itemTop = rect.top + scrollY;
        const itemCenter = itemTop + (rect.height / 2);
        
        // Calculate distance from viewport center
        const viewportCenter = scrollY + (viewportHeight / 2);
        const distanceFromCenter = Math.abs(itemCenter - viewportCenter);
        
        // Scale based on distance from viewport center
        // Items at center = 1.0, items further away scale down to 0.85
        const maxDistance = viewportHeight * 1.0;
        const scaleFactor = Math.max(0.85, 1 - (distanceFromCenter / maxDistance) * 0.15);
        
        // Store scale factor on element for CSS to use
        item.style.setProperty('--item-scale', scaleFactor);
        
        // Scale title font size
        const title = item.querySelector('.project-title');
        if (title) {
            const baseSize = window.innerWidth > 768 ? 2 : 1.2;
            title.style.fontSize = `${baseSize * scaleFactor}rem`;
        }
        
        // Scale description
        const description = item.querySelector('.project-description');
        if (description) {
            const baseDescSize = 1;
            description.style.fontSize = `${baseDescSize * scaleFactor}rem`;
        }
        
        // Scale thumbnail
        const thumbnailWrapper = item.querySelector('.project-thumbnail-wrapper');
        if (thumbnailWrapper) {
            const baseSize = 200;
            thumbnailWrapper.style.width = `${baseSize * scaleFactor}px`;
            thumbnailWrapper.style.height = `${baseSize * scaleFactor}px`;
        }
    });
    
    scalingTicking = false;
}

function requestScalingTick() {
    if (!scalingTicking) {
        requestAnimationFrame(updateProjectScaling);
        scalingTicking = true;
    }
}

// Update scaling on scroll
window.addEventListener('scroll', requestScalingTick);
window.addEventListener('resize', updateProjectScaling);

// Initial scaling update
window.addEventListener('load', () => {
    updateProjectScaling();
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const intersectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all project items
projectItems.forEach(item => {
    intersectionObserver.observe(item);
});

// Add image loading functionality
function loadProjectImage(projectItem, imageUrl) {
    const thumbnail = projectItem.querySelector('.project-thumbnail');
    const placeholder = projectItem.querySelector('.thumbnail-placeholder');
    
    if (thumbnail && placeholder) {
        const img = document.createElement('img');
        img.src = imageUrl;
        img.alt = projectItem.querySelector('.project-title').textContent;
        
        img.onload = () => {
            placeholder.style.display = 'none';
            thumbnail.appendChild(img);
        };
        
        img.onerror = () => {
            console.error('Failed to load image:', imageUrl);
        };
    }
}

// Export function for adding projects dynamically
window.addProject = function(title, description, tags, category, imageUrl, index) {
    const projectsGrid = document.getElementById('projectsGrid');
    const projectItem = document.createElement('div');
    projectItem.className = 'project-item';
    projectItem.setAttribute('data-category', category);
    projectItem.setAttribute('data-index', index);
    
    // Create tags HTML
    const tagsHTML = Array.isArray(tags) 
        ? tags.map(tag => `<span class="project-tag">${tag.toUpperCase()}</span>`).join('')
        : `<span class="project-tag">${tags.toUpperCase()}</span>`;
    
    projectItem.innerHTML = `
        <div class="project-info">
            <h3 class="project-title">${title}</h3>
            <p class="project-description">${description || ''}</p>
            <div class="project-tags">${tagsHTML}</div>
        </div>
        <div class="project-thumbnail-wrapper">
            <div class="project-thumbnail-frame">
                <div class="project-thumbnail">
                    <div class="thumbnail-placeholder"></div>
                </div>
            </div>
        </div>
    `;
    
    projectsGrid.appendChild(projectItem);
    
    if (imageUrl) {
        loadProjectImage(projectItem, imageUrl);
    }
    
    // Re-attach event listeners
    projectItem.addEventListener('mouseenter', function() {
        const thumbnail = this.querySelector('.project-thumbnail-frame');
        if (thumbnail) {
            thumbnail.style.borderColor = 'var(--accent-color)';
        }
        if (cursor) cursor.classList.add('active');
        if (cursorFollower) cursorFollower.classList.add('active');
    });
    
    projectItem.addEventListener('mouseleave', function() {
        const thumbnail = this.querySelector('.project-thumbnail-frame');
        if (thumbnail) {
            thumbnail.style.borderColor = 'var(--border-color)';
        }
        if (cursor) cursor.classList.remove('active');
        if (cursorFollower) cursorFollower.classList.remove('active');
    });
    
    intersectionObserver.observe(projectItem);
};

// Clients Dropdown and Modal
const clientsLink = document.getElementById('clientsLink');
const clientsDropdown = document.getElementById('clientsDropdown');
const clientModal = document.getElementById('clientModal');
const closeModal = document.getElementById('closeModal');
const clientModalTitle = document.getElementById('clientModalTitle');
const clientModalProjects = document.getElementById('clientModalProjects');

// Client data
const clientsData = {
    'crybaby-oakland': {
        name: 'Crybaby Oakland',
        projects: [
            {
                title: 'Promo for Matrix Rave',
                description: 'Promotional visuals for Matrix Rave event.',
                tags: ['PROMO', 'VIDEO'],
                date: 'August 2022',
                videos: [
                    getMediaUrl('Crybaby_Oakland/Matrix_Rave/Matrix_Rave_Reel.mp4'),
                    getMediaUrl('Crybaby_Oakland/Matrix_Rave/Matrix_Rave_Technopagan.mp4')
                ]
            },
            {
                title: 'Promo for Sith Rave',
                description: 'Promotional visuals for Sith Rave event.',
                tags: ['PROMO', 'VIDEO'],
                date: 'September 2022',
                videos: [
                    getMediaUrl('Crybaby_Oakland/Sith_Rave/Sith_Rave_Reel.mp4')
                ]
            },
            {
                title: 'Visuals for Blade Rave',
                description: 'Visual content for Blade Rave event.',
                tags: ['VISUALS', 'VIDEO'],
                date: 'December 2022',
                videos: [
                    getMediaUrl('Crybaby_Oakland/Blade_Rave/Blade_Rave_Reel.mp4'),
                    getMediaUrl('Crybaby_Oakland/Blade_Rave/Ritchrd_Blade_Rave_Visuals.mp4')
                ]
            }
        ]
    }
};

// Open client modal
function openClientModal(clientId) {
    const client = clientsData[clientId];
    if (!client) return;
    
    clientModalTitle.textContent = client.name;
    clientModalProjects.innerHTML = '';
    
    client.projects.forEach((project, index) => {
        const projectItem = document.createElement('div');
        projectItem.className = 'project-item';
        projectItem.setAttribute('data-index', index);
        
        const tagsHTML = project.tags.map(tag => `<span class="project-tag">${tag}</span>`).join('');
        
        // Build thumbnails for all videos
        const numVideos = project.videos.length;
        let thumbnailsHTML = '';
        
        project.videos.forEach((video, videoIndex) => {
            const videoExt = video.split('.').pop();
            const videoType = videoExt === 'mov' ? 'video/quicktime' : 'video/mp4';
            
            thumbnailsHTML += `
                <div class="project-thumbnail-wrapper ${numVideos > 1 ? 'multiple-thumbnails' : ''}" data-thumbnail-count="${numVideos}">
                    <div class="project-thumbnail-frame">
                        <div class="project-thumbnail">
                            <video class="project-video" autoplay muted loop playsinline data-video-src="${video}">
                                <source src="${video}" type="${videoType}">
                            </video>
                        </div>
                    </div>
                </div>
            `;
        });
        
        projectItem.innerHTML = `
            <div class="project-info">
                <h3 class="project-title">${project.title}</h3>
                <p class="project-description">${project.description}</p>
                <div class="project-meta" style="margin-top: 0.5rem; color: var(--secondary-color); font-size: 0.875rem;">${project.date}</div>
                <div class="project-tags">${tagsHTML}</div>
            </div>
            <div class="project-thumbnails-container ${numVideos > 1 ? 'has-multiple' : ''}" data-count="${numVideos}">
                ${thumbnailsHTML}
            </div>
        `;
        
        clientModalProjects.appendChild(projectItem);
        
        // Set videos to start at frame 3 and add click handlers
        const videos = projectItem.querySelectorAll('.project-video');
        const thumbnailWrappers = projectItem.querySelectorAll('.project-thumbnail-wrapper');
        
        videos.forEach((video, videoIndex) => {
            video.addEventListener('loadedmetadata', () => {
                video.currentTime = 0.1; // Frame 3 at 30fps
            });
            
            // Add click handler for fullscreen
            const handleMediaClick = (e) => {
                e.stopPropagation();
                toggleMediaFullscreen(video);
            };
            
            video.addEventListener('click', handleMediaClick);
            
            if (thumbnailWrappers[videoIndex]) {
                thumbnailWrappers[videoIndex].style.cursor = 'pointer';
                thumbnailWrappers[videoIndex].addEventListener('click', handleMediaClick);
            }
        });
        
        // Add hover effects (same as homepage projects)
        const thumbnailFrames = projectItem.querySelectorAll('.project-thumbnail-frame');
        projectItem.addEventListener('mouseenter', function() {
            thumbnailFrames.forEach(frame => {
                frame.style.borderColor = 'var(--accent-color)';
            });
        });
        
        projectItem.addEventListener('mouseleave', function() {
            thumbnailFrames.forEach(frame => {
                frame.style.borderColor = 'var(--border-color)';
            });
        });
        
        // Add cursor interactions to new project items
        if (cursor && cursorFollower) {
            projectItem.addEventListener('mouseenter', () => {
                cursor.classList.add('active');
                cursorFollower.classList.add('active');
            });
            projectItem.addEventListener('mouseleave', () => {
                cursor.classList.remove('active');
                cursorFollower.classList.remove('active');
            });
        }
    });
    
    // Apply scroll-based scaling to modal projects
    updateModalProjectScaling();
    
    // Add scroll listener for modal content
    const modalContent = document.querySelector('.client-modal-content');
    if (modalContent) {
        modalContent.addEventListener('scroll', updateModalProjectScaling);
    }
    
    clientModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Initialize scaling after a brief delay to ensure DOM is ready
    setTimeout(() => {
        updateModalProjectScaling();
    }, 100);
}

// Close modal
function closeClientModal() {
    clientModal.classList.remove('active');
    document.body.style.overflow = '';
}

// Event listeners
if (clientsDropdown) {
    clientsDropdown.addEventListener('click', (e) => {
        e.preventDefault();
        const clientItem = e.target.closest('.client-item');
        if (clientItem) {
            const clientId = clientItem.getAttribute('data-client');
            openClientModal(clientId);
        }
    });
}

if (closeModal) {
    closeModal.addEventListener('click', closeClientModal);
}

if (clientModal) {
    clientModal.addEventListener('click', (e) => {
        if (e.target === clientModal || e.target.classList.contains('client-modal-overlay')) {
            closeClientModal();
        }
    });
}

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (clientModal.classList.contains('active')) {
            closeClientModal();
        }
        if (document.getElementById('mediaFullscreen').classList.contains('active')) {
            closeMediaFullscreen();
        }
    }
});

// Fullscreen Media Viewer
const mediaFullscreen = document.getElementById('mediaFullscreen');
const mediaFullscreenContent = document.getElementById('mediaFullscreenContent');
const closeFullscreen = document.getElementById('closeFullscreen');
let currentFullscreenMedia = null;

function toggleMediaFullscreen(mediaElement) {
    if (mediaFullscreen.classList.contains('active')) {
        closeMediaFullscreen();
    } else {
        openMediaFullscreen(mediaElement);
    }
}

function openMediaFullscreen(mediaElement) {
    const isVideo = mediaElement.tagName === 'VIDEO';
    const src = isVideo ? mediaElement.getAttribute('data-video-src') || mediaElement.querySelector('source')?.src : mediaElement.src;
    
    mediaFullscreenContent.innerHTML = '';
    
    if (isVideo) {
        const video = document.createElement('video');
        video.src = src;
        video.controls = true;
        video.autoplay = true;
        video.style.width = '100%';
        video.style.height = '100%';
        video.style.objectFit = 'contain';
        mediaFullscreenContent.appendChild(video);
        currentFullscreenMedia = video;
    } else {
        const img = document.createElement('img');
        img.src = src;
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.objectFit = 'contain';
        mediaFullscreenContent.appendChild(img);
        currentFullscreenMedia = img;
    }
    
    mediaFullscreen.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeMediaFullscreen() {
    if (currentFullscreenMedia && currentFullscreenMedia.tagName === 'VIDEO') {
        currentFullscreenMedia.pause();
    }
    mediaFullscreen.classList.remove('active');
    document.body.style.overflow = '';
    mediaFullscreenContent.innerHTML = '';
    currentFullscreenMedia = null;
}

if (closeFullscreen) {
    closeFullscreen.addEventListener('click', closeMediaFullscreen);
}

if (mediaFullscreen) {
    // Close when clicking the background
    mediaFullscreen.addEventListener('click', (e) => {
        if (e.target === mediaFullscreen) {
            closeMediaFullscreen();
        }
    });
    
    // Toggle when clicking the media content
    if (mediaFullscreenContent) {
        mediaFullscreenContent.addEventListener('click', (e) => {
            if (e.target.tagName === 'VIDEO' || e.target.tagName === 'IMG') {
                closeMediaFullscreen();
            }
        });
    }
}

// Scroll-based scaling for modal projects (same as homepage)
let modalScalingTicking = false;

function updateModalProjectScaling() {
    const modalContent = document.querySelector('.client-modal-content');
    if (!modalContent) return;
    
    const modal = document.getElementById('clientModal');
    if (!modal || !modal.classList.contains('active')) return;
    
    const modalProjects = modalContent.querySelectorAll('.client-modal-projects .project-item');
    if (modalProjects.length === 0) return;
    
    const scrollTop = modalContent.scrollTop;
    const viewportHeight = modalContent.clientHeight;
    const viewportCenter = scrollTop + (viewportHeight / 2);
    
    modalProjects.forEach((item) => {
        const rect = item.getBoundingClientRect();
        const containerRect = modalContent.getBoundingClientRect();
        const itemTop = rect.top - containerRect.top + scrollTop;
        const itemCenter = itemTop + (rect.height / 2);
        
        // Calculate distance from viewport center
        const distanceFromCenter = Math.abs(itemCenter - viewportCenter);
        
        // Scale based on distance from viewport center
        const maxDistance = viewportHeight * 1.0;
        const scaleFactor = Math.max(0.85, 1 - (distanceFromCenter / maxDistance) * 0.15);
        
        // Scale title font size
        const title = item.querySelector('.project-title');
        if (title) {
            const baseSize = window.innerWidth > 768 ? 2 : 1.2;
            title.style.fontSize = `${baseSize * scaleFactor}rem`;
        }
        
        // Scale description
        const description = item.querySelector('.project-description');
        if (description) {
            const baseDescSize = 1;
            description.style.fontSize = `${baseDescSize * scaleFactor}rem`;
        }
        
        // Scale thumbnails - handle single and multiple thumbnails
        const thumbnailWrappers = item.querySelectorAll('.project-thumbnail-wrapper');
        const isMultiple = thumbnailWrappers.length > 1;
        
        thumbnailWrappers.forEach(wrapper => {
            if (isMultiple) {
                // For multiple thumbnails, maintain aspect ratio but scale
                const currentWidth = parseFloat(getComputedStyle(wrapper).width) || 200;
                const baseWidth = currentWidth / scaleFactor;
                wrapper.style.width = `${baseWidth * scaleFactor}px`;
            } else {
                // Single thumbnail
                wrapper.style.width = `${200 * scaleFactor}px`;
            }
            wrapper.style.height = `${200 * scaleFactor}px`;
        });
    });
    
    modalScalingTicking = false;
}

function requestModalScalingTick() {
    if (!modalScalingTicking) {
        requestAnimationFrame(updateModalProjectScaling);
        modalScalingTicking = true;
    }
}

// Update scaling on modal scroll
const modalContentEl = document.querySelector('.client-modal-content');
if (modalContentEl) {
    modalContentEl.addEventListener('scroll', requestModalScalingTick);
    // Also update on initial load
    setTimeout(updateModalProjectScaling, 100);
}


