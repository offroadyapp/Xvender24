// ===================================
// ABOUT PAGE - SCROLL ANIMATIONS
// Calm. Structural. Confident.
// ===================================

// ===== INTERSECTION OBSERVER FOR SCROLL REVEALS =====
const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -80px 0px'
};

const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Add visible class to trigger animation
            entry.target.classList.add('visible');
            
            // Optionally unobserve after reveal (one-time animation)
            scrollObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

// ===== HERO SECTION AUTO-REVEAL =====
// Hero animations trigger on page load (not scroll)
function revealHero() {
    const heroElements = document.querySelectorAll('.section-hero .fade-reveal');
    
    // Trigger hero animations immediately
    setTimeout(() => {
        heroElements.forEach(el => {
            el.classList.add('visible');
        });
    }, 100);
}

// ===== INIT ON LOAD =====
document.addEventListener('DOMContentLoaded', () => {
    // Reveal hero section immediately
    revealHero();
    
    // Observe all scroll-reveal elements (sections 2-5)
    const scrollRevealElements = document.querySelectorAll('.scroll-reveal, .scale-reveal');
    scrollRevealElements.forEach(el => {
        scrollObserver.observe(el);
    });
    
    // Special handling for operators image
    const operatorsImage = document.querySelector('.operators-image');
    if (operatorsImage) {
        scrollObserver.observe(operatorsImage);
    }
    
    console.log('About page loaded - Tesla minimal style');
});

// ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
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

// ===== NAVIGATION BACKGROUND FADE ON SCROLL =====
let lastScrollTop = 0;
const nav = document.querySelector('.about-nav');

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Add/remove background opacity based on scroll
    if (scrollTop > 100) {
        nav.style.background = 'rgba(17, 17, 17, 0.98)';
    } else {
        nav.style.background = 'rgba(17, 17, 17, 0.95)';
    }
    
    lastScrollTop = scrollTop;
}, { passive: true });

// ===== REDUCED MOTION SUPPORT =====
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    // Disable animations
    document.querySelectorAll('.fade-reveal, .scroll-reveal, .scale-reveal').forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'none';
        el.style.animation = 'none';
        el.style.transition = 'none';
    });
    
    console.log('Reduced motion detected - animations disabled');
}

// ===== STAGGER ANIMATION HELPER =====
// For grouped elements (like problem list items)
function observeGroupedElements(selector, container) {
    const elements = document.querySelectorAll(selector);
    
    if (elements.length === 0) return;
    
    const groupObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Trigger all items in the group with their delays
                const items = entry.target.querySelectorAll('[data-delay]');
                items.forEach((item, index) => {
                    setTimeout(() => {
                        item.classList.add('visible');
                    }, parseInt(item.dataset.delay) || index * 150);
                });
                
                groupObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    elements.forEach(el => groupObserver.observe(el));
}

// Observe problem list as a group
document.addEventListener('DOMContentLoaded', () => {
    observeGroupedElements('.problem-list', '.section-problem');
});
