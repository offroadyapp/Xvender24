// ===================================
// INVESTORS PAGE - REVEAL ANIMATIONS
// Subtle fade-up on scroll
// ===================================

const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
};

const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            fadeObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.fade-up, .fade-up-slow').forEach(el => {
        fadeObserver.observe(el);
    });
});

// ===== REDUCED MOTION SUPPORT =====
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.fade-in-seq, .fade-up, .fade-up-slow').forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'none';
        el.style.animation = 'none';
        el.style.transition = 'none';
    });
}
