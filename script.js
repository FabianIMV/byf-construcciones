// ========================================
// BYFF CONSTRUCCIONES - Main JavaScript
// ========================================

'use strict';

// Initialize AOS with error handling
try {
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        mirror: false,
        offset: 100
    });
} catch (error) {
    console.warn('AOS initialization failed:', error);
}

// ========================================
// HEADER SCROLL EFFECT
// ========================================
const header = document.querySelector('header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// ========================================
// MOBILE NAVIGATION
// ========================================
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}

// ========================================
// TESTIMONIAL SLIDER
// ========================================
const slides = document.querySelectorAll('.testimonial-slide');
const dots = document.querySelectorAll('.dot');
const prev = document.querySelector('.testimonial-prev');
const next = document.querySelector('.testimonial-next');
let currentSlide = 0;
let testimonialInterval;

function showSlide(n) {
    if (slides.length === 0) return;
    
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));

    currentSlide = (n + slides.length) % slides.length;

    slides[currentSlide].classList.add('active');
    if (dots[currentSlide]) {
        dots[currentSlide].classList.add('active');
    }
}

function startTestimonialSlider() {
    testimonialInterval = setInterval(() => {
        showSlide(currentSlide + 1);
    }, 5000);
}

function stopTestimonialSlider() {
    clearInterval(testimonialInterval);
}

if (prev && next) {
    prev.addEventListener('click', () => {
        stopTestimonialSlider();
        showSlide(currentSlide - 1);
        startTestimonialSlider();
    });

    next.addEventListener('click', () => {
        stopTestimonialSlider();
        showSlide(currentSlide + 1);
        startTestimonialSlider();
    });
}

dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        stopTestimonialSlider();
        showSlide(index);
        startTestimonialSlider();
    });
});

// Start auto-slide
if (slides.length > 0) {
    startTestimonialSlider();
}

// ========================================
// PROJECT FILTERS
// ========================================
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all buttons
        filterBtns.forEach(b => b.classList.remove('active'));
        // Add active class to clicked button
        btn.classList.add('active');

        const filterValue = btn.getAttribute('data-filter');

        projectCards.forEach(card => {
            const category = card.getAttribute('data-category');
            
            if (filterValue === 'all' || category === filterValue) {
                card.style.display = 'block';
                card.style.animation = 'fadeIn 0.5s ease';
            } else {
                card.style.display = 'none';
            }
        });
        
        // Track filter clicks
        if (typeof gtag !== 'undefined') {
            gtag('event', 'filter_click', {
                'event_category': 'Projects',
                'event_label': filterValue
            });
        }
    });
});

// ========================================
// BEFORE AFTER SLIDER
// ========================================
const comparisons = document.querySelectorAll('.comparison');

comparisons.forEach(comparison => {
    const slider = comparison.querySelector('.slider');
    const afterImage = comparison.querySelector('.after-image');

    if (!slider || !afterImage) return;

    let isDown = false;

    // Set initial position
    slider.style.left = '50%';
    afterImage.style.width = '50%';

    // Mouse events
    slider.addEventListener('mousedown', (e) => {
        isDown = true;
        e.preventDefault();
    });

    window.addEventListener('mouseup', () => {
        isDown = false;
    });

    comparison.addEventListener('mousemove', (e) => {
        if (!isDown) return;

        const rect = comparison.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const percent = Math.max(0, Math.min(100, x / rect.width * 100));

        slider.style.left = `${percent}%`;
        afterImage.style.width = `${percent}%`;
    });

    // Touch events
    slider.addEventListener('touchstart', (e) => {
        isDown = true;
        e.preventDefault();
    }, { passive: false });

    window.addEventListener('touchend', () => {
        isDown = false;
    });

    comparison.addEventListener('touchmove', (e) => {
        if (!isDown) return;

        const rect = comparison.getBoundingClientRect();
        const x = e.touches[0].clientX - rect.left;
        const percent = Math.max(0, Math.min(100, x / rect.width * 100));

        slider.style.left = `${percent}%`;
        afterImage.style.width = `${percent}%`;

        e.preventDefault();
    }, { passive: false });
});

// ========================================
// BACK TO TOP BUTTON
// ========================================
const backToTopButton = document.querySelector('.back-to-top');

if (backToTopButton) {
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopButton.classList.add('active');
        } else {
            backToTopButton.classList.remove('active');
        }
    });
}

// ========================================
// SMOOTH SCROLLING
// ========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        
        if (href === '#') {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        const target = document.querySelector(href);

        if (target) {
            e.preventDefault();
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ========================================
// FORM VALIDATION & SUBMISSION
// ========================================
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        // Simple validation
        const formData = new FormData(this);
        let isValid = true;

        formData.forEach((value, key) => {
            if (!value.trim()) {
                isValid = false;
            }
        });

        if (!isValid) {
            alert('Por favor, completa todos los campos.');
            return;
        }

        // Track form submission
        if (typeof gtag !== 'undefined') {
            gtag('event', 'form_submit', {
                'event_category': 'Contact',
                'event_label': 'Contact Form'
            });
        }

        alert('¡Gracias por contactarnos! Le responderemos a la brevedad.');
        this.reset();
    });
}

// ========================================
// WHATSAPP CLICK TRACKING
// ========================================
document.querySelectorAll('a[href*="whatsapp"]').forEach(link => {
    link.addEventListener('click', () => {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'click', {
                'event_category': 'WhatsApp',
                'event_label': 'WhatsApp Contact'
            });
        }
    });
});

// ========================================
// PAGE LOAD OPTIMIZATION
// ========================================
window.addEventListener('load', () => {
    // Hide loading screen if exists
    const loading = document.querySelector('.loading');
    if (loading) {
        loading.classList.add('hidden');
    }

    // Lazy load images
    const images = document.querySelectorAll('img[loading="lazy"]');
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }
});

// ========================================
// ANIMATION HELPERS
// ========================================
const fadeInAnimation = `
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;

// Inject animation styles
const style = document.createElement('style');
style.textContent = fadeInAnimation;
document.head.appendChild(style);

// ========================================
// ERROR HANDLING
// ========================================
window.addEventListener('error', (e) => {
    console.error('Error caught:', e.error);
    // You can send errors to a logging service here
});

// Console message for developers
console.log('%c🏗️ ByF Construcciones', 'color: #e67e22; font-size: 20px; font-weight: bold;');
console.log('%cWeb desarrollada con ❤️ para conectar con clientes', 'color: #2c3e50; font-size: 12px;');
