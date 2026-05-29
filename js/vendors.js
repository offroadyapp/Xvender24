// Vendor Page Animations
gsap.registerPlugin(ScrollTrigger);

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
    initVendorAnimations();
});

function initVendorAnimations() {
    // Screen 1: Shock - Machine + Analytics + City Nodes
    initScreen1Animation();
    
    // Screen 2: Simplicity - 3-Step Workflow
    initScreen2Animation();
    
    // Screen 3: Credibility - Temperature Zones
    initScreen3Animation();
    
    // Screen 4: Trust - Payment Flow
    initScreen4Animation();
    
    // Screen 5: Power - Features Grid
    initScreen5Animation();
    
    // Screen 6: Conversion - CTA
    initScreen6Animation();
}

// Screen 1: Shock Animation
function initScreen1Animation() {
    const screen = document.querySelector('.screen-1');
    
    // Analytics panel float in
    gsap.fromTo('#analytics-panel',
        { opacity: 0, y: -30 },
        {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: screen,
                start: 'top 60%',
                toggleActions: 'play none none reverse'
            }
        }
    );
    
    // Chart bars animate
    gsap.from('#chart-bars rect', {
        scaleY: 0,
        transformOrigin: 'bottom',
        duration: 0.6,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: {
            trigger: screen,
            start: 'top 50%',
            toggleActions: 'play none none reverse'
        }
    });
    
    // City nodes fade in with connecting lines
    gsap.fromTo('#city-nodes',
        { opacity: 0 },
        {
            opacity: 1,
            duration: 1.2,
            ease: 'power2.inOut',
            scrollTrigger: {
                trigger: screen,
                start: 'top 50%',
                toggleActions: 'play none none reverse'
            }
        }
    );
    
    // City nodes pulse animation
    gsap.to('#city-nodes circle', {
        scale: 1.3,
        opacity: 0.8,
        duration: 2,
        stagger: 0.3,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        transformOrigin: 'center'
    });
    
    // Machine shelf grid subtle animation
    gsap.to('#shelf-grid rect', {
        opacity: 0.8,
        duration: 1.5,
        stagger: 0.15,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
    });
}

// Screen 2: Simplicity - 3-Step Animation
function initScreen2Animation() {
    const screen = document.querySelector('.screen-2');
    
    const timeline = gsap.timeline({
        scrollTrigger: {
            trigger: screen,
            start: 'top 60%',
            toggleActions: 'play none none reverse'
        }
    });
    
    // Step 1: Vendor appears
    timeline.fromTo('#step-vendor',
        { opacity: 0, x: -50 },
        { opacity: 1, x: 0, duration: 0.6, ease: 'power2.out' }
    );
    
    // Arrow 1 draws
    timeline.fromTo('#arrow-1',
        { opacity: 0 },
        { opacity: 1, duration: 0.4, ease: 'power1.inOut' },
        '+=0.2'
    );
    
    // Step 2: Load shelf appears
    timeline.fromTo('#step-load',
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.2)' },
        '+=0.1'
    );
    
    // Products load in
    timeline.from('#products rect', {
        opacity: 0,
        y: -20,
        stagger: 0.15,
        duration: 0.4,
        ease: 'power2.out'
    }, '-=0.3');
    
    // Arrow 2 draws
    timeline.fromTo('#arrow-2',
        { opacity: 0 },
        { opacity: 1, duration: 0.4, ease: 'power1.inOut' },
        '+=0.3'
    );
    
    // Step 3: Machine sells appears
    timeline.fromTo('#step-sell',
        { opacity: 0, x: 50 },
        { opacity: 1, x: 0, duration: 0.6, ease: 'power2.out' }
    );
    
    // Dollar sign pulse
    timeline.to('#step-sell circle', {
        scale: 1.2,
        opacity: 0.4,
        duration: 0.8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
    }, '-=0.3');
}

// Screen 3: Credibility - Temperature Zones
function initScreen3Animation() {
    const screen = document.querySelector('.screen-3');
    const zones = document.querySelectorAll('.temp-zone');
    
    // Sequential zone highlight
    const timeline = gsap.timeline({
        scrollTrigger: {
            trigger: screen,
            start: 'top 60%',
            toggleActions: 'play none none reverse'
        }
    });
    
    zones.forEach((zone, index) => {
        timeline.fromTo(zone.querySelector('rect'),
            { opacity: 0.3 },
            {
                opacity: 0.7,
                duration: 0.6,
                ease: 'power2.inOut'
            },
            index * 0.3
        );
        
        timeline.fromTo(zone.querySelectorAll('text'),
            { opacity: 0, y: 10 },
            {
                opacity: 1,
                y: 0,
                duration: 0.4,
                ease: 'power2.out'
            },
            index * 0.3 + 0.2
        );
    });
    
    // Add hover effects
    zones.forEach(zone => {
        zone.addEventListener('mouseenter', () => {
            gsap.to(zone.querySelector('rect'), {
                opacity: 0.9,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
        
        zone.addEventListener('mouseleave', () => {
            gsap.to(zone.querySelector('rect'), {
                opacity: 0.7,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
    });
}

// Screen 4: Trust - Payment Flow
function initScreen4Animation() {
    const screen = document.querySelector('.screen-4');
    
    const timeline = gsap.timeline({
        scrollTrigger: {
            trigger: screen,
            start: 'top 60%',
            toggleActions: 'play none none reverse'
        }
    });
    
    // Customer and machine already visible
    
    // Payment arrow animates
    timeline.fromTo('#payment-arrow',
        { opacity: 0 },
        { opacity: 1, duration: 0.6, ease: 'power2.inOut' },
        '+=0.5'
    );
    
    // Animate dash array (moving payment)
    timeline.to('#payment-arrow path', {
        strokeDashoffset: -20,
        duration: 1.5,
        repeat: -1,
        ease: 'linear'
    }, '-=0.6');
    
    // Data arrow appears
    timeline.fromTo('#data-arrow',
        { opacity: 0 },
        { opacity: 1, duration: 0.6, ease: 'power2.inOut' },
        '+=0.4'
    );
    
    // Dashboard stats appear
    timeline.fromTo('#stats',
        { opacity: 0 },
        { opacity: 1, duration: 0.8, ease: 'power2.out' },
        '+=0.3'
    );
    
    // Stats count up effect
    timeline.from('#stats text', {
        opacity: 0,
        x: -10,
        stagger: 0.15,
        duration: 0.4,
        ease: 'power2.out'
    }, '-=0.6');
    
    // Dashboard glow effect
    timeline.to('#vendor-dashboard rect', {
        filter: 'drop-shadow(0 0 10px rgba(0, 212, 255, 0.3))',
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
    }, '-=0.5');
}

// Screen 5: Power - Features Grid
function initScreen5Animation() {
    const screen = document.querySelector('.screen-5');
    const cards = screen.querySelectorAll('.feature-card');
    
    // Stagger cards in
    gsap.fromTo(cards,
        { opacity: 0, y: 40 },
        {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: screen,
                start: 'top 60%',
                toggleActions: 'play none none reverse'
            }
        }
    );
    
    // Animate feature icons on card hover
    cards.forEach(card => {
        const icon = card.querySelector('.feature-icon svg');
        
        card.addEventListener('mouseenter', () => {
            gsap.to(icon, {
                scale: 1.1,
                rotation: 5,
                duration: 0.4,
                ease: 'back.out(2)'
            });
        });
        
        card.addEventListener('mouseleave', () => {
            gsap.to(icon, {
                scale: 1,
                rotation: 0,
                duration: 0.4,
                ease: 'power2.out'
            });
        });
    });
}

// Screen 6: Conversion - CTA
function initScreen6Animation() {
    const screen = document.querySelector('.screen-6');
    
    const timeline = gsap.timeline({
        scrollTrigger: {
            trigger: screen,
            start: 'top 70%',
            toggleActions: 'play none none reverse'
        }
    });
    
    // Title fades in
    timeline.fromTo('.cta-title',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
    );
    
    // Subtitle fades in
    timeline.fromTo('.cta-subtitle',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
        '-=0.4'
    );
    
    // Buttons appear
    timeline.fromTo('.cta-buttons .btn',
        { opacity: 0, y: 20 },
        {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.2,
            ease: 'power2.out'
        },
        '-=0.3'
    );
    
    // Button hover effects
    const buttons = document.querySelectorAll('.cta-buttons .btn');
    buttons.forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            gsap.to(btn, {
                scale: 1.05,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
        
        btn.addEventListener('mouseleave', () => {
            gsap.to(btn, {
                scale: 1,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
    });
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
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

// Update ScrollTrigger on window resize
window.addEventListener('resize', () => {
    ScrollTrigger.refresh();
});
