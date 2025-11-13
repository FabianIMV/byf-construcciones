// Initialize AOS
AOS.init({
    duration: 800,
    easing: 'ease-in-out',
    once: true,
    mirror: false
});

// Mobile Navigation
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}));

// Testimonial Slider
const slides = document.querySelectorAll('.testimonial-slide');
const dots = document.querySelectorAll('.dot');
const prev = document.querySelector('.testimonial-prev');
const next = document.querySelector('.testimonial-next');
let currentSlide = 0;

function showSlide(n) {
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));

    currentSlide = (n + slides.length) % slides.length;

    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
}

prev.addEventListener('click', () => {
    showSlide(currentSlide - 1);
});

next.addEventListener('click', () => {
    showSlide(currentSlide + 1);
});

dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        showSlide(index);
    });
});

// Auto slide testimonials
setInterval(() => {
    showSlide(currentSlide + 1);
}, 5000);

// Project Filters
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
            if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });
});

// Before After Slider
const comparisons = document.querySelectorAll('.comparison');

comparisons.forEach(comparison => {
    const slider = comparison.querySelector('.slider');
    const afterImage = comparison.querySelector('.after-image');

    let isDown = false;

    // Set initial position
    slider.style.left = '50%';
    afterImage.style.width = '50%';

    // Mouse events
    slider.addEventListener('mousedown', () => {
        isDown = true;
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
    slider.addEventListener('touchstart', () => {
        isDown = true;
    });

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
    });
});

// Back to Top Button
const backToTopButton = document.querySelector('.back-to-top');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        backToTopButton.classList.add('active');
    } else {
        backToTopButton.classList.remove('active');
    }
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        const target = document.querySelector(this.getAttribute('href'));

        if (target) {
            window.scrollTo({
                top: target.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Form submission
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        // Here you would add code to handle the form submission
        // For example, sending the data to a server or email

        // For now, just show an alert
        alert('¡Gracias por contactarnos! Le responderemos a la brevedad.');
        this.reset();
    });
}
