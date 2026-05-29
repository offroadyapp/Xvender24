// ===================================
// PARTNERS PAGE - MINIMAL ANIMATIONS
// Subtle fade-up on scroll with staggered delays
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

// ===== STAGGERED OBSERVER FOR GRID/FLOW ITEMS =====
const staggerObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Get all items in the same container
            const container = entry.target.closest('.grid-2x2, .flow-diagram, .minimal-text-block, .structure-list');
            if (container) {
                const items = container.querySelectorAll('.fade-up[data-delay]');
                items.forEach((item, index) => {
                    setTimeout(() => {
                        item.classList.add('visible');
                    }, index * 150);
                });
                // Unobserve all items in this container
                items.forEach(item => staggerObserver.unobserve(item));
            } else {
                // Single item without container
                entry.target.classList.add('visible');
                staggerObserver.unobserve(entry.target);
            }
        }
    });
}, observerOptions);

// ===== INIT ON LOAD =====
document.addEventListener('DOMContentLoaded', () => {
    // Observe fade-up elements without data-delay
    const fadeUpElements = document.querySelectorAll('.fade-up:not([data-delay])');
    fadeUpElements.forEach(el => {
        fadeObserver.observe(el);
    });
    
    // Observe fade-up elements with data-delay (staggered)
    const staggeredElements = document.querySelectorAll('.fade-up[data-delay]');
    staggeredElements.forEach(el => {
        staggerObserver.observe(el);
    });
    
    console.log('Partners page loaded - Tesla minimal style');
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
    document.querySelectorAll('.fade-in-seq, .fade-up').forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'none';
        el.style.animation = 'none';
        el.style.transition = 'none';
    });
    
    console.log('Reduced motion detected - animations disabled');
}
