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
    initPortalMenu();
}

// Run IPP features on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initIPPFeatures);
} else {
    initIPPFeatures();
}


/* ============================================================
   YIPG Portal Menu - single hamburger that opens the full
   sitemap as a slide-in accordion panel. (2026 redesign)
   The sitemap lives in ONE place below so it is easy to
   repoint when this moves to UAT.
   ============================================================ */

const IPP_SITEMAP = [
    {
        title: 'International protection in Ireland',
        href: 'ipp-section-international-protection.html',
        children: [
            {
                title: 'Applying for international protection',
                href: 'ipp-category-applying-for-international-protection.html',
                children: [
                    { title: 'The steps of applying for international protection', href: 'ipp-content-the-steps-of-applying-for-international-protection.html' },
                    { title: 'If your application is inadmissible', href: '#' },
                    { title: 'International protection explained', href: '#' },
                    { title: 'How to find the International Protection Office', href: '#' },
                    { title: 'Your rights during the application process', href: '#' },
                    { title: 'Your duties during the application process', href: '#' }
                ]
            },
            {
                title: 'After your decision',
                href: 'ipp-category-after-your-decision.html',
                children: [
                    { title: 'Next steps after a successful decision', href: 'ipp-content-next-steps-after-a-successful-decision.html' },
                    { title: 'Voluntary return', href: '#' },
                    { title: 'Appealing a decision from the IPO', href: '#' }
                ]
            },
            {
                title: 'Help with your application',
                href: 'ipp-category-help-with-your-application.html',
                children: [
                    { title: 'Legal help with your application', href: 'ipp-content-legal-help-with-your-application.html' },
                    { title: 'Support while you wait for a decision', href: '#' }
                ]
            }
        ]
    },
    {
        title: 'Living in an accommodation centre',
        href: 'ipp-section-accommodation.html',
        children: [
            {
                title: 'Supports available',
                href: 'ipp-category-supports-available.html',
                children: [
                    { title: 'Social welfare payments', href: 'ipp-content-social-welfare-payments.html' },
                    { title: 'What happens if you do not get accommodation', href: '#' },
                    { title: 'Transport to medical appointments', href: '#' }
                ]
            },
            {
                title: 'Life in an accommodation centre',
                href: 'ipp-category-life-in-an-accommodation-centre.html',
                children: [
                    { title: 'Complaints about your accommodation centre', href: 'ipp-content-complaints-about-your-accommodation-centre.html' },
                    { title: 'What to expect in an accommodation centre', href: '#' },
                    { title: 'Moving to a new accommodation centre', href: '#' }
                ]
            },
            {
                title: 'Documents you need',
                href: 'ipp-category-documents-you-need.html',
                children: [
                    { title: 'Getting your Temporary Residence Certificate', href: 'ipp-content-getting-your-temporary-residence-certificate.html' },
                    { title: 'How to get your PPS number, PSC card and myGov ID', href: '#' }
                ]
            }
        ]
    },
    {
        title: 'Life in Ireland',
        href: 'ipp-section-life-in-ireland.html',
        children: [
            {
                title: 'About Ireland',
                href: 'ipp-category-about-ireland.html',
                children: [
                    { title: 'Ireland: Facts and figures', href: 'ipp-content-ireland-facts-and-figures.html' },
                    { title: 'Get to know Irish culture', href: '#' },
                    { title: 'Festivals and holidays in Ireland', href: '#' },
                    { title: 'Irish people and social norms', href: '#' },
                    { title: 'Your rights in Ireland', href: '#' },
                    { title: 'A short history of Ireland', href: '#' },
                    { title: 'Rights and equality in Ireland', href: '#' }
                ]
            },
            {
                title: 'Education',
                href: 'ipp-category-education.html',
                children: [
                    { title: 'Going to primary school', href: 'ipp-content-going-to-primary-school.html' },
                    { title: 'Going to post-primary school', href: '#' },
                    { title: 'Sending your child to school', href: '#' },
                    { title: 'Going to college or university', href: '#' },
                    { title: 'Support for going to college', href: '#' },
                    { title: 'Learning English', href: '#' }
                ]
            },
            {
                title: 'Employment and money',
                href: 'ipp-category-employment-and-money.html',
                children: [
                    { title: 'Permission to work', href: 'ipp-content-permission-to-work.html' },
                    { title: 'How to open a bank account', href: '#' },
                    { title: 'Paying tax in Ireland', href: '#' },
                    { title: 'How to read your payslip', href: '#' },
                    { title: 'Finding a job as an international protection applicant', href: '#' },
                    { title: 'How to get your qualifications recognised', href: '#' },
                    { title: 'Volunteering', href: '#' },
                    { title: 'Your employment rights', href: '#' }
                ]
            },
            {
                title: 'Transport and recreation',
                href: 'ipp-category-transport-and-recreation.html',
                children: [
                    { title: 'Public transport in Ireland', href: 'ipp-content-public-transport-in-ireland.html' },
                    { title: 'Driving and road safety', href: '#' },
                    { title: 'Sports and the outdoors', href: '#' }
                ]
            },
            {
                title: 'Safety and emergencies',
                href: 'ipp-category-safety-and-emergencies.html',
                children: [
                    { title: 'What to do in an emergency', href: 'ipp-content-what-to-do-in-an-emergency.html' },
                    { title: '[Sexual crimes and related crimes]', href: '#' },
                    { title: 'Crime and safety', href: '#' },
                    { title: 'Hate crime', href: '#' },
                    { title: 'Scams and how to avoid them', href: '#' },
                    { title: 'Reporting a crime', href: '#' }
                ]
            },
            {
                title: 'Your health',
                href: 'ipp-category-your-health.html',
                children: [
                    { title: 'The Irish health system', href: 'ipp-content-the-irish-health-system.html' },
                    { title: 'Your local pharmacy', href: '#' },
                    { title: 'Alcohol and drug addiction support', href: '#' },
                    { title: 'Vaccinations', href: '#' },
                    { title: 'Dental, eye and hearing care', href: '#' },
                    { title: 'Mental health support in Ireland', href: '#' },
                    { title: 'Sexual health and contraception', href: '#' },
                    { title: 'Help for female genital mutilation (FGM)', href: '#' }
                ]
            },
            {
                title: 'Relationships and community support',
                href: 'ipp-category-relationships-and-community-support.html',
                children: [
                    { title: 'Help for domestic abuse', href: 'ipp-content-help-for-domestic-abuse.html' },
                    { title: 'Divorce in Ireland', href: '#' },
                    { title: 'Marriage in Ireland', href: '#' },
                    { title: 'LGBTIQ+ rights and community', href: '#' },
                    { title: 'Social, cultural, and religious supports', href: '#' },
                    { title: 'Community integration', href: '#' }
                ]
            },
            {
                title: 'Parenting and children',
                href: 'ipp-category-parenting-and-children.html',
                children: [
                    { title: 'Childcare and early childhood education', href: 'ipp-content-childcare-and-early-childhood-education.html' },
                    { title: 'Children’s rights and safety', href: '#' },
                    { title: 'Having a baby in Ireland', href: '#' }
                ]
            },
            {
                title: 'Life after the international protection process',
                href: 'ipp-category-life-after-the-international-protection-process.html',
                children: [
                    { title: 'Social welfare changes', href: 'ipp-content-social-welfare-changes.html' },
                    { title: 'Renting and finding housing', href: '#' },
                    { title: 'Finding a job after your decision', href: '#' },
                    { title: 'Citizenship', href: '#' },
                    { title: 'Leaving the accommodation centre', href: '#' }
                ]
            }
        ]
    }
];

// Smoothly expand a sub-list from 0 to its content height, then release to
// auto so nested items can grow it further.
function expandSub(sub) {
    sub.hidden = false;
    sub.style.height = '0px';
    sub.offsetHeight; // force reflow so the transition runs
    sub.style.height = sub.scrollHeight + 'px';
    const done = function(e) {
        if (e.target !== sub || e.propertyName !== 'height') return;
        sub.style.height = '';
        sub.removeEventListener('transitionend', done);
    };
    sub.addEventListener('transitionend', done);
}

// Smoothly collapse a sub-list to 0, then hide it.
function collapseSub(sub) {
    sub.style.height = sub.scrollHeight + 'px';
    sub.offsetHeight;
    sub.style.height = '0px';
    const done = function(e) {
        if (e.target !== sub || e.propertyName !== 'height') return;
        sub.hidden = true;
        sub.style.height = '';
        sub.removeEventListener('transitionend', done);
    };
    sub.addEventListener('transitionend', done);
}

// Collapse a group (animating its own sub) and reset any open descendants so
// it reopens clean. Used for the section-level accordion.
function collapseGroup(g) {
    const btn = g.querySelector(':scope > .portal-menu-row > .portal-menu-expand');
    const sub = g.querySelector(':scope > .portal-menu-sub');
    g.classList.remove('open');
    if (btn) btn.setAttribute('aria-expanded', 'false');
    if (sub && !sub.hidden) collapseSub(sub);
    // snap inner descendants closed (hidden inside the collapsing section)
    g.querySelectorAll('.portal-menu-group.open').forEach(function(node) {
        node.classList.remove('open');
        const b = node.querySelector(':scope > .portal-menu-row > .portal-menu-expand');
        const s = node.querySelector(':scope > .portal-menu-sub');
        if (b) b.setAttribute('aria-expanded', 'false');
        if (s) { s.hidden = true; s.style.height = ''; }
    });
}

// One menu node. Items with children render as an expandable accordion row;
// leaf items (individual pages) render as a plain link. Recurses for the
// 3-level tree: Section -> Category -> Page.
function buildMenuNode(item, level, idPath) {
    const hasChildren = item.children && item.children.length;

    if (!hasChildren) {
        const leaf = document.createElement('li');
        leaf.className = 'portal-menu-leaf level-' + level;
        const a = document.createElement('a');
        a.className = 'portal-menu-sublink';
        a.href = item.href;
        a.textContent = item.title;
        leaf.appendChild(a);
        return leaf;
    }

    const group = document.createElement('li');
    group.className = 'portal-menu-group level-' + level;

    const row = document.createElement('div');
    row.className = 'portal-menu-row';

    const link = document.createElement('a');
    link.className = 'portal-menu-cat';
    link.href = item.href;
    link.textContent = item.title;

    const sub = document.createElement('ul');
    sub.className = 'portal-menu-sub';
    sub.id = 'portal-sub-' + idPath;
    sub.hidden = true;

    const expand = document.createElement('button');
    expand.className = 'portal-menu-expand';
    expand.setAttribute('aria-expanded', 'false');
    expand.setAttribute('aria-controls', sub.id);
    expand.setAttribute('aria-label', 'Show ' + item.title);
    expand.innerHTML = '<span></span>';
    expand.addEventListener('click', function() {
        const willOpen = expand.getAttribute('aria-expanded') !== 'true';
        if (willOpen) {
            // Accordion at the SECTION level only (one section open at a time).
            // Categories within a section toggle freely.
            if (level === 1) {
                Array.prototype.forEach.call(group.parentElement.children, function(sib) {
                    if (sib !== group && sib.classList.contains('open')) collapseGroup(sib);
                });
            }
            expand.setAttribute('aria-expanded', 'true');
            group.classList.add('open');
            expandSub(sub);
        } else {
            expand.setAttribute('aria-expanded', 'false');
            group.classList.remove('open');
            collapseSub(sub);
        }
    });

    row.appendChild(link);
    row.appendChild(expand);

    item.children.forEach(function(child, i) {
        sub.appendChild(buildMenuNode(child, level + 1, idPath + '-' + i));
    });

    group.appendChild(row);
    group.appendChild(sub);
    return group;
}

function buildPortalMenu() {
    const list = document.querySelector('[data-portal-menu]');
    if (!list || list.children.length) return;

    // About lives in the bar on desktop; on mobile it moves into this menu,
    // at the top above the sections. CSS shows this item only on mobile.
    const about = document.createElement('li');
    about.className = 'portal-menu-leaf portal-menu-extra level-1';
    const aboutLink = document.createElement('a');
    aboutLink.className = 'portal-menu-sublink portal-menu-extra-link';
    aboutLink.href = 'ipp-about.html';
    aboutLink.textContent = 'About';
    about.appendChild(aboutLink);
    list.appendChild(about);

    IPP_SITEMAP.forEach(function(section, i) {
        list.appendChild(buildMenuNode(section, 1, String(i)));
    });
}

function initPortalMenu() {
    const toggle = document.querySelector('.portal-menu-toggle');
    const panel = document.getElementById('portal-menu-panel');
    const overlay = document.querySelector('.portal-menu-overlay');
    const closeBtn = document.querySelector('.portal-menu-close');
    if (!toggle || !panel || !overlay) return;

    buildPortalMenu();

    function openMenu() {
        overlay.hidden = false;
        requestAnimationFrame(function() {
            overlay.classList.add('open');
            panel.classList.add('open');
        });
        panel.setAttribute('aria-hidden', 'false');
        toggle.setAttribute('aria-expanded', 'true');
        toggle.classList.add('active');
        document.body.classList.add('portal-menu-open');
        const first = panel.querySelector('a, button');
        if (first) first.focus();
    }

    function closeMenu() {
        overlay.classList.remove('open');
        panel.classList.remove('open');
        panel.setAttribute('aria-hidden', 'true');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.classList.remove('active');
        document.body.classList.remove('portal-menu-open');
        setTimeout(function() {
            if (!panel.classList.contains('open')) overlay.hidden = true;
        }, 300);
    }

    // Visible, focusable elements currently inside the panel (collapsed
    // sub-lists are hidden, so their links are excluded automatically).
    function focusables() {
        return Array.prototype.filter.call(
            panel.querySelectorAll('a[href], button:not([disabled])'),
            function(el) { return el.offsetParent !== null; }
        );
    }

    toggle.addEventListener('click', function() {
        if (panel.classList.contains('open')) closeMenu(); else openMenu();
    });
    overlay.addEventListener('click', closeMenu);
    if (closeBtn) closeBtn.addEventListener('click', closeMenu);

    document.addEventListener('keydown', function(e) {
        if (!panel.classList.contains('open')) return;

        if (e.key === 'Escape') {
            closeMenu();
            toggle.focus();
            return;
        }

        // Trap focus inside the panel while it is open
        if (e.key === 'Tab') {
            const items = focusables();
            if (!items.length) return;
            const first = items[0];
            const last = items[items.length - 1];
            if (!panel.contains(document.activeElement)) {
                e.preventDefault();
                first.focus();
            } else if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        }
    });
}


// Main (Citizens Information) header mobile menu toggle
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileNav = document.querySelector('.mobile-nav');

    if (mobileMenuToggle && mobileNav) {
        mobileMenuToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            mobileNav.classList.toggle('active');
            document.body.classList.toggle('mobile-menu-open');
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', String(!isExpanded));
        });
    }

    // Close main menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.mobile-menu-toggle') && !event.target.closest('.mobile-nav')) {
            if (mobileNav && mobileNav.classList.contains('active')) {
                mobileMenuToggle.classList.remove('active');
                mobileNav.classList.remove('active');
                document.body.classList.remove('mobile-menu-open');
                mobileMenuToggle.setAttribute('aria-expanded', 'false');
            }
        }
    });

    // Close main menu when resizing up to desktop
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            if (window.innerWidth > 1080 && mobileNav && mobileNav.classList.contains('active')) {
                mobileMenuToggle.classList.remove('active');
                mobileNav.classList.remove('active');
                document.body.classList.remove('mobile-menu-open');
                mobileMenuToggle.setAttribute('aria-expanded', 'false');
            }
        }, 250);
    });
});

