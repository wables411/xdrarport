// R2 Media Configuration
// Set this to your R2 public URL after uploading media
// Can be set via window.R2_PUBLIC_URL in index.html or directly here
console.log('🚀 script.js loaded');
console.log('🔍 Window object:', typeof window !== 'undefined' ? 'exists' : 'undefined');
console.log('🔍 R2_PUBLIC_URL from window:', typeof window !== 'undefined' ? window.R2_PUBLIC_URL : 'N/A');
const R2_PUBLIC_URL = (typeof window !== 'undefined' && window.R2_PUBLIC_URL) || '';
console.log('🌐 R2_PUBLIC_URL:', R2_PUBLIC_URL || 'Not set');

// Helper function to get R2 media URL
function getMediaUrl(relativePath) {
    if (!relativePath) return '';
    
    if (R2_PUBLIC_URL && relativePath) {
        // XDRAR.mp4 is at root level
        if (relativePath === 'XDRAR.mp4' || relativePath.endsWith('/XDRAR.mp4')) {
            return `${R2_PUBLIC_URL}/XDRAR.mp4`;
        }
        // If path already starts with a client directory, use it as-is
        // Otherwise, assume it's a relative path that needs the full path
        // Client directories: Crybaby_Oakland/, Bussdown/, Planeta_Pisces_November_2025/, YNB/, ZMO/
        const clientDirs = ['Crybaby_Oakland/', 'Bussdown/', 'Planeta_Pisces_November_2025/', 'YNB/', 'ZMO/'];
        const hasClientDir = clientDirs.some(dir => relativePath.startsWith(dir));
        
        const path = hasClientDir ? relativePath : relativePath;
        // URL encode each path segment separately to handle special characters like quotes
        // while preserving slashes
        const pathSegments = path.split('/');
        const encodedSegments = pathSegments.map(segment => encodeURIComponent(segment));
        const encodedPath = encodedSegments.join('/');
        return `${R2_PUBLIC_URL}/${encodedPath}`;
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

// Set hero video source from R2
function initHeroVideo() {
    console.log('🎥 Initializing hero video...');
    const heroVideoSource = document.getElementById('heroVideoSource');
    console.log('🎥 heroVideoSource element:', heroVideoSource ? 'found' : 'NOT FOUND');
    console.log('🎥 R2_PUBLIC_URL:', R2_PUBLIC_URL);
    
    if (heroVideoSource && R2_PUBLIC_URL) {
        const videoUrl = getMediaUrl('XDRAR.mp4');
        console.log('🎥 Setting video URL to:', videoUrl);
        heroVideoSource.src = videoUrl;
        // Trigger video load
        const video = heroVideoSource.parentElement;
        if (video && video.tagName === 'VIDEO') {
            console.log('🎥 Video element found, calling load()');
            video.load();
            video.addEventListener('loadeddata', () => {
                console.log('✅ Video loaded successfully');
            });
            video.addEventListener('error', (e) => {
                console.error('❌ Video load error:', e);
            });
        } else {
            console.error('❌ Video parent element not found or not a video tag');
        }
    } else if (heroVideoSource && !R2_PUBLIC_URL) {
        // Fallback to local file
        console.log('🎥 R2_PUBLIC_URL not set, using local file fallback');
        heroVideoSource.src = 'XDRAR.mp4';
        const video = heroVideoSource.parentElement;
        if (video && video.tagName === 'VIDEO') {
            video.load();
        }
    } else {
        console.error('❌ heroVideoSource element not found!');
    }
}

// Initialize hero video when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHeroVideo);
} else {
    initHeroVideo();
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
    if (heroTitle) {
        heroTitle.style.opacity = '0';
        heroTitle.style.transform = 'translateY(20px)';
        setTimeout(() => {
            heroTitle.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
            heroTitle.style.opacity = '1';
            heroTitle.style.transform = 'translateY(0)';
        }, 200);
    }
});

// Get project items
const projectItems = document.querySelectorAll('.project-item');

// Smooth scroll for navigation links (exclude client items)
document.querySelectorAll('a[href^="#"]:not(.client-item)').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const href = this.getAttribute('href');
        // Skip if href is just "#" or empty
        if (!href || href === '#' || href.length <= 1) {
            return;
        }
        const target = document.querySelector(href);
        if (target) {
            // Use scrollIntoView with block: 'start' - works with scroll-snap
            // scroll-margin-top in CSS handles header offset
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
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
let parallaxScrollTimeout;
window.addEventListener('scroll', () => {
    clearTimeout(parallaxScrollTimeout);
    parallaxScrollTimeout = setTimeout(() => {
        updateParallax();
    }, 10);
});

// Scroll-based scaling for projects
let projectScalingLastScrollY = 0;
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
        // Items at center = 1.2, items further away scale down to 0.7 (increased parallax effect)
        const maxDistance = viewportHeight * 1.0;
        const scaleFactor = Math.max(0.7, 1.2 - (distanceFromCenter / maxDistance) * 0.5);
        
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

// Scroll Arrow Growth and Snap-Scroll (Reactive to scroll velocity) - Multi-Arrow System
const arrowMaxSize = 3; // Maximum font-size multiplier (reduced for less dramatic effect)
const snapScrollThreshold = 0.75; // When arrow reaches 75% of max size, trigger snap (increased for more restraint)
const smoothing = 0.3; // Moderate smoothing for subtle effect

// Arrow class to handle individual arrow instances
class ScrollArrow {
    constructor(element) {
        this.element = element;
        this.sectionId = element.getAttribute('data-arrow-section');
        this.targetId = element.getAttribute('data-arrow-target');
        this.section = document.querySelector(`#${this.sectionId}`);
        this.targetSection = document.querySelector(`#${this.targetId}`);
        
        // Find previous section for upward scrolling
        this.previousSection = this.findPreviousSection();
        
        // State
        this.arrowSize = 1.5;
        this.arrowSizeTarget = 1.5;
        this.lastScrollY = 0;
        this.lastScrollTime = Date.now();
        this.scrollVelocity = 0;
        this.accumulatedScroll = 0;
        this.scrollDirection = 0;
        this.isSnapping = false;
        
        // Store original arrow character
        this.originalArrow = element.textContent;
        
        if (!this.section || !this.targetSection) {
            console.warn(`Arrow: section or target not found for ${this.sectionId} -> ${this.targetId}`);
        }
    }
    
    findPreviousSection() {
        // Find the section that comes before this arrow's section
        const sections = ['hero', 'work', 'about', 'contact'];
        const currentIndex = sections.indexOf(this.sectionId);
        if (currentIndex > 0) {
            const prevId = sections[currentIndex - 1];
            return document.querySelector(`#${prevId}`);
        }
        return null;
    }
    
    updateSize() {
        // Smoothly interpolate arrow size towards target
        this.arrowSize += (this.arrowSizeTarget - this.arrowSize) * smoothing;
        
        // Apply font-size (subtle growth from 1.5rem to 4.5rem = 3x larger)
        this.element.style.fontSize = `${this.arrowSize}rem`;
        
        // Stretch the arrow both vertically and horizontally as it grows
        const stretchY = 1 + ((this.arrowSize - 1.5) / 1.5) * 1; // Stretch up to 100% more vertically
        const stretchX = 1 + ((this.arrowSize - 1.5) / 1.5) * 0.5; // Stretch up to 50% more horizontally (fatter)
        this.element.style.transform = `scale(${stretchX}, ${stretchY})`;
    }
    
    handleWheel(e) {
        if (!this.section || this.isSnapping) return;
        
        const sectionRect = this.section.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const currentTime = Date.now();
        const timeDelta = currentTime - this.lastScrollTime;
        const wheelDelta = e.deltaY; // Positive = scrolling down, Negative = scrolling up
        
        // Calculate velocity from wheel delta
        if (timeDelta > 0) {
            this.scrollVelocity = Math.abs(wheelDelta / (timeDelta / 1000));
        } else {
            this.scrollVelocity = 0;
        }
        
        // Determine scroll direction
        if (wheelDelta > 0) {
            this.scrollDirection = 1; // Scrolling down
        } else if (wheelDelta < 0) {
            this.scrollDirection = -1; // Scrolling up
        }
        
        // Check section positions
        const isInSection = sectionRect.bottom > 0 && sectionRect.top < viewportHeight;
        const isAtBottomOfSection = sectionRect.bottom <= viewportHeight * 1.1 && sectionRect.bottom > viewportHeight * 0.3;
        
        // Check if we're in target section (for upward scrolling)
        let isInTargetSection = false;
        let isAtTopOfTargetSection = false;
        if (this.targetSection) {
            const targetRect = this.targetSection.getBoundingClientRect();
            isInTargetSection = targetRect.top < viewportHeight && targetRect.bottom > 0;
            isAtTopOfTargetSection = targetRect.top <= viewportHeight * 0.3 && targetRect.top > -viewportHeight * 0.2;
        }
        
        // Handle downward scrolling (when in section, scrolling down)
        if (this.scrollDirection === 1 && isInSection && this.targetSection) {
            // Accumulate scroll amount
            this.accumulatedScroll += Math.abs(wheelDelta);
            
            // Calculate arrow size (moderate thresholds for subtle effect)
            const velocityFactor = Math.min(1, this.scrollVelocity / 150);
            const scrollFactor = Math.min(1, this.accumulatedScroll / 120);
            const combinedFactor = Math.max(velocityFactor, scrollFactor);
            
            // Set target arrow size (subtle growth from 1.5rem to 4.5rem = 3x larger)
            this.arrowSizeTarget = 1.5 + (combinedFactor * (arrowMaxSize - 1) * 1.5);
            
            // Update arrow to point down
            this.element.textContent = '↓';
            
            // Trigger snap-scroll if threshold reached (scrolling down from section)
            if (combinedFactor >= snapScrollThreshold && isAtBottomOfSection) {
                this.isSnapping = true;
                this.accumulatedScroll = 0;
                setTimeout(() => {
                    this.targetSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    setTimeout(() => {
                        this.isSnapping = false;
                        this.arrowSizeTarget = 1.5;
                        this.accumulatedScroll = 0;
                    }, 1000);
                }, 200);
            }
        }
        // Handle upward scrolling (when in target section, scrolling up) - Less aggressive
        else if (this.scrollDirection === -1 && this.previousSection && isInTargetSection && isAtTopOfTargetSection) {
            // Accumulate scroll amount (for upward) - slower accumulation for less aggressiveness
            this.accumulatedScroll += Math.abs(wheelDelta) * 0.7; // 30% slower accumulation
            
            // Calculate arrow size - higher thresholds for upward scrolling (less aggressive)
            const velocityFactor = Math.min(1, this.scrollVelocity / 200); // Higher threshold (200px/s = max, was 150)
            const scrollFactor = Math.min(1, this.accumulatedScroll / 180); // Higher threshold (180px = max, was 120)
            const combinedFactor = Math.max(velocityFactor, scrollFactor);
            
            // Set target arrow size
            this.arrowSizeTarget = 1.5 + (combinedFactor * (arrowMaxSize - 1) * 1.5);
            
            // Update arrow to point up
            this.element.textContent = '↑';
            
            // Trigger snap-scroll if threshold reached (scrolling up to previous section) - higher threshold
            if (combinedFactor >= snapScrollThreshold * 1.2) { // 20% higher threshold for upward
                this.isSnapping = true;
                this.accumulatedScroll = 0;
                setTimeout(() => {
                    this.previousSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    setTimeout(() => {
                        this.isSnapping = false;
                        this.arrowSizeTarget = 1.5;
                        this.accumulatedScroll = 0;
                    }, 1000);
                }, 200);
            }
        } else {
            // Reset when not in active scroll zone
            this.arrowSizeTarget = 1.5;
            this.accumulatedScroll = 0;
            // Reset arrow direction when not actively scrolling
            if (Math.abs(wheelDelta) < 1) {
                this.element.textContent = this.originalArrow;
            }
        }
        
        this.lastScrollTime = currentTime;
    }
    
    reset() {
        this.arrowSizeTarget = 1.5;
        this.accumulatedScroll = 0;
    }
}

// Initialize all arrows
let scrollArrows = [];
let wheelTimeout;

function initScrollArrows() {
    const arrowElements = document.querySelectorAll('.scroll-arrow[data-arrow-section][data-arrow-target]');
    scrollArrows = Array.from(arrowElements).map(el => new ScrollArrow(el));
    console.log(`Initialized ${scrollArrows.length} scroll arrows`);
}

// Update all arrow sizes in animation loop
function updateAllArrowSizes() {
    scrollArrows.forEach(arrow => arrow.updateSize());
    requestAnimationFrame(updateAllArrowSizes);
}

// Handle wheel events for all arrows
window.addEventListener('wheel', (e) => {
    scrollArrows.forEach(arrow => arrow.handleWheel(e));
    
    // Reset all arrows after wheel stops
    clearTimeout(wheelTimeout);
    wheelTimeout = setTimeout(() => {
        scrollArrows.forEach(arrow => arrow.reset());
    }, 200);
}, { passive: true });

// Initialize on load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        initScrollArrows();
        updateAllArrowSizes();
    });
} else {
    initScrollArrows();
    updateAllArrowSizes();
}

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

// Client data (make it globally accessible)
window.clientsData = {
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
    },
    'bussdown': {
        name: 'Bussdown',
        projects: [
            {
                title: 'The Brooklyn Bussdown',
                description: 'Promotional reel for The Brooklyn Bussdown event.',
                tags: ['PROMO', 'VIDEO'],
                date: 'June 2023',
                videos: [
                    getMediaUrl('Bussdown/The_Brooklyn_Bussdown_-_June_2023.mov')
                ]
            },
            {
                title: 'The Brooklyn Bussdown Fashion Week Edition',
                description: 'Fashion Week edition promotional reel.',
                tags: ['PROMO', 'VIDEO'],
                date: 'September 2023',
                videos: [
                    getMediaUrl('Bussdown/The_Brooklyn_Bussdown_Fashion_Week_Edition_Reel_-_September_2023.mp4')
                ]
            }
        ]
    },
    'planeta-pisces': {
        name: 'Planeta Pisces',
        projects: [
            {
                title: 'Planeta Pisces Logo Collection',
                description: 'Logo design variations for Planeta Pisces.',
                tags: ['BRANDING', 'LOGO'],
                date: 'November 2025',
                images: [
                    getMediaUrl('Planeta_Pisces_November_2025/Planeta_Pisces_Logo.png'),
                    getMediaUrl('Planeta_Pisces_November_2025/Planeta_Pisces_Logo_(alternative).png'),
                    getMediaUrl('Planeta_Pisces_November_2025/Planeta_Pisces_Logo_(alternative_2).png')
                ]
            }
        ]
    },
    'ynb': {
        name: 'YNB',
        projects: [
            {
                title: 'Who TF is YNB Visuals',
                description: 'Album visuals and promotional content for YNB.',
                tags: ['ALBUM', 'VISUALS', 'VIDEO'],
                date: 'June 2023',
                videos: [
                    getMediaUrl('YNB/“Who_TF_is_YNB”_Visuals_-_June_2023/“Who_TF_is_YNB”_Reel.mp4')
                ],
                images: [
                    getMediaUrl('YNB/“Who_TF_is_YNB”_Visuals_-_June_2023/“Who_TF_is_YNB”_Album_Cover.png'),
                    getMediaUrl('YNB/“Who_TF_is_YNB”_Visuals_-_June_2023/“Who_TF_is_YNB”_Album_BackCover.png')
                ]
            }
        ]
    },
    'zmo': {
        name: 'ZMO',
        projects: [
            {
                title: 'ZMO Pressed',
                description: 'Promotional content for ZMO Pressed release.',
                tags: ['PROMO', 'VIDEO', 'IMAGE'],
                date: '2023',
                videos: [
                    getMediaUrl('ZMO/ZMO_Pressed_Reel.mp4')
                ],
                images: [
                    getMediaUrl('ZMO/ZMO_Pressed_IG_Post.png')
                ]
            }
        ]
    }
};

// Debug function to log all media URLs (call from console: window.logAllMediaUrls())
window.logAllMediaUrls = function() {
    console.log('=== All Media URLs ===');
    Object.keys(window.clientsData).forEach(clientId => {
        const client = window.clientsData[clientId];
        console.log(`\n${client.name}:`);
        client.projects.forEach(project => {
            console.log(`  ${project.title}:`);
            if (project.videos) {
                project.videos.forEach(video => console.log(`    Video: ${video}`));
            }
            if (project.images) {
                project.images.forEach(image => console.log(`    Image: ${image}`));
            }
        });
    });
};

// Open client modal (make globally accessible)
window.openClientModal = function(clientId) {
    const client = window.clientsData[clientId];
    if (!client) return;
    
    // Get modal elements (works on both index.html and clients.html)
    const clientModal = document.getElementById('clientModal');
    const clientModalTitle = document.getElementById('clientModalTitle');
    const clientModalProjects = document.getElementById('clientModalProjects');
    
    if (!clientModal || !clientModalTitle || !clientModalProjects) return;
    
    clientModalTitle.textContent = client.name;
    clientModalProjects.innerHTML = '';
    
    client.projects.forEach((project, index) => {
        const projectItem = document.createElement('div');
        projectItem.className = 'project-item';
        projectItem.setAttribute('data-index', index);
        
        const tagsHTML = project.tags.map(tag => `<span class="project-tag">${tag}</span>`).join('');
        
        // Build thumbnails for videos and images
        const videos = project.videos || [];
        const images = project.images || [];
        const totalMedia = videos.length + images.length;
        let thumbnailsHTML = '';
        
        // Add video thumbnails
        videos.forEach((video, videoIndex) => {
            const videoExt = video.split('.').pop();
            const videoType = videoExt === 'mov' ? 'video/quicktime' : 'video/mp4';
            
            thumbnailsHTML += `
                <div class="project-thumbnail-wrapper ${totalMedia > 1 ? 'multiple-thumbnails' : ''}" data-thumbnail-count="${totalMedia}">
                    <div class="project-thumbnail-frame">
                        <div class="project-thumbnail">
                            <video class="project-video" autoplay muted loop playsinline preload="metadata" data-video-src="${video}">
                                <source src="${video}" type="${videoType}">
                            </video>
                        </div>
                    </div>
                </div>
            `;
        });
        
        // Add image thumbnails
        images.forEach((image, imageIndex) => {
            thumbnailsHTML += `
                <div class="project-thumbnail-wrapper ${totalMedia > 1 ? 'multiple-thumbnails' : ''}" data-thumbnail-count="${totalMedia}">
                    <div class="project-thumbnail-frame">
                        <div class="project-thumbnail">
                            <img class="project-image" src="${image}" alt="${project.title}" data-image-src="${image}">
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
            </div>
            <div class="project-thumbnails-container ${totalMedia > 1 ? 'has-multiple' : ''}" data-count="${totalMedia}">
                ${thumbnailsHTML}
            </div>
        `;
        
        clientModalProjects.appendChild(projectItem);
        
        // Set videos to start at frame 3 and add click handlers
        const videoElements = projectItem.querySelectorAll('.project-video');
        const imageElements = projectItem.querySelectorAll('.project-image');
        const thumbnailWrappers = projectItem.querySelectorAll('.project-thumbnail-wrapper');
        
        videoElements.forEach((video, videoIndex) => {
            // Log the video source for debugging
            console.log('Loading video:', video.src);
            
            // Add error handling first
            video.addEventListener('error', (e) => {
                console.error('❌ Video load error:', {
                    src: video.src,
                    error: video.error,
                    errorCode: video.error ? video.error.code : 'unknown',
                    errorMessage: video.error ? video.error.message : 'unknown'
                });
                // Try to reload if there was an error
                if (video.error && video.error.code === MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED) {
                    console.error('Video format not supported or URL incorrect:', video.src);
                }
            });
            
            video.addEventListener('loadeddata', () => {
                console.log('✅ Video loaded successfully:', video.src);
            });
            
            // Ensure video loads and plays (especially for .mov files)
            video.load();
            
            // Set video to show first frame immediately
            video.addEventListener('loadeddata', () => {
                // Seek to frame 3 (assuming 30fps: 3/30 = 0.1 seconds) to show a frame
                if (video.duration > 0) {
                    const targetTime = Math.min(3 / 30, video.duration - 0.1);
                    video.currentTime = targetTime;
                }
            });
            
            video.addEventListener('loadedmetadata', () => {
                // Set to frame 3 (assuming 30fps: 3/30 = 0.1 seconds)
                if (video.duration > 0) {
                    const targetTime = Math.min(3 / 30, video.duration - 0.1);
                    video.currentTime = targetTime;
                    // Try to play after seeking
                    video.play().catch(() => {
                        // If autoplay fails, at least we've shown the frame
                    });
                }
            });
            
            // Once video can play, ensure it's visible and playing
            video.addEventListener('canplay', () => {
                // Ensure we're at the right frame
                if (video.duration > 0 && video.currentTime < 0.05) {
                    video.currentTime = Math.min(3 / 30, video.duration - 0.1);
                }
                video.play().catch(err => {
                    // Ignore autoplay errors
                });
            });
            
            // Limit video playback to 5 seconds max, then loop back to frame 3
            video.addEventListener('timeupdate', () => {
                if (video.currentTime >= 5 && video.duration > 0) {
                    video.currentTime = Math.min(3 / 30, video.duration - 0.1); // Loop back to frame 3
                }
            });
            
            // Try to play the video (autoplay might be blocked by browser)
            video.play().catch(err => {
                // Autoplay was prevented, but that's okay - it will play when user interacts
            });
            
            // Force load and seek to show frame after a short delay
            setTimeout(() => {
                if (video.readyState >= 2) { // HAVE_CURRENT_DATA or higher
                    if (video.duration > 0) {
                        const targetTime = Math.min(3 / 30, video.duration - 0.1);
                        video.currentTime = targetTime;
                    }
                    video.play().catch(() => {
                        // Ignore autoplay errors, but frame should be visible
                    });
                } else {
                    video.load();
                }
            }, 300);
            
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
        
        // Add click handlers for images
        imageElements.forEach((image, imageIndex) => {
            // Log image source for debugging
            console.log('Loading image:', image.src);
            
            image.addEventListener('error', (e) => {
                console.error('❌ Image load error:', {
                    src: image.src,
                    error: 'Failed to load image'
                });
            });
            
            image.addEventListener('load', () => {
                console.log('✅ Image loaded successfully:', image.src);
            });
            
            const handleMediaClick = (e) => {
                e.stopPropagation();
                toggleMediaFullscreen(image);
            };
            
            image.addEventListener('click', handleMediaClick);
            
            const imageWrapperIndex = videoElements.length + imageIndex;
            if (thumbnailWrappers[imageWrapperIndex]) {
                thumbnailWrappers[imageWrapperIndex].style.cursor = 'pointer';
                thumbnailWrappers[imageWrapperIndex].addEventListener('click', handleMediaClick);
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
        const cursor = document.getElementById('cursor');
        const cursorFollower = document.getElementById('cursorFollower');
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

// Close modal (make globally accessible)
window.closeClientModal = function() {
    const clientModal = document.getElementById('clientModal');
    if (clientModal) {
        clientModal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Event listeners
if (clientsDropdown) {
    clientsDropdown.addEventListener('click', (e) => {
        e.preventDefault();
        const clientItem = e.target.closest('.client-item');
        if (clientItem) {
            const clientId = clientItem.getAttribute('data-client');
            window.openClientModal(clientId);
        }
    });
}

if (closeModal) {
    closeModal.addEventListener('click', window.closeClientModal);
}

if (clientModal) {
    clientModal.addEventListener('click', (e) => {
        if (e.target === clientModal || e.target.classList.contains('client-modal-overlay')) {
            window.closeClientModal();
        }
    });
}

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (clientModal && clientModal.classList.contains('active')) {
            window.closeClientModal();
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
        // Items at center = 1.2, items further away scale down to 0.7 (increased parallax effect)
        const maxDistance = viewportHeight * 1.0;
        const scaleFactor = Math.max(0.7, 1.2 - (distanceFromCenter / maxDistance) * 0.5);
        
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

// Contact Form Handler
function initContactForm() {
    console.log('🔍 Initializing contact form...');
    const contactForm = document.getElementById('contactForm');
    const contactStatus = document.getElementById('contactStatus');
    
    if (!contactForm) {
        console.error('❌ Contact form not found!');
        return;
    }
    
    console.log('✅ Contact form found, adding submit listener');
    
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        console.log('📤 Form submitted');
        
        const submitButton = contactForm.querySelector('.contact-submit');
        const name = document.getElementById('contactName').value.trim();
        const email = document.getElementById('contactEmail').value.trim();
        const comment = document.getElementById('contactComment').value.trim();
        
        console.log('📝 Form data:', { name, email, comment: comment.substring(0, 50) + '...' });
        
        // Clear previous status
        contactStatus.textContent = '';
        contactStatus.className = 'contact-status';
        
        // Disable submit button
        submitButton.disabled = true;
        submitButton.textContent = 'Sending...';
        
        try {
            const apiUrl = '/api/contact';
            console.log('🌐 Sending request to:', apiUrl);
            
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, comment }),
            });
            
            console.log('📥 Response status:', response.status);
            console.log('📥 Response headers:', Object.fromEntries(response.headers.entries()));
            
            const data = await response.json();
            console.log('📥 Response data:', data);
            
            if (response.ok && data.success) {
                console.log('✅ Form submitted successfully');
                contactStatus.textContent = data.message || 'Thank you! Your message has been sent.';
                contactStatus.className = 'contact-status success';
                contactForm.reset();
            } else {
                console.error('❌ Form submission failed:', data.error);
                contactStatus.textContent = data.error || 'Failed to send message. Please try again.';
                contactStatus.className = 'contact-status error';
            }
        } catch (error) {
            console.error('❌ Contact form error:', error);
            console.error('❌ Error details:', {
                message: error.message,
                stack: error.stack,
                name: error.name
            });
            contactStatus.textContent = `Failed to send message: ${error.message}`;
            contactStatus.className = 'contact-status error';
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = 'Send Message';
        }
    });
}

// Initialize contact form when DOM is ready
(function() {
    console.log('🔍 Setting up contact form initialization...');
    console.log('📄 Document ready state:', document.readyState);
    
    function tryInitContactForm() {
        console.log('🔍 Attempting to initialize contact form...');
        const contactForm = document.getElementById('contactForm');
        console.log('🔍 Contact form element exists?', contactForm ? 'YES' : 'NO');
        if (contactForm) {
            console.log('✅ Found contact form, initializing...');
            initContactForm();
            return true;
        }
        return false;
    }
    
    // Try immediately
    if (!tryInitContactForm()) {
        console.log('⏳ Form not found, will retry...');
    }
    
    // Try on DOMContentLoaded
    if (document.readyState === 'loading') {
        console.log('⏳ Document still loading, waiting for DOMContentLoaded...');
        document.addEventListener('DOMContentLoaded', () => {
            console.log('✅ DOMContentLoaded fired');
            tryInitContactForm();
        });
    } else {
        console.log('✅ Document already ready');
        setTimeout(() => tryInitContactForm(), 100);
    }
    
    // Also try after a delay as fallback
    setTimeout(() => {
        console.log('⏰ Delayed fallback initialization attempt...');
        tryInitContactForm();
    }, 500);
})();


