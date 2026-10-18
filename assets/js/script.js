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
    // Si AOS no cargó (CDN bloqueado), mostrar todo en vez de dejarlo invisible
    document.querySelectorAll('[data-aos]').forEach(el => el.classList.add('aos-animate'));
}

// Recalcula las posiciones de AOS cuando cambia el alto de la página
// (galería que oculta/muestra tarjetas, fotos que terminan de cargar)
let aosRefreshTimer;
function refreshAOS() {
    if (typeof AOS === 'undefined') return;
    clearTimeout(aosRefreshTimer);
    aosRefreshTimer = setTimeout(() => AOS.refresh(), 100);
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
        const isOpen = navMenu.classList.contains('active');
        hamburger.setAttribute('aria-expanded', String(isOpen));
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        });
    });
}

// ========================================
// PROJECT FILTERS
// ========================================
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');
const projectsMoreBtn = document.getElementById('projects-more');
const INITIAL_PROJECTS = 9;

let activeFilter = 'all';
let projectsExpanded = false;

// Muestra las tarjetas del filtro activo: las primeras 9, o todas si se pidió "Ver más trabajos"
function applyProjectsView() {
    let shown = 0;
    let matching = 0;

    projectCards.forEach(card => {
        const matches = activeFilter === 'all' || card.getAttribute('data-category') === activeFilter;
        let visible = false;

        if (matches) {
            matching++;
            visible = projectsExpanded || matching <= INITIAL_PROJECTS;
        }

        if (visible) {
            shown++;
            if (card.style.display === 'none') {
                card.style.animation = 'fadeIn 0.5s ease';
                // Evita que AOS deje la tarjeta invisible si estaba oculta al iniciar
                card.classList.add('aos-animate');
            }
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
            card.style.animation = '';
        }
    });

    if (projectsMoreBtn) {
        projectsMoreBtn.hidden = projectsExpanded || matching <= INITIAL_PROJECTS;
    }

    refreshAOS();
    return shown;
}

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all buttons
        filterBtns.forEach(b => b.classList.remove('active'));
        // Add active class to clicked button
        btn.classList.add('active');

        activeFilter = btn.getAttribute('data-filter');
        projectsExpanded = false;
        applyProjectsView();

        // Track filter clicks
        if (typeof gtag !== 'undefined') {
            gtag('event', 'filter_click', {
                'event_category': 'Projects',
                'event_label': activeFilter
            });
        }
    });
});

if (projectsMoreBtn) {
    projectsMoreBtn.addEventListener('click', () => {
        const firstHidden = Array.from(projectCards).find(card => card.style.display === 'none'
            && (activeFilter === 'all' || card.getAttribute('data-category') === activeFilter));
        projectsExpanded = true;
        applyProjectsView();

        // El botón desaparece: el foco pasa a la primera foto nueva
        const zoom = firstHidden && firstHidden.querySelector('.project-zoom');
        if (zoom) zoom.focus({ preventScroll: true });
    });
}

// Estado inicial: solo las primeras 9 tarjetas
applyProjectsView();

// ========================================
// LIGHTBOX
// ========================================
const lightbox = document.createElement('div');
lightbox.className = 'lightbox';
lightbox.setAttribute('role', 'dialog');
lightbox.setAttribute('aria-modal', 'true');
lightbox.setAttribute('aria-label', 'Galería de fotos ampliada');
lightbox.setAttribute('aria-hidden', 'true');
lightbox.innerHTML = `
    <button type="button" class="lightbox-close" aria-label="Cerrar">&times;</button>
    <button type="button" class="lightbox-nav lightbox-prev" aria-label="Foto anterior"><i class="fas fa-chevron-left" aria-hidden="true"></i></button>
    <figure class="lightbox-figure">
        <img class="lightbox-img" src="" alt="">
        <figcaption class="lightbox-caption">
            <span class="lightbox-title"></span>
            <span class="lightbox-counter" aria-live="polite"></span>
        </figcaption>
    </figure>
    <button type="button" class="lightbox-nav lightbox-next" aria-label="Foto siguiente"><i class="fas fa-chevron-right" aria-hidden="true"></i></button>
`;
document.body.appendChild(lightbox);

const lightboxImg = lightbox.querySelector('.lightbox-img');
const lightboxTitle = lightbox.querySelector('.lightbox-title');
const lightboxCounter = lightbox.querySelector('.lightbox-counter');
const lightboxClose = lightbox.querySelector('.lightbox-close');
const lightboxPrev = lightbox.querySelector('.lightbox-prev');
const lightboxNext = lightbox.querySelector('.lightbox-next');

let lightboxItems = [];
let lightboxIndex = 0;
let lightboxTrigger = null;
let lightboxPreviousOverflow = '';

function getVisibleProjectCards() {
    return Array.from(projectCards).filter(card => card.style.display !== 'none');
}

function renderLightbox() {
    const card = lightboxItems[lightboxIndex];
    if (!card) return;

    const img = card.querySelector('.project-image img');
    const zoomLink = card.querySelector('.project-zoom');
    const titleEl = card.querySelector('.project-title');

    lightboxImg.src = zoomLink ? zoomLink.getAttribute('href') : img.src;
    lightboxImg.alt = img ? img.alt : '';
    lightboxTitle.textContent = titleEl ? titleEl.textContent : '';
    lightboxCounter.textContent = `${lightboxIndex + 1} / ${lightboxItems.length}`;

    const single = lightboxItems.length < 2;
    lightboxPrev.hidden = single;
    lightboxNext.hidden = single;
}

function openLightbox(card, trigger) {
    lightboxItems = getVisibleProjectCards();
    lightboxIndex = Math.max(0, lightboxItems.indexOf(card));
    lightboxTrigger = trigger || null;
    renderLightbox();

    lightboxPreviousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    lightbox.classList.add('active');
    lightbox.setAttribute('aria-hidden', 'false');
    lightboxClose.focus();
}

function closeLightbox() {
    if (!lightbox.classList.contains('active')) return;

    lightbox.classList.remove('active');
    lightbox.setAttribute('aria-hidden', 'true');
    lightboxImg.src = '';
    document.body.style.overflow = lightboxPreviousOverflow;

    if (lightboxTrigger && typeof lightboxTrigger.focus === 'function') {
        lightboxTrigger.focus();
    }
    lightboxTrigger = null;
}

function stepLightbox(step) {
    if (lightboxItems.length < 2) return;
    lightboxIndex = (lightboxIndex + step + lightboxItems.length) % lightboxItems.length;
    renderLightbox();
}

projectCards.forEach(card => {
    const zoomLink = card.querySelector('.project-zoom');
    const cardImage = card.querySelector('.project-image');

    if (zoomLink) {
        zoomLink.addEventListener('click', (e) => {
            e.preventDefault();
            openLightbox(card, zoomLink);
        });
    }

    if (cardImage) {
        cardImage.style.cursor = 'zoom-in';
        cardImage.addEventListener('click', (e) => {
            // Los enlaces (WhatsApp y lupa) tienen su propio comportamiento
            if (e.target.closest('a')) return;
            openLightbox(card, zoomLink || cardImage);
        });
    }
});

lightboxClose.addEventListener('click', closeLightbox);
lightboxPrev.addEventListener('click', () => stepLightbox(-1));
lightboxNext.addEventListener('click', () => stepLightbox(1));

// Clic en el fondo cierra el lightbox
lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
        closeLightbox();
    }
});

document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;

    if (e.key === 'Escape') {
        closeLightbox();
    } else if (e.key === 'ArrowLeft') {
        stepLightbox(-1);
    } else if (e.key === 'ArrowRight') {
        stepLightbox(1);
    } else if (e.key === 'Tab') {
        // Mantener el foco dentro del modal
        const focusable = Array.from(lightbox.querySelectorAll('button:not([hidden])'));
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
        }
    }
});

// Swipe táctil básico
let touchStartX = 0;
let touchStartY = 0;

lightbox.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].clientX;
    touchStartY = e.changedTouches[0].clientY;
}, { passive: true });

lightbox.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    const dy = e.changedTouches[0].clientY - touchStartY;

    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
        stepLightbox(dx < 0 ? 1 : -1);
    }
}, { passive: true });

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
    // La capa "Después" ocupa todo el ancho y se recorta desde la izquierda,
    // así la mitad izquierda muestra "Antes" y la derecha "Después"
    function setPosition(percent) {
        slider.style.left = `${percent}%`;
        afterImage.style.clipPath = `inset(0 0 0 ${percent}%)`;
    }

    setPosition(50);

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

        setPosition(percent);
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

        setPosition(percent);

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

            // "Saltar al contenido" también mueve el foco al destino
            if (this.classList.contains('skip-link')) {
                target.focus({ preventScroll: true });
            }
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
// WHATSAPP: MENSAJE CON EL TITULO DEL PROYECTO
// ========================================
document.querySelectorAll('.project-card').forEach(card => {
    const title = card.querySelector('.project-title');
    const link = card.querySelector('a[href*="wa.me"]');
    if (title && link) {
        const text = "Hola, vi el trabajo '" + title.textContent.trim() + "' y quisiera cotizar algo similar";
        link.href = 'https://wa.me/56979873473?text=' + encodeURIComponent(text);
    }
});

// ========================================
// WHATSAPP CLICK TRACKING
// ========================================
document.querySelectorAll('a[href*="whatsapp"], a[href*="wa.me"]').forEach(link => {
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

    refreshAOS();

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
// AÑO DINÁMICO (COPYRIGHT)
// ========================================
const yearEl = document.getElementById('year');
if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
}

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
