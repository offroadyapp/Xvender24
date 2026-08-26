// ===================================
// XVENDER24 - SCROLL ANIMATION SCRIPT
// Style: Tesla Minimal + Infrastructure
// ===================================

// ===== GLOBAL SETTINGS =====
const ANIMATION_CONFIG = {
    threshold: 0.3,
    transitionSpeed: 600,
    nodeGlowDuration: 2500,
    costDissolveDuration: 3000
};

// ===== INTERSECTION OBSERVER =====
const observerOptions = {
    threshold: ANIMATION_CONFIG.threshold,
    rootMargin: '0px'
};

const animationObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            
            // Trigger specific screen animations
            const screenId = entry.target.id;
            if (screenId === 'screen-4') {
                expandNetworkNodes();
            }
        }
    });
}, observerOptions);

// ===== OBSERVE ALL ANIMATED ELEMENTS =====
function initAnimations() {
    // Observe all fade-in elements
    const fadeElements = document.querySelectorAll('.fade-in-up, .fade-in-scale, .fade-in-seq');
    fadeElements.forEach(el => {
        animationObserver.observe(el);
    });
    
    // Observe screens for specific animations
    const screens = document.querySelectorAll('.screen');
    screens.forEach(screen => {
        animationObserver.observe(screen);
    });
    
    // Stagger groups (modules grid, AI list)
    initStaggerGroups();
}

// ===== SCREEN 1: CITY GRID WITH NODES =====
function initCityCanvas() {
    const canvas = document.getElementById('cityCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const nodes = [];
    const gridSpacing = 80;
    const glowColor = 'rgba(0, 212, 255, 0.6)';
    
    // Create grid
    function drawGrid() {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.lineWidth = 1;
        
        // Vertical lines
        for (let x = 0; x < canvas.width; x += gridSpacing) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
            ctx.stroke();
        }
        
        // Horizontal lines
        for (let y = 0; y < canvas.height; y += gridSpacing) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
        }
    }
    
    // Create retail nodes
    class RetailNode {
        constructor(x, y, delay) {
            this.x = x;
            this.y = y;
            this.radius = 0;
            this.maxRadius = 8;
            this.delay = delay;
            this.startTime = Date.now() + delay;
            this.glowing = false;
        }
        
        update() {
            if (Date.now() < this.startTime) return;
            
            if (this.radius < this.maxRadius) {
                this.radius += 0.2;
                this.glowing = true;
            }
        }
        
        draw() {
            if (this.radius <= 0) return;
            
            // Outer glow
            const gradient = ctx.createRadialGradient(
                this.x, this.y, 0,
                this.x, this.y, this.radius * 3
            );
            gradient.addColorStop(0, glowColor);
            gradient.addColorStop(1, 'transparent');
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius * 3, 0, Math.PI * 2);
            ctx.fill();
            
            // Core node
            ctx.fillStyle = '#00d4ff';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    // Add 5 strategic nodes
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    nodes.push(new RetailNode(centerX, centerY, 1500)); // First node
    nodes.push(new RetailNode(centerX - 200, centerY - 150, 2500));
    nodes.push(new RetailNode(centerX + 180, centerY - 120, 2500));
    nodes.push(new RetailNode(centerX - 150, centerY + 180, 2500));
    nodes.push(new RetailNode(centerX + 220, centerY + 160, 2500));
    
    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw grid
        drawGrid();
        
        // Update and draw nodes
        nodes.forEach(node => {
            node.update();
            node.draw();
        });
        
        requestAnimationFrame(animate);
    }
    
    animate();
    
    // Resize handler
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// ===== SCREEN 2/3: STAGGERED REVEAL GROUPS =====
function initStaggerGroups() {
    const groups = document.querySelectorAll('.modules-grid, .ai-list');
    if (groups.length === 0) return;

    const staggerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const items = entry.target.querySelectorAll('.fade-in-seq');
                items.forEach((item, index) => {
                    setTimeout(() => {
                        item.classList.add('visible');
                    }, index * 120);
                });
                staggerObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    groups.forEach(group => staggerObserver.observe(group));
}

// ===== SCREEN 4: NETWORK EXPANSION =====
function initNetworkCanvas() {
    const canvas = document.getElementById('networkCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const nodes = [];
    const connections = [];
    const nodeCount = 12;
    let isExpanded = false;
    
    class NetworkNode {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.targetX = x;
            this.targetY = y;
            this.radius = 6;
            this.alpha = 0;
        }
        
        expand(targetX, targetY) {
            this.targetX = targetX;
            this.targetY = targetY;
        }
        
        update() {
            // Smooth interpolation
            this.x += (this.targetX - this.x) * 0.05;
            this.y += (this.targetY - this.y) * 0.05;
            
            if (this.alpha < 1) {
                this.alpha += 0.02;
            }
        }
        
        draw() {
            ctx.globalAlpha = this.alpha;
            
            // Glow
            const gradient = ctx.createRadialGradient(
                this.x, this.y, 0,
                this.x, this.y, this.radius * 2
            );
            gradient.addColorStop(0, 'rgba(0, 212, 255, 0.6)');
            gradient.addColorStop(1, 'transparent');
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius * 2, 0, Math.PI * 2);
            ctx.fill();
            
            // Core
            ctx.fillStyle = '#00d4ff';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.globalAlpha = 1;
        }
    }
    
    // Initialize nodes at center
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    for (let i = 0; i < nodeCount; i++) {
        nodes.push(new NetworkNode(centerX, centerY));
    }
    
    // Draw connections
    function drawConnections() {
        ctx.strokeStyle = 'rgba(0, 212, 255, 0.2)';
        ctx.lineWidth = 1;
        
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const distance = Math.hypot(
                    nodes[j].x - nodes[i].x,
                    nodes[j].y - nodes[i].y
                );
                
                if (distance < 300) {
                    ctx.globalAlpha = nodes[i].alpha * nodes[j].alpha * (1 - distance / 300);
                    ctx.beginPath();
                    ctx.moveTo(nodes[i].x, nodes[i].y);
                    ctx.lineTo(nodes[j].x, nodes[j].y);
                    ctx.stroke();
                }
            }
        }
        
        ctx.globalAlpha = 1;
    }
    
    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        drawConnections();
        
        nodes.forEach(node => {
            node.update();
            node.draw();
        });
        
        requestAnimationFrame(animate);
    }
    
    animate();
    
    // Resize handler
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
    
    // Return expand function
    return {
        expand: () => {
            if (isExpanded) return;
            isExpanded = true;
            
            // Expand to grid pattern
            const cols = 4;
            const rows = 3;
            const spacingX = canvas.width / (cols + 1);
            const spacingY = canvas.height / (rows + 1);
            
            let index = 0;
            for (let row = 1; row <= rows; row++) {
                for (let col = 1; col <= cols; col++) {
                    if (index < nodes.length) {
                        nodes[index].expand(
                            col * spacingX,
                            row * spacingY
                        );
                        index++;
                    }
                }
            }
        }
    };
}

let networkController;

function expandNetworkNodes() {
    if (networkController) {
        networkController.expand();
    }
}

// ===== INIT ON LOAD =====
document.addEventListener('DOMContentLoaded', () => {
    initAnimations();
    initCityCanvas();
    networkController = initNetworkCanvas();
    
    console.log('Xvender24 Website Loaded - Tesla Minimal Style');
});

// ===== SMOOTH SCROLL =====
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
