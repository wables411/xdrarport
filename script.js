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

// Parallax Effect - Hover-based
let parallaxElements = [];
let parallaxMouseX = 0;
let parallaxMouseY = 0;
let parallaxTicking = false;

function getParallaxElements() {
    parallaxElements = document.querySelectorAll('[data-parallax]');
}

function updateParallax() {
    // Refresh elements list in case new elements were added
    if (parallaxElements.length === 0) {
        getParallaxElements();
    }
    
    if (parallaxElements.length === 0) return;
    
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const viewportCenterX = viewportWidth / 2;
    const viewportCenterY = viewportHeight / 2;
    
    // Calculate mouse position relative to viewport center
    const mouseXRelative = parallaxMouseX - viewportCenterX;
    const mouseYRelative = parallaxMouseY - viewportCenterY;
    
    parallaxElements.forEach(element => {
        const speed = parseFloat(element.getAttribute('data-parallax')) || 0.1;
        
        // Calculate parallax offset based on mouse position relative to viewport center
        const xPos = (mouseXRelative / viewportWidth) * speed * 100;
        const yPos = (mouseYRelative / viewportHeight) * speed * 100;
        
        // Apply parallax transform with CSS transition for smoothness
        element.style.transform = `translate(${xPos}px, ${yPos}px)`;
    });
    
    parallaxTicking = false;
}

function requestParallaxTick() {
    if (!parallaxTicking) {
        requestAnimationFrame(updateParallax);
        parallaxTicking = true;
    }
}

// Initialize parallax elements when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', getParallaxElements);
} else {
    getParallaxElements();
}

// Track mouse movement for parallax (separate from cursor)
document.addEventListener('mousemove', (e) => {
    parallaxMouseX = e.clientX;
    parallaxMouseY = e.clientY;
    requestParallaxTick();
});

// Reset parallax when mouse leaves the window
document.addEventListener('mouseleave', () => {
    parallaxMouseX = window.innerWidth / 2;
    parallaxMouseY = window.innerHeight / 2;
    requestParallaxTick();
});

window.addEventListener('resize', () => {
    // Reset to center on resize
    parallaxMouseX = window.innerWidth / 2;
    parallaxMouseY = window.innerHeight / 2;
    getParallaxElements();
    updateParallax();
});

// Initial parallax on load with animation
window.addEventListener('load', () => {
    // Initialize parallax to center position
    parallaxMouseX = window.innerWidth / 2;
    parallaxMouseY = window.innerHeight / 2;
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

// Parallax is now hover-based, no scroll listener needed

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
        
        // Scale thumbnail (maintain aspect ratio, only scale height)
        const thumbnailWrapper = item.querySelector('.project-thumbnail-wrapper');
        if (thumbnailWrapper) {
            const baseHeight = 200;
            thumbnailWrapper.style.height = `${baseHeight * scaleFactor}px`;
            // Width is auto to maintain aspect ratio
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

// Scroll Arrow Growth and Snap-Scroll (Reactive to scroll velocity) - Single Fixed Arrow
const arrowMaxSize = 3; // Maximum font-size multiplier (reduced for less dramatic effect)
const snapScrollThreshold = 0.85; // When arrow reaches 85% of max size, trigger snap (5/10 sensitivity - requires deliberate scrolling)
const smoothing = 0.3; // Moderate smoothing for subtle effect

// Single arrow class that dynamically detects sections
class SingleScrollArrow {
    constructor(element) {
        this.element = element;
        this.sections = ['hero', 'work', 'about', 'contact'];
        this.sectionElements = this.sections.map(id => document.querySelector(`#${id}`)).filter(el => el !== null);
        
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
        
        // Initialize transform
        this.updateSize();
    }
    
    // Detect which section the viewport is currently in
    getCurrentSection() {
        const viewportHeight = window.innerHeight;
        const scrollY = window.pageYOffset;
        const viewportCenter = scrollY + (viewportHeight / 2);
        
        // Find the section that contains the viewport center
        for (let i = 0; i < this.sectionElements.length; i++) {
            const section = this.sectionElements[i];
            const rect = section.getBoundingClientRect();
            const sectionTop = rect.top + scrollY;
            const sectionBottom = sectionTop + rect.height;
            
            if (viewportCenter >= sectionTop && viewportCenter <= sectionBottom) {
                return { element: section, index: i, id: this.sections[i] };
            }
        }
        
        // Fallback: return the section closest to viewport center
        let closestSection = null;
        let closestDistance = Infinity;
        
        for (let i = 0; i < this.sectionElements.length; i++) {
            const section = this.sectionElements[i];
            const rect = section.getBoundingClientRect();
            const sectionTop = rect.top + scrollY;
            const sectionCenter = sectionTop + (rect.height / 2);
            const distance = Math.abs(viewportCenter - sectionCenter);
            
            if (distance < closestDistance) {
                closestDistance = distance;
                closestSection = { element: section, index: i, id: this.sections[i] };
            }
        }
        
        return closestSection;
    }
    
    // Get next section (for downward scrolling)
    getNextSection(currentIndex) {
        if (currentIndex < this.sectionElements.length - 1) {
            return {
                element: this.sectionElements[currentIndex + 1],
                index: currentIndex + 1,
                id: this.sections[currentIndex + 1]
            };
        }
        return null;
    }
    
    // Get previous section (for upward scrolling)
    getPreviousSection(currentIndex) {
        if (currentIndex > 0) {
            return {
                element: this.sectionElements[currentIndex - 1],
                index: currentIndex - 1,
                id: this.sections[currentIndex - 1]
            };
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
        // Apply scale transform while preserving translateX for centering
        this.element.style.transform = `translateX(-50%) scale(${stretchX}, ${stretchY})`;
    }
    
    handleWheel(e) {
        if (this.isSnapping) return;
        
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
        
        // Get current section
        const currentSection = this.getCurrentSection();
        if (!currentSection) {
            // Reset immediately if no section detected
            this.arrowSizeTarget = 1.5;
            this.accumulatedScroll = 0;
            this.element.textContent = this.originalArrow;
            this.lastScrollTime = currentTime;
            return;
        }
        
        const currentSectionRect = currentSection.element.getBoundingClientRect();
        // More strict boundaries - only trigger when very close to section edges
        const isAtBottomOfSection = currentSectionRect.bottom <= viewportHeight * 1.05 && currentSectionRect.bottom > viewportHeight * 0.5;
        const isAtTopOfSection = currentSectionRect.top <= viewportHeight * 0.5 && currentSectionRect.top > -viewportHeight * 0.1;
        
        // Handle downward scrolling
        if (this.scrollDirection === 1) {
            const nextSection = this.getNextSection(currentSection.index);
            
            // Only grow arrow if at bottom of section AND there's a next section AND actively scrolling
            if (nextSection && isAtBottomOfSection && Math.abs(wheelDelta) > 0) {
                // Accumulate scroll amount
                this.accumulatedScroll += Math.abs(wheelDelta);
                
                // Calculate arrow size (5/10 sensitivity - requires more deliberate scrolling)
                const velocityFactor = Math.min(1, this.scrollVelocity / 250); // Higher threshold (250px/s = max, was 150)
                const scrollFactor = Math.min(1, this.accumulatedScroll / 200); // Higher threshold (200px = max, was 120)
                const combinedFactor = Math.max(velocityFactor, scrollFactor);
                
                // Set target arrow size (subtle growth from 1.5rem to 4.5rem = 3x larger)
                this.arrowSizeTarget = 1.5 + (combinedFactor * (arrowMaxSize - 1) * 1.5);
                
                // Update arrow to point down
                this.element.textContent = '↓';
                
                // Trigger snap-scroll if threshold reached (scrolling down from section)
                if (combinedFactor >= snapScrollThreshold) {
                    this.isSnapping = true;
                    this.accumulatedScroll = 0;
                    setTimeout(() => {
                        nextSection.element.scrollIntoView({
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
                // Reset immediately when not at bottom or no next section
                this.arrowSizeTarget = 1.5;
                this.accumulatedScroll = 0;
                if (!isAtBottomOfSection || !nextSection) {
                    this.element.textContent = this.originalArrow;
                }
            }
        }
        // Handle upward scrolling - Less aggressive
        else if (this.scrollDirection === -1) {
            const previousSection = this.getPreviousSection(currentSection.index);
            
            // Only grow arrow if at top of section AND there's a previous section AND actively scrolling
            if (previousSection && isAtTopOfSection && Math.abs(wheelDelta) > 0) {
                // Accumulate scroll amount (for upward) - same as downward for 5/10 sensitivity
                this.accumulatedScroll += Math.abs(wheelDelta);
                
                // Calculate arrow size (5/10 sensitivity - same as downward)
                const velocityFactor = Math.min(1, this.scrollVelocity / 250); // Same threshold as downward (250px/s = max)
                const scrollFactor = Math.min(1, this.accumulatedScroll / 200); // Same threshold as downward (200px = max)
                const combinedFactor = Math.max(velocityFactor, scrollFactor);
                
                // Set target arrow size
                this.arrowSizeTarget = 1.5 + (combinedFactor * (arrowMaxSize - 1) * 1.5);
                
                // Update arrow to point up
                this.element.textContent = '↑';
                
                // Trigger snap-scroll if threshold reached (scrolling up to previous section) - same threshold as downward
                if (combinedFactor >= snapScrollThreshold) { // Same threshold as downward for 5/10 sensitivity
                    this.isSnapping = true;
                    this.accumulatedScroll = 0;
                    setTimeout(() => {
                        previousSection.element.scrollIntoView({
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
                // Reset immediately when not at top or no previous section
                this.arrowSizeTarget = 1.5;
                this.accumulatedScroll = 0;
                if (!isAtTopOfSection || !previousSection) {
                    this.element.textContent = this.originalArrow;
                }
            }
        } else {
            // Reset immediately when not actively scrolling
            this.arrowSizeTarget = 1.5;
            this.accumulatedScroll = 0;
            this.element.textContent = this.originalArrow;
        }
        
        this.lastScrollTime = currentTime;
    }
    
    reset() {
        this.arrowSizeTarget = 1.5;
        this.accumulatedScroll = 0;
        this.element.textContent = this.originalArrow;
    }
}

// Initialize single fixed arrow
let singleScrollArrow = null;
let wheelTimeout;

function initSingleScrollArrow() {
    const arrowElement = document.getElementById('scrollArrowFixed');
    if (arrowElement) {
        singleScrollArrow = new SingleScrollArrow(arrowElement);
        console.log('Initialized single fixed scroll arrow');
    } else {
        console.warn('Fixed scroll arrow element not found');
    }
}

// Update arrow size in animation loop
function updateArrowSize() {
    if (singleScrollArrow) {
        singleScrollArrow.updateSize();
    }
    requestAnimationFrame(updateArrowSize);
}

// Handle wheel events for the single arrow (desktop)
window.addEventListener('wheel', (e) => {
    if (singleScrollArrow) {
        singleScrollArrow.handleWheel(e);
        
        // Reset arrow quickly after wheel stops (reduced from 200ms to 100ms for faster reset)
        clearTimeout(wheelTimeout);
        wheelTimeout = setTimeout(() => {
            if (singleScrollArrow) {
                singleScrollArrow.reset();
                // Also reset arrow direction
                singleScrollArrow.element.textContent = singleScrollArrow.originalArrow;
            }
        }, 100);
    }
}, { passive: true });

// Handle touch events for mobile
let touchStartY = 0;
let touchStartTime = 0;
let lastTouchY = 0;
let lastTouchTime = Date.now();

window.addEventListener('touchstart', (e) => {
    if (singleScrollArrow && e.touches.length > 0) {
        touchStartY = e.touches[0].clientY;
        touchStartTime = Date.now();
        lastTouchY = touchStartY;
        lastTouchTime = touchStartTime;
    }
}, { passive: true });

window.addEventListener('touchmove', (e) => {
    if (singleScrollArrow && e.touches.length > 0) {
        const currentTouchY = e.touches[0].clientY;
        const currentTime = Date.now();
        const deltaY = lastTouchY - currentTouchY; // Positive = scrolling down
        const timeDelta = currentTime - lastTouchTime;
        
        // Create a synthetic wheel event for mobile
        const syntheticEvent = {
            deltaY: deltaY * 10, // Scale for mobile sensitivity
            clientX: e.touches[0].clientX,
            clientY: e.touches[0].clientY,
            preventDefault: () => {}
        };
        
        singleScrollArrow.handleWheel(syntheticEvent);
        
        lastTouchY = currentTouchY;
        lastTouchTime = currentTime;
        
        // Reset arrow after touch stops
        clearTimeout(wheelTimeout);
        wheelTimeout = setTimeout(() => {
            if (singleScrollArrow) {
                singleScrollArrow.reset();
                singleScrollArrow.element.textContent = singleScrollArrow.originalArrow;
            }
        }, 150);
    }
}, { passive: true });

// Also handle scroll events for mobile (fallback)
let lastScrollY = window.pageYOffset;
let scrollTimeout;

window.addEventListener('scroll', () => {
    if (singleScrollArrow) {
        const currentScrollY = window.pageYOffset;
        const scrollDelta = currentScrollY - lastScrollY;
        const currentTime = Date.now();
        
        // Only process if there's significant scroll movement
        if (Math.abs(scrollDelta) > 5) {
            // Create synthetic wheel event from scroll
            const syntheticEvent = {
                deltaY: scrollDelta * 3, // Scale for scroll sensitivity
                clientX: window.innerWidth / 2,
                clientY: window.innerHeight / 2,
                preventDefault: () => {}
            };
            
            singleScrollArrow.handleWheel(syntheticEvent);
            lastScrollY = currentScrollY;
        }
        
        // Reset arrow after scroll stops
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            if (singleScrollArrow) {
                singleScrollArrow.reset();
                singleScrollArrow.element.textContent = singleScrollArrow.originalArrow;
            }
        }, 200);
    }
}, { passive: true });

// Initialize on load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        initSingleScrollArrow();
        updateArrowSize();
    });
} else {
    initSingleScrollArrow();
    updateArrowSize();
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

// Helper function to update thumbnail width based on media aspect ratio
function updateThumbnailWidth(mediaElement, wrapper) {
    if (!mediaElement || !wrapper) return;
    
    const height = wrapper.offsetHeight || 200;
    let naturalWidth, naturalHeight;
    
    if (mediaElement.tagName === 'VIDEO') {
        naturalWidth = mediaElement.videoWidth;
        naturalHeight = mediaElement.videoHeight;
    } else if (mediaElement.tagName === 'IMG') {
        naturalWidth = mediaElement.naturalWidth;
        naturalHeight = mediaElement.naturalHeight;
    }
    
    if (naturalWidth && naturalHeight && naturalHeight > 0) {
        const aspectRatio = naturalWidth / naturalHeight;
        const calculatedWidth = height * aspectRatio;
        // Ensure minimum width
        const finalWidth = Math.max(calculatedWidth, 200);
        wrapper.style.width = `${finalWidth}px`;
    } else {
        // If dimensions not available yet, ensure minimum width
        wrapper.style.width = '200px';
    }
}

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
                    getMediaUrl('The_Brooklyn_Bussdown_June2023.mp4')
                ]
            },
            {
                title: 'The Brooklyn Bussdown Fashion Week Edition',
                description: 'Fashion Week edition promotional reel.',
                tags: ['PROMO', 'VIDEO'],
                date: 'September 2023',
                videos: [
                    getMediaUrl('The_Brooklyn_Bussdown_Fashion_Week_Edition_Reel_September2023.mp4')
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
            const videoSrc = video.getAttribute('data-video-src') || video.querySelector('source')?.src || video.src;
            const sourceTag = video.querySelector('source');
            console.log('Loading video:', videoSrc);
            console.log('Video element src:', video.src);
            console.log('Source tag src:', sourceTag?.src);
            console.log('Source tag type:', sourceTag?.type);
            
            // Add error handling first
            video.addEventListener('error', (e) => {
                const errorDetails = {
                    src: video.src || sourceTag?.src,
                    dataVideoSrc: video.getAttribute('data-video-src'),
                    sourceTagSrc: sourceTag?.src,
                    error: video.error,
                    errorCode: video.error ? video.error.code : 'unknown',
                    errorMessage: video.error ? video.error.message : 'unknown',
                    networkState: video.networkState,
                    readyState: video.readyState
                };
                console.error('❌ Video load error:', errorDetails);
                // Try to reload if there was an error
                if (video.error && video.error.code === MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED) {
                    console.error('Video format not supported or URL incorrect:', errorDetails.src);
                }
            });
            
            // Ensure video loads and plays (especially for .mov files)
            video.load();
            
            // Set video to show first frame immediately and update width
            video.addEventListener('loadeddata', () => {
                console.log('✅ Video loaded successfully:', video.src);
                // Update thumbnail wrapper width based on video aspect ratio
                updateThumbnailWidth(video, thumbnailWrappers[videoIndex]);
                // Seek to frame 3 (assuming 30fps: 3/30 = 0.1 seconds) to show a frame
                if (video.duration > 0) {
                    const targetTime = Math.min(3 / 30, video.duration - 0.1);
                    video.currentTime = targetTime;
                }
            });
            
            video.addEventListener('loadedmetadata', () => {
                // Update width when metadata loads (earlier than loadeddata)
                updateThumbnailWidth(video, thumbnailWrappers[videoIndex]);
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
                // Update thumbnail wrapper width based on image aspect ratio
                const imageWrapperIndex = videoElements.length + imageIndex;
                if (thumbnailWrappers[imageWrapperIndex]) {
                    updateThumbnailWidth(image, thumbnailWrappers[imageWrapperIndex]);
                }
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
};

// Render client projects to a container (for client pages)
window.renderClientProjects = function(clientId, container) {
    const client = window.clientsData && window.clientsData[clientId];
    if (!client || !container) return;
    
    container.innerHTML = '';
    
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
        videos.forEach((video) => {
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
        images.forEach((image) => {
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
        
        container.appendChild(projectItem);
        
        // Initialize media (same logic as modal)
        const videoElements = projectItem.querySelectorAll('.project-video');
        const imageElements = projectItem.querySelectorAll('.project-image');
        const thumbnailWrappers = projectItem.querySelectorAll('.project-thumbnail-wrapper');
        
        videoElements.forEach((video, videoIndex) => {
            const videoSrc = video.getAttribute('data-video-src') || video.querySelector('source')?.src || video.src;
            
            video.addEventListener('error', () => {
                console.error('❌ Video load error:', videoSrc);
            });
            
            video.load();
            
            video.addEventListener('loadeddata', () => {
                if (typeof updateThumbnailWidth === 'function' && thumbnailWrappers[videoIndex]) {
                    updateThumbnailWidth(video, thumbnailWrappers[videoIndex]);
                }
                if (video.duration > 0) {
                    const targetTime = Math.min(3 / 30, video.duration - 0.1);
                    video.currentTime = targetTime;
                }
            });
            
            video.addEventListener('loadedmetadata', () => {
                if (typeof updateThumbnailWidth === 'function' && thumbnailWrappers[videoIndex]) {
                    updateThumbnailWidth(video, thumbnailWrappers[videoIndex]);
                }
                if (video.duration > 0) {
                    const targetTime = Math.min(3 / 30, video.duration - 0.1);
                    video.currentTime = targetTime;
                    video.play().catch(() => {});
                }
            });
            
            video.addEventListener('canplay', () => {
                if (video.duration > 0 && video.currentTime < 0.05) {
                    video.currentTime = Math.min(3 / 30, video.duration - 0.1);
                }
                video.play().catch(() => {});
            });
            
            video.addEventListener('timeupdate', () => {
                if (video.currentTime >= 5 && video.duration > 0) {
                    video.currentTime = Math.min(3 / 30, video.duration - 0.1);
                }
            });
            
            video.play().catch(() => {});
            
            setTimeout(() => {
                if (video.readyState >= 2) {
                    if (video.duration > 0) {
                        const targetTime = Math.min(3 / 30, video.duration - 0.1);
                        video.currentTime = targetTime;
                    }
                    video.play().catch(() => {});
                } else {
                    video.load();
                }
            }, 300);
            
            const handleMediaClick = (e) => {
                e.stopPropagation();
                if (typeof toggleMediaFullscreen === 'function') {
                    toggleMediaFullscreen(video);
                }
            };
            
            video.addEventListener('click', handleMediaClick);
            if (thumbnailWrappers[videoIndex]) {
                thumbnailWrappers[videoIndex].style.cursor = 'pointer';
                thumbnailWrappers[videoIndex].addEventListener('click', handleMediaClick);
            }
        });
        
        imageElements.forEach((image, imageIndex) => {
            image.addEventListener('error', () => {
                console.error('❌ Image load error:', image.src);
            });
            
            image.addEventListener('load', () => {
                if (typeof updateThumbnailWidth === 'function') {
                    const imageWrapperIndex = videoElements.length + imageIndex;
                    if (thumbnailWrappers[imageWrapperIndex]) {
                        updateThumbnailWidth(image, thumbnailWrappers[imageWrapperIndex]);
                    }
                }
            });
            
            const handleMediaClick = (e) => {
                e.stopPropagation();
                if (typeof toggleMediaFullscreen === 'function') {
                    toggleMediaFullscreen(image);
                }
            };
            
            image.addEventListener('click', handleMediaClick);
            const imageWrapperIndex = videoElements.length + imageIndex;
            if (thumbnailWrappers[imageWrapperIndex]) {
                thumbnailWrappers[imageWrapperIndex].style.cursor = 'pointer';
                thumbnailWrappers[imageWrapperIndex].addEventListener('click', handleMediaClick);
            }
        });
        
        // Add hover effects
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
        
        // Add cursor interactions
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
};

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

// Animation state management
let isAnimating = false;
let currentAnimation = null;

// Category to route mapping
const categoryRoutes = {
    'identity': '/branding',
    'digital': '/motion',
    'print': '/personal'
};

// Function to animate project item sliding off-screen
function animateProjectItem(projectItem, direction, callback) {
    if (isAnimating) {
        // Interrupt current animation
        if (currentAnimation) {
            clearTimeout(currentAnimation);
        }
        // Reset all project items
        document.querySelectorAll('.project-item').forEach(item => {
            item.classList.remove('slide-up', 'slide-down', 'animating');
        });
    }
    
    isAnimating = true;
    projectItem.classList.add('animating');
    
    // Determine slide direction based on item position
    // Items above the clicked one slide up, items below slide down
    const allItems = Array.from(document.querySelectorAll('.project-item'));
    const clickedIndex = allItems.indexOf(projectItem);
    
    // Use requestAnimationFrame to ensure smooth animation start
    requestAnimationFrame(() => {
        allItems.forEach((item, index) => {
            if (index < clickedIndex) {
                // Items above: slide up
                item.classList.add('slide-up');
            } else if (index > clickedIndex) {
                // Items below: slide down
                item.classList.add('slide-down');
            } else {
                // Clicked item: use provided direction or default to up
                item.classList.add(direction || 'slide-up');
            }
        });
    });
    
    // Wait for animation to complete, then navigate
    currentAnimation = setTimeout(() => {
        isAnimating = false;
        if (callback) callback();
    }, 800); // Match CSS transition duration
}

// Navigation Dropdown Handlers
document.addEventListener('DOMContentLoaded', function() {
    // Only run on homepage
    const isHomePage = window.location.pathname === '/' || 
                      window.location.pathname.includes('index.html') ||
                      window.location.pathname.endsWith('/');
    
    if (!isHomePage) return;
    
    // Handle WORK dropdown items - animate and navigate
    const workDropdownItems = document.querySelectorAll('.work-dropdown .dropdown-item');
    workDropdownItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const category = this.getAttribute('data-category');
            const projectItem = document.querySelector(`.project-item[data-category="${category}"]`);
            
            if (projectItem && !isAnimating) {
                // Scroll to work section if needed
                const workSection = document.getElementById('work');
                if (workSection) {
                    // Check if we need to scroll
                    const rect = workSection.getBoundingClientRect();
                    const isVisible = rect.top >= 0 && rect.top < window.innerHeight;
                    
                    if (!isVisible) {
                        workSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                    
                    // Wait for scroll if needed, then animate
                    const delay = isVisible ? 0 : 300;
                    setTimeout(() => {
                        const route = categoryRoutes[category] || `/${category}`;
                        const allItems = Array.from(document.querySelectorAll('.project-item'));
                        const clickedIndex = allItems.indexOf(projectItem);
                        const direction = clickedIndex === 0 ? 'slide-up' : 'slide-down';
                        
                        animateProjectItem(projectItem, direction, () => {
                            window.location.href = route;
                        });
                    }, delay);
                } else {
                    // If no work section, navigate directly
                    const route = categoryRoutes[category] || `/${category}`;
                    window.location.href = route;
                }
            }
        });
    });
    
    // Handle clicks on project items themselves
    const projectItems = document.querySelectorAll('.project-item');
    projectItems.forEach(item => {
        // Make items keyboard accessible
        item.setAttribute('tabindex', '0');
        item.setAttribute('role', 'button');
        item.setAttribute('aria-label', `Navigate to ${item.querySelector('.project-title')?.textContent || 'project page'}`);
        
        const handleActivation = (e) => {
            // Don't trigger if clicking on a link or button inside
            if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON') {
                return;
            }
            
            // Check if it's a keyboard event and the key is not Enter or Space
            if (e.type === 'keydown' && e.key !== 'Enter' && e.key !== ' ') {
                return;
            }
            
            e.preventDefault();
            e.stopPropagation();
            
            if (isAnimating) {
                return; // Prevent multiple animations
            }
            
            const category = item.getAttribute('data-category');
            const route = categoryRoutes[category] || `/${category}`;
            
            // Determine direction: first item slides up, others slide down
            const allItems = Array.from(document.querySelectorAll('.project-item'));
            const clickedIndex = allItems.indexOf(item);
            const direction = clickedIndex === 0 ? 'slide-up' : 'slide-down';
            
            animateProjectItem(item, direction, () => {
                window.location.href = route;
            });
        };
        
        item.addEventListener('click', handleActivation);
        item.addEventListener('keydown', handleActivation);
    });
    
    // Handle CLIENTS dropdown items - navigate to individual client pages
    const clientsDropdownItems = document.querySelectorAll('.clients-dropdown .dropdown-item');
    clientsDropdownItems.forEach(item => {
        item.addEventListener('click', function(e) {
            // Don't prevent default - let the link navigate naturally
            // The href is already set to the correct client page (e.g., ynb.html)
        });
    });
    
    // Function to filter projects by category (kept for backward compatibility)
    function filterProjectsByCategory(category) {
        const projectItems = document.querySelectorAll('.project-item');
        projectItems.forEach(item => {
            const itemCategory = item.getAttribute('data-category');
            if (category === 'all' || itemCategory === category) {
                item.style.display = '';
                item.style.opacity = '1';
            } else {
                item.style.display = 'none';
            }
        });
    }
    
    // Check for category parameter in URL on work section (backward compatibility)
    if (window.location.hash === '#work' || window.location.pathname.includes('index.html')) {
        const urlParams = new URLSearchParams(window.location.search);
        const categoryParam = urlParams.get('category');
        if (categoryParam) {
            setTimeout(() => {
                filterProjectsByCategory(categoryParam);
            }, 300);
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
        
        // Scale thumbnails - maintain aspect ratio, only scale height
        const thumbnailWrappers = item.querySelectorAll('.project-thumbnail-wrapper');
        const baseHeight = 200;
        
        thumbnailWrappers.forEach(wrapper => {
            // Only scale height, width is auto to maintain aspect ratio
            wrapper.style.height = `${baseHeight * scaleFactor}px`;
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

// Contact Form Handler - Use global flag to prevent multiple initializations
if (window.contactFormInitialized) {
    // Already initialized, do nothing
} else {
    window.contactFormInitialized = true;
    
    function initContactForm() {
        const contactForm = document.getElementById('contactForm');
        if (!contactForm) {
            return false;
        }
        
        // Check if handler is already attached
        if (contactForm.dataset.handlerAttached === 'true') {
            return true;
        }
        
        // Mark as attached
        contactForm.dataset.handlerAttached = 'true';
        const contactStatus = document.getElementById('contactStatus');
        
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            // Prevent duplicate submissions using form property
            if (contactForm.isSubmitting) {
                return;
            }
            
            contactForm.isSubmitting = true;
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
            contactForm.isSubmitting = false;
            submitButton.disabled = false;
            submitButton.textContent = 'Send Message';
        }
    });
    
    return true;
    }
    
    // Initialize contact form when DOM is ready (ONLY ONCE)
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initContactForm, { once: true });
    } else {
        initContactForm();
    }
}

// Time Display System
(function initTimeDisplay() {
    const timeDisplay = document.getElementById('timeDisplay');
    if (!timeDisplay) return;
    
    function updateTime() {
        const now = new Date();
        const day = String(now.getDate()).padStart(2, '0');
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const year = now.getFullYear();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        
        timeDisplay.textContent = `${month}/${day}/${year} ${hours}:${minutes}:${seconds}`;
    }
    
    // Update immediately and then every second
    updateTime();
    setInterval(updateTime, 1000);
})();

// Coordinate Display System
(function initCoordinateDisplay() {
    const coordinateDisplay = document.getElementById('coordinateDisplay');
    if (!coordinateDisplay) return;
    
    let mouseX = 0;
    let mouseY = 0;
    let currentHoverTarget = null;
    let lastLogMessage = '';
    let logTimeout = null;
    
    // Track mouse position
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        updateDisplay();
    });
    
    // Track hover targets
    document.addEventListener('mouseover', (e) => {
        const target = e.target;
        let hoverText = null;
        
        // Check for clickable elements
        if (target.tagName === 'A' || target.tagName === 'BUTTON' || target.onclick) {
            hoverText = target.textContent?.trim() || target.getAttribute('data-text') || target.getAttribute('aria-label') || target.title;
        }
        // Check for project items
        else if (target.closest('.project-item')) {
            const projectTitle = target.closest('.project-item')?.querySelector('.project-title')?.textContent?.trim();
            if (projectTitle) hoverText = projectTitle;
        }
        // Check for client items
        else if (target.closest('.client-item') || target.closest('.client-list-item')) {
            hoverText = target.textContent?.trim() || target.getAttribute('data-client');
        }
        
        currentHoverTarget = hoverText;
        updateDisplay();
    });
    
    document.addEventListener('mouseout', () => {
        currentHoverTarget = null;
        updateDisplay();
    });
    
    // Intercept console.log
    const originalConsoleLog = console.log;
    const originalConsoleError = console.error;
    const originalConsoleWarn = console.warn;
    
    function sanitizeLogMessage(message) {
        // Remove sensitive information
        let msg = String(message);
        // Remove emojis
        msg = msg.replace(/[\u{1F300}-\u{1F9FF}]/gu, ''); // Emoji range
        msg = msg.replace(/[\u{2600}-\u{26FF}]/gu, ''); // Miscellaneous symbols
        msg = msg.replace(/[\u{2700}-\u{27BF}]/gu, ''); // Dingbats
        // Remove email patterns
        msg = msg.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[email]');
        // Remove URLs with tokens/keys
        msg = msg.replace(/[?&](token|key|api_key|secret|password)=[^&\s]+/gi, '[key]');
        // Remove long data objects
        if (msg.length > 100) {
            msg = msg.substring(0, 100) + '...';
        }
        return msg.trim();
    }
    
    function captureLog(originalFn, level) {
        return function(...args) {
            // Call original
            originalFn.apply(console, args);
            
            // Capture non-sensitive logs
            const message = args.map(arg => {
                if (typeof arg === 'object') {
                    try {
                        return JSON.stringify(arg).substring(0, 50);
                    } catch (e) {
                        return String(arg).substring(0, 50);
                    }
                }
                return String(arg);
            }).join(' ');
            
            const sanitized = sanitizeLogMessage(message);
            
            // Only show certain types of logs (not errors with sensitive data)
            if (level === 'log' && !sanitized.includes('Form data') && !sanitized.includes('email')) {
                lastLogMessage = sanitized;
                updateDisplay();
                
                // Clear log message after 3 seconds
                clearTimeout(logTimeout);
                logTimeout = setTimeout(() => {
                    lastLogMessage = '';
                    updateDisplay();
                }, 3000);
            }
        };
    }
    
    console.log = captureLog(originalConsoleLog, 'log');
    console.error = captureLog(originalConsoleError, 'error');
    console.warn = captureLog(originalConsoleWarn, 'warn');
    
    function updateDisplay() {
        let displayText = `${mouseX}, ${mouseY}`;
        
        if (currentHoverTarget) {
            displayText += ` | ${currentHoverTarget}`;
        }
        
        if (lastLogMessage) {
            displayText += ` | ${lastLogMessage}`;
        }
        
        coordinateDisplay.textContent = displayText;
    }
    
    // Initialize
    updateDisplay();
})();


