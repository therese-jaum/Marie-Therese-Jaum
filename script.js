// Theme toggle - FIXED: No localStorage
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

// Set default theme to 'dark'
let currentTheme = 'dark';
html.setAttribute('data-theme', currentTheme);

// Update navbar on initial load
window.addEventListener('load', () => {
    window.dispatchEvent(new Event('scroll'));
});

themeToggle.addEventListener('click', () => {
    currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', currentTheme);
    
    // Update navbar colors immediately
    setTimeout(() => {
        window.dispatchEvent(new Event('scroll'));
    }, 50);
});

// Mobile menu toggle - FIXED
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

menuToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    
    navLinks.classList.toggle('active');
    menuToggle.classList.toggle('active');
    
    const spans = menuToggle.querySelectorAll('span');
    if (navLinks.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translateY(8px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translateY(-8px)';
    } else {
        spans[0].style.transform = '';
        spans[1].style.opacity = '1';
        spans[2].style.transform = '';
    }
});

// Close menu on link click
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        menuToggle.classList.remove('active');
        const spans = menuToggle.querySelectorAll('span');
        spans.forEach(span => span.style.transform = '');
        spans[1].style.opacity = '1';
    });
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (!navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
        navLinks.classList.remove('active');
        menuToggle.classList.remove('active');
        const spans = menuToggle.querySelectorAll('span');
        spans.forEach(span => span.style.transform = '');
        spans[1].style.opacity = '1';
    }
});

// Smooth scrolling - FIXED to only work with # anchors
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        // Only handle internal anchor links (starting with #)
        if (href && href.startsWith('#') && href.length > 1) {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    });
});

// Portfolio items - DECLARE THIS EARLY
const portfolioItems = document.querySelectorAll('.portfolio-item');

// Enhanced Scroll Animations - Bidirectional
const scrollAnimationOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -100px 0px'
};

// Main scroll observer with bidirectional animation
const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            entry.target.classList.remove('animate-out');
        } else {
            entry.target.classList.add('animate-out');
            entry.target.classList.remove('animate-in');
        }
    });
}, scrollAnimationOptions);

// Apply to all animated elements
const animatedElements = document.querySelectorAll(`
    .expertise-item, 
    .portfolio-item, 
    .timeline-item,
    .about-image-container,
    .about-content,
    .education-section,
    .stat,
    .contact-info,
    .contact-form,
    .section-header
`);

animatedElements.forEach(el => {
    el.classList.add('scroll-animate');
    scrollObserver.observe(el);
});

// Staggered animation for grid items
const expertiseItems = document.querySelectorAll('.expertise-item');
const portfolioItemsAnim = document.querySelectorAll('.portfolio-item');

expertiseItems.forEach((item, index) => {
    item.style.transitionDelay = `${index * 0.1}s`;
});

portfolioItemsAnim.forEach((item, index) => {
    item.style.transitionDelay = `${index * 0.15}s`;
});

// Navbar scroll effect - FIXED FOR LIGHT/DARK MODE
const navbar = document.querySelector('nav');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    const isLightMode = html.getAttribute('data-theme') === 'light';
    
    if (currentScroll > 50) {
        if (isLightMode) {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(10, 10, 10, 0.95)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.3)';
        }
    } else {
        if (isLightMode) {
            navbar.style.background = 'rgba(255, 255, 255, 0.8)';
            navbar.style.boxShadow = 'none';
        } else {
            navbar.style.background = 'rgba(10, 10, 10, 0.8)';
            navbar.style.boxShadow = 'none';
        }
    }
    
    lastScroll = currentScroll;
});

// Stats counter animation
const stats = document.querySelectorAll('.stat-number');

const animateStats = (entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const target = entry.target;
            const finalValue = target.textContent.replace('+', '');
            const isPlus = target.textContent.includes('+');
            let current = 0;
            const increment = finalValue / 50;
            const timer = setInterval(() => {
                current += increment;
                if (current >= finalValue) {
                    target.textContent = finalValue + (isPlus ? '+' : '');
                    clearInterval(timer);
                } else {
                    target.textContent = Math.floor(current) + (isPlus ? '+' : '');
                }
            }, 30);
            observer.unobserve(target);
        }
    });
};

const statsObserver = new IntersectionObserver(animateStats, {
    threshold: 0.5
});

stats.forEach(stat => {
    statsObserver.observe(stat);
});

// Portfolio Modal Functionality
const portfolioModal = document.getElementById('portfolioModal');
const modalClose = document.getElementById('modalClose');
const modalOverlay = document.querySelector('.modal-overlay');
const modalImage = document.getElementById('modalImage');
const modalCategory = document.getElementById('modalCategory');
const modalTitle = document.getElementById('modalTitle');
const modalDescription = document.getElementById('modalDescription');
const modalViewBtn = document.getElementById('modalViewBtn');

// Function to move button based on screen size
function adjustModalButton() {
    const modalImageContainer = document.querySelector('.modal-image-container');
    const modalInfo = document.querySelector('.modal-info');
    
    if (window.innerWidth <= 1024) {
        modalImageContainer.appendChild(modalViewBtn);
    } else {
        modalInfo.appendChild(modalViewBtn);
    }
}

// Open modal when portfolio item is clicked
portfolioItems.forEach(item => {
    item.addEventListener('click', () => {
        const imgSrc = item.querySelector('img').src;
        const category = item.dataset.category;
        const title = item.dataset.title;
        const description = item.dataset.description;
        const link = item.dataset.link;
        
        modalImage.src = imgSrc;
        modalCategory.textContent = category;
        modalTitle.textContent = title;
        modalDescription.textContent = description;
        
        // FIXED: Properly set the href and show/hide button
        if (link && link !== '#' && link !== '') {
            modalViewBtn.href = link;
            modalViewBtn.style.display = 'inline-flex';
        } else {
            modalViewBtn.href = '#';
            modalViewBtn.style.display = 'none';
        }
        
        portfolioModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        adjustModalButton();
    });
});

window.addEventListener('resize', () => {
    if (portfolioModal.classList.contains('active')) {
        adjustModalButton();
    }
});

// Close modal function
function closeModal() {
    portfolioModal.classList.remove('active');
    document.body.style.overflow = '';
}

// Close modal on close button click
modalClose.addEventListener('click', closeModal);

// Close modal on overlay click
modalOverlay.addEventListener('click', closeModal);

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && portfolioModal.classList.contains('active')) {
        closeModal();
    }
});

// Prevent modal content click from closing modal
document.querySelector('.modal-content').addEventListener('click', (e) => {
    e.stopPropagation();
});

// FIXED: View Live button - removed preventDefault, let it work naturally
modalViewBtn.addEventListener('click', (e) => {
    const link = modalViewBtn.getAttribute('href');
    // Only prevent default if link is empty or #
    if (!link || link === '#' || link === '') {
        e.preventDefault();
        return;
    }
    // Otherwise let the link open naturally in new tab (target="_blank" is in HTML)
});

// Form submission handler
const contactForm = document.querySelector('.contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        // Form will submit to Formspree
        // You can add custom success message here if needed
    });
}

// Add active state to nav links based on scroll position
const sections = document.querySelectorAll('section[id]');

function updateActiveNavLink() {
    let current = '';
    const scrollPosition = window.pageYOffset;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.clientHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            current = sectionId;
        }
    });

    // If at top of page, set home as active
    if (scrollPosition < 100) {
        current = 'home';
    }

    navLinks.querySelectorAll('a').forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        if (href === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// Run on scroll
window.addEventListener('scroll', updateActiveNavLink);

// Run on page load
window.addEventListener('load', updateActiveNavLink);

// Typing effect for hero title (optional enhancement)
const heroTitle = document.querySelector('.hero h1 strong');
if (heroTitle) {
    const text = heroTitle.textContent;
    heroTitle.textContent = '';
    let i = 0;
    
    setTimeout(() => {
        const typeWriter = () => {
            if (i < text.length) {
                heroTitle.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        };
        typeWriter();
    }, 800);
}

// Cursor follow effect for portfolio items
portfolioItems.forEach(item => {
    item.addEventListener('mousemove', (e) => {
        const rect = item.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        item.style.setProperty('--mouse-x', `${x}px`);
        item.style.setProperty('--mouse-y', `${y}px`);
    });
});

// Timeline items staggered animation on scroll
const timelineItems = document.querySelectorAll('.timeline-item');
const timelineObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0) scale(1)';
            }, index * 150);
            timelineObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.2,
    rootMargin: '0px 0px -50px 0px'
});

timelineItems.forEach(item => {
    timelineObserver.observe(item);
});

// Scroll to Top Button Functionality
const scrollTopBtn = document.getElementById('scrollTop');

// Show/hide scroll to top button
window.addEventListener('scroll', () => {
    if (window.pageYOffset > 500) {
        scrollTopBtn.classList.add('visible');
    } else {
        scrollTopBtn.classList.remove('visible');
    }
});

// Smooth scroll to top when clicked
scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});