// ===================================
// INVESTORS PAGE - MINIMAL ANIMATIONS
// Subtle fade-up on scroll
// ===================================

// ===== INTERSECTION OBSERVER FOR FADE-UP =====
const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
};

const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // Optionally unobserve after animation
            fadeObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

// ===== INIT ON LOAD =====
document.addEventListener('DOMContentLoaded', () => {
    // Observe all fade-up elements
    const fadeUpElements = document.querySelectorAll('.fade-up, .fade-up-slow');
    fadeUpElements.forEach(el => {
        fadeObserver.observe(el);
    });
    
    console.log('Investors page loaded - Tesla minimal style');
});

// ===== SMOOTH SCROLL FOR ANCHORS =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===== REDUCED MOTION SUPPORT =====
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    // Disable animations
    document.querySelectorAll('.fade-in-seq, .fade-up, .fade-up-slow').forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'none';
        el.style.animation = 'none';
        el.style.transition = 'none';
    });
    
    console.log('Reduced motion detected - animations disabled');
}
