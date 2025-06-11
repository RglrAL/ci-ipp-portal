/**
 * Citizens Information - JavaScript Module
 * Clean, modular JavaScript for interactive components
 */

(function() {
    'use strict';

    // Configuration
    const config = {
        mobileBreakpoint: 1080,
        headerHeight: 89,
        animationDuration: 300
    };

    // State management
    const state = {
        mobileMenuOpen: false,
        searchExpanded: false,
        currentFocus: null
    };

    // DOM Elements
    const elements = {
        mobileMenuToggle: null,
        mobileNav: null,
        searchForm: null,
        header: null
    };

    /**
     * Initialize the application
     */
    function init() {
        // Cache DOM elements
        cacheElements();
        
        // Set up event listeners
        setupEventListeners();
        
        // Initialize components
        initMobileMenu();
        initSearch();
        initStickyHeader();
        initAccessibility();
    }

    /**
     * Cache DOM elements for better performance
     */
    function cacheElements() {
        elements.mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
        elements.mobileNav = document.querySelector('.mobile-nav');
        elements.searchForm = document.querySelector('.search-form');
        elements.header = document.querySelector('.site-header');
    }

    /**
     * Set up global event listeners
     */
    function setupEventListeners() {
        // Window resize
        let resizeTimer;
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(handleResize, 250);
        });

        // Escape key handler
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeMobileMenu();
            }
        });
    }

    /**
     * Mobile Menu Functionality
     */
    function initMobileMenu() {
        if (!elements.mobileMenuToggle || !elements.mobileNav) return;

        elements.mobileMenuToggle.addEventListener('click', toggleMobileMenu);

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (state.mobileMenuOpen && 
                !elements.mobileNav.contains(e.target) && 
                !elements.mobileMenuToggle.contains(e.target)) {
                closeMobileMenu();
            }
        });
    }

    function toggleMobileMenu() {
        state.mobileMenuOpen = !state.mobileMenuOpen;
        
        if (state.mobileMenuOpen) {
            openMobileMenu();
        } else {
            closeMobileMenu();
        }
    }

    function openMobileMenu() {
    elements.mobileNav.classList.add('active');
    elements.mobileMenuToggle.classList.add('active'); // Add active class instead of changing text
    elements.mobileMenuToggle.setAttribute('aria-expanded', 'true');
    // Remove this line: elements.mobileMenuToggle.textContent = '✕';
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
    
    // Focus management
    const firstLink = elements.mobileNav.querySelector('a');
    if (firstLink) firstLink.focus();
}

    function closeMobileMenu() {
    state.mobileMenuOpen = false;
    elements.mobileNav.classList.remove('active');
    elements.mobileMenuToggle.classList.remove('active'); // Remove active class
    elements.mobileMenuToggle.setAttribute('aria-expanded', 'false');
    // Remove this line: elements.mobileMenuToggle.textContent = '☰';
    
    // Restore body scroll
    document.body.style.overflow = '';
}

    /**
     * Search Functionality
     */
    function initSearch() {
        if (!elements.searchForm) return;

        const searchInput = elements.searchForm.querySelector('.search-input');
        
        // Auto-focus management
        searchInput.addEventListener('focus', function() {
            elements.searchForm.classList.add('focused');
        });

        searchInput.addEventListener('blur', function() {
            elements.searchForm.classList.remove('focused');
        });

        // Form submission
        elements.searchForm.addEventListener('submit', function(e) {
            const query = searchInput.value.trim();
            if (!query) {
                e.preventDefault();
                searchInput.focus();
            }
        });
    }

    /**
     * Sticky Header
     */
    function initStickyHeader() {
        if (!elements.header) return;

        let lastScrollTop = 0;
        let isScrolling = false;

        window.addEventListener('scroll', function() {
            if (!isScrolling) {
                window.requestAnimationFrame(function() {
                    handleScroll();
                    isScrolling = false;
                });
                isScrolling = true;
            }
        });

        function handleScroll() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (scrollTop > lastScrollTop && scrollTop > config.headerHeight) {
                // Scrolling down
                elements.header.classList.add('header-hidden');
            } else {
                // Scrolling up
                elements.header.classList.remove('header-hidden');
            }
            
            lastScrollTop = scrollTop;
        }
    }

    /**
     * Accessibility Enhancements
     */
    function initAccessibility() {
        // Skip to main content
        const skipLink = document.querySelector('a[href="#main-content"]');
        if (skipLink) {
            skipLink.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector('#main-content');
                if (target) {
                    target.tabIndex = -1;
                    target.focus();
                }
            });
        }

        // Keyboard navigation for dropdowns
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            const link = item.querySelector('.nav-link');
            const submenu = item.querySelector('.sub-nav');
            
            if (submenu) {
                link.addEventListener('keydown', function(e) {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        toggleSubmenu(item);
                    }
                });
            }
        });
    }

    /**
     * Handle window resize
     */
    function handleResize() {
        // Close mobile menu if window is resized to desktop
        if (window.innerWidth > config.mobileBreakpoint && state.mobileMenuOpen) {
            closeMobileMenu();
        }
    }

    /**
     * Utility Functions
     */
    
    // Debounce function for performance
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Smooth scroll to element
    function smoothScrollTo(element) {
        if (!element) return;
        
        const targetPosition = element.getBoundingClientRect().top + window.pageYOffset;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        const duration = 500;
        let start = null;

        function animation(currentTime) {
            if (start === null) start = currentTime;
            const timeElapsed = currentTime - start;
            const run = ease(timeElapsed, startPosition, distance, duration);
            window.scrollTo(0, run);
            if (timeElapsed < duration) requestAnimationFrame(animation);
        }

        function ease(t, b, c, d) {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t + b;
            t--;
            return -c / 2 * (t * (t - 2) - 1) + b;
        }

        requestAnimationFrame(animation);
    }

    /**
     * Public API
     */
    const CitizensInfo = {
        init: init,
        closeMobileMenu: closeMobileMenu,
        smoothScrollTo: smoothScrollTo
    };

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Expose public API
    window.CitizensInfo = CitizensInfo;

})();





/**
 * Category Page Specific JavaScript
 * Add this to your existing main.js or create a separate category.js file
 */

(function() {
    'use strict';

    /**
     * Initialize category page specific features
     */
    function initCategoryPage() {
        // Check if we're on a category page
        if (!document.querySelector('.hero-simplified')) {
            return;
        }

        // Initialize breadcrumb accessibility
        initBreadcrumb();
        
        // Initialize info box interactions
        initInfoBoxes();
        
        // Enhance category link list
        initCategoryLinks();
    }

    /**
     * Breadcrumb Navigation Enhancement
     */
    function initBreadcrumb() {
        const breadcrumb = document.querySelector('.breadcrumb');
        if (!breadcrumb) return;

        // Add ARIA attributes for better screen reader support
        const links = breadcrumb.querySelectorAll('a');
        links.forEach((link, index) => {
            link.setAttribute('aria-label', `Breadcrumb level ${index + 1}`);
        });
    }

    /**
     * Info Box Interactions
     */
    function initInfoBoxes() {
        const infoBoxes = document.querySelectorAll('.info-box');
        
        infoBoxes.forEach(box => {
            // Add role for accessibility
            box.setAttribute('role', 'complementary');
            box.setAttribute('aria-label', 'Information notice');
            
            // Optional: Add close button functionality
            if (box.classList.contains('dismissible')) {
                addCloseButton(box);
            }
        });
    }

    /**
     * Add close button to dismissible info boxes
     */
    function addCloseButton(box) {
        const closeBtn = document.createElement('button');
        closeBtn.className = 'info-box-close';
        closeBtn.innerHTML = '&times;';
        closeBtn.setAttribute('aria-label', 'Close information box');
        
        closeBtn.addEventListener('click', function() {
            box.style.display = 'none';
            // Optional: Save preference in localStorage
            if (box.id) {
                localStorage.setItem(`infobox-${box.id}-hidden`, 'true');
            }
        });
        
        box.appendChild(closeBtn);
    }

    /**
     * Category Links Enhancement
     */
    function initCategoryLinks() {
        const categoryLinks = document.querySelectorAll('.category-link-list a');
        
        // Add keyboard navigation enhancement
        categoryLinks.forEach((link, index) => {
            link.addEventListener('keydown', function(e) {
                let nextLink, prevLink;
                
                switch(e.key) {
                    case 'ArrowDown':
                        e.preventDefault();
                        nextLink = categoryLinks[index + 1];
                        if (nextLink) nextLink.focus();
                        break;
                    case 'ArrowUp':
                        e.preventDefault();
                        prevLink = categoryLinks[index - 1];
                        if (prevLink) prevLink.focus();
                        break;
                }
            });
        });
    }

    /**
     * Search form enhancement for category page
     */
    function enhanceCategorySearch() {
        const searchForm = document.querySelector('.search-standalone');
        if (!searchForm) return;

        const searchInput = searchForm.querySelector('.search-input');
        
        // Auto-populate with category context
        const categoryTitle = document.querySelector('.category-title');
        if (categoryTitle && searchInput) {
            // Add placeholder with category context
            const categoryName = categoryTitle.textContent.trim();
            searchInput.setAttribute('placeholder', `Search in ${categoryName}...`);
        }
    }

    /**
     * Smooth scroll for anchor links
     */
    function initSmoothScroll() {
        const anchorLinks = document.querySelectorAll('a[href^="#"]');
        
        anchorLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const target = document.querySelector(targetId);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    
                    // Update focus for accessibility
                    target.tabIndex = -1;
                    target.focus();
                }
            });
        });
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            initCategoryPage();
            enhanceCategorySearch();
            initSmoothScroll();
        });
    } else {
        initCategoryPage();
        enhanceCategorySearch();
        initSmoothScroll();
    }

})();




/**
 * Add this code to your existing main.js file
 * This handles moving the search bar to the top at 980px breakpoint
 */

// Category page search repositioning
/**
 * Update your initCategorySearchReposition function to handle both category and content pages
 * Replace the existing function with this updated version in your main.js
 */

// Category and Content page search repositioning
function initSearchReposition() {
    // Run on both category and content pages
    const isRelevantPage = document.querySelector('.category-layout') || document.querySelector('.content-layout');
    if (!isRelevantPage) return;
    
    const search = document.querySelector('.sidebar-search');
    const mainContent = document.querySelector('#main-content');
    const wrapper = mainContent.querySelector('.wrapper');
    const pageHeader = document.querySelector('.page-header');
    const sidebar = document.querySelector('.category-sidebar') || document.querySelector('.content-sidebar');
    
    if (!search || !wrapper || !pageHeader || !sidebar) return;
    
    function repositionSearch() {
        const isMobile = window.innerWidth <= 980;
        const searchParent = search.parentElement;
        
        if (isMobile && searchParent !== wrapper) {
            // Move search to top of wrapper (before page-header)
            wrapper.insertBefore(search, wrapper.firstChild);
            search.classList.add('search-repositioned');
        } else if (!isMobile && searchParent !== sidebar) {
            // Move search back to sidebar
            sidebar.insertBefore(search, sidebar.firstChild);
            search.classList.remove('search-repositioned');
        }
    }
    
    // Run on load
    repositionSearch();
    
    // Run on resize with debounce
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(repositionSearch, 100);
    });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSearchReposition);
} else {
    initSearchReposition();
}



/**
 * IPP Portal JavaScript Additions
 * Add these functions to the end of your existing main.js file
 */

// IPP Language Selector Functionality
function initIPPLanguageSelector() {
    const languageSelect = document.getElementById('language-select');
    if (!languageSelect) return;
    
    // Handle language change
    languageSelect.addEventListener('change', function(e) {
        const selectedLang = e.target.value;
        
        // In production, this would redirect to the translated version
        // For now, we'll just log the selection
        console.log('Language selected:', selectedLang);
        
        // Example redirect logic (commented out):
        // const currentPath = window.location.pathname;
        // const newPath = currentPath.replace(/^\/[a-z]{2}\//, `/${selectedLang}/`);
        // window.location.href = newPath;
        
        // Show confirmation (temporary)
        if (selectedLang !== 'en') {
            alert(`Language changed to: ${e.target.options[e.target.selectedIndex].text}`);
        }
    });
    
    // Set current language based on URL
    const currentLang = document.documentElement.lang || 'en';
    languageSelect.value = currentLang;
}

// IPP Portal Navigation Enhancements
function initIPPPortalNav() {
    const portalNav = document.querySelector('.portal-nav');
    if (!portalNav) return;
    
    // Add scroll behavior
    let lastScrollTop = 0;
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add shadow when scrolled
        if (scrollTop > 100) {
            portalNav.classList.add('scrolled');
        } else {
            portalNav.classList.remove('scrolled');
        }
        
        lastScrollTop = scrollTop;
    });
}

// IPP Category Card Analytics
function initIPPCategoryTracking() {
    const categoryCards = document.querySelectorAll('.portal-category-card');
    
    categoryCards.forEach(card => {
        card.addEventListener('click', function(e) {
            const categoryTitle = this.querySelector('h2').textContent;
            
            // Track category click (integrate with your analytics)
            console.log('Category clicked:', categoryTitle);
            
            // Example Google Analytics tracking (if implemented):
            // if (typeof gtag !== 'undefined') {
            //     gtag('event', 'click', {
            //         'event_category': 'IPP Navigation',
            //         'event_label': categoryTitle
            //     });
            // }
        });
    });
}

// Initialize IPP-specific features
function initIPPFeatures() {
    initIPPLanguageSelector();
    initIPPPortalNav();
    initIPPCategoryTracking();
}

// Run IPP features on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initIPPFeatures);
} else {
    initIPPFeatures();
}


/**
 * Mobile Dual Menu System for IPP Portal - FIXED VERSION
 * Replace your existing initPortalMobileMenu function with this
 */

// Portal Mobile Menu Functionality
function initPortalMobileMenu() {
    // Always check if we're on an IPP page and add the class
    const isIPPPage = document.querySelector('.ipp-hero') !== null;
    if (isIPPPage) {
        document.body.classList.add('ipp-page');
    }
    
    const portalMenuToggle = document.querySelector('.portal-menu-toggle');
    const portalMobileNav = document.querySelector('.portal-mobile-nav');
    const mainMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mainMobileNav = document.querySelector('.mobile-nav');
    
    // Only proceed with mobile menu setup if elements exist
    if (!portalMenuToggle || !portalMobileNav) return;
    
    // Portal menu toggle
    portalMenuToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        togglePortalMenu();
    });
    
    // Close portal menu when clicking outside
    document.addEventListener('click', function(e) {
        if (portalMobileNav.classList.contains('active') && 
            !portalMobileNav.contains(e.target) && 
            !portalMenuToggle.contains(e.target)) {
            closePortalMenu();
        }
    });
    
    // Handle language selector in mobile portal menu
    const mobileLanguageSelect = document.getElementById('mobile-language-select');
    if (mobileLanguageSelect) {
        // First, populate it with all languages
        const mainLanguageSelect = document.getElementById('language-select');
        if (mainLanguageSelect) {
            mobileLanguageSelect.innerHTML = mainLanguageSelect.innerHTML;
        }
        
        mobileLanguageSelect.addEventListener('change', function(e) {
            // Sync with main language selector
            if (mainLanguageSelect) {
                mainLanguageSelect.value = e.target.value;
                // Trigger change event on main selector
                mainLanguageSelect.dispatchEvent(new Event('change'));
            }
        });
    }
    
    function togglePortalMenu() {
        const isActive = portalMobileNav.classList.contains('active');
        
        if (isActive) {
            closePortalMenu();
        } else {
            // Close main menu if open
            if (mainMobileNav && mainMobileNav.classList.contains('active')) {
                closeMainMenu();
            }
            openPortalMenu();
        }
    }
    
    function openPortalMenu() {
        portalMobileNav.classList.add('active');
        portalMenuToggle.classList.add('active');
        portalMenuToggle.setAttribute('aria-expanded', 'true');
        document.body.classList.add('portal-menu-open');
        
        // Focus first link
        const firstLink = portalMobileNav.querySelector('a');
        if (firstLink) firstLink.focus();
    }
    
    function closePortalMenu() {
        portalMobileNav.classList.remove('active');
        portalMenuToggle.classList.remove('active');
        portalMenuToggle.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('portal-menu-open');
    }
    
    // Update main menu functions to work with portal menu
    function closeMainMenu() {
        if (mainMobileNav) {
            mainMobileNav.classList.remove('active');
        }
        if (mainMenuToggle) {
            mainMenuToggle.classList.remove('active');
            mainMenuToggle.setAttribute('aria-expanded', 'false');
        }
        document.body.classList.remove('mobile-menu-open');
    }
    
    // Escape key closes both menus
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closePortalMenu();
            closeMainMenu();
        }
    });
    
    // Handle window resize
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            if (window.innerWidth > 1080) {
                closePortalMenu();
                closeMainMenu();
            }
        }, 250);
    });
}


// Main Navigation Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileNav = document.querySelector('.mobile-nav');
    
    if (mobileMenuToggle && mobileNav) {
        mobileMenuToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            mobileNav.classList.toggle('active');
            document.body.classList.toggle('mobile-menu-open');
            
            // Update aria-expanded
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !isExpanded);
            
            // DON'T change textContent or innerHTML!
        });
    }
    
    // Portal navigation mobile menu
    const portalMenuToggle = document.querySelector('.portal-menu-toggle');
    const portalMobileNav = document.querySelector('.portal-mobile-nav');
    
    if (portalMenuToggle && portalMobileNav) {
        portalMenuToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            portalMobileNav.classList.toggle('active');
            document.body.classList.toggle('portal-menu-open');
            
            // Update aria-expanded
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !isExpanded);
        });
    }
    
    // Close menus when clicking outside
    document.addEventListener('click', function(event) {
        // Close main menu
        if (!event.target.closest('.mobile-menu-toggle') && !event.target.closest('.mobile-nav')) {
            if (mobileNav && mobileNav.classList.contains('active')) {
                mobileMenuToggle.classList.remove('active');
                mobileNav.classList.remove('active');
                document.body.classList.remove('mobile-menu-open');
                mobileMenuToggle.setAttribute('aria-expanded', 'false');
            }
        }
        
        // Close portal menu
        if (!event.target.closest('.portal-menu-toggle') && !event.target.closest('.portal-mobile-nav')) {
            if (portalMobileNav && portalMobileNav.classList.contains('active')) {
                portalMenuToggle.classList.remove('active');
                portalMobileNav.classList.remove('active');
                document.body.classList.remove('portal-menu-open');
                portalMenuToggle.setAttribute('aria-expanded', 'false');
            }
        }
    });
    
    // Handle window resize
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            if (window.innerWidth > 1080) {
                // Close mobile menus on desktop
                if (mobileNav) {
                    mobileMenuToggle.classList.remove('active');
                    mobileNav.classList.remove('active');
                    document.body.classList.remove('mobile-menu-open');
                    mobileMenuToggle.setAttribute('aria-expanded', 'false');
                }
                if (portalMobileNav) {
                    portalMenuToggle.classList.remove('active');
                    portalMobileNav.classList.remove('active');
                    document.body.classList.remove('portal-menu-open');
                    portalMenuToggle.setAttribute('aria-expanded', 'false');
                }
            }
        }, 250);
    });
});




