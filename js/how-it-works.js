// ===================================
// HOW IT WORKS - MODULAR ANIMATIONS
// Scroll-triggered, hover-pause, click-lock
// ===================================

// ===== GLOBAL ANIMATION CONFIG =====
const ANIM_CONFIG = {
    loopDuration: 8000, // 8 seconds per loop
    fps: 60,
    viewportThreshold: 0.6, // 60% visible to start
    exitThreshold: 0.2, // 20% visible to stop
    colors: {
        primary: '#00d4ff',
        secondary: '#0099cc',
        warning: '#ff6b6b',
        success: '#51cf66',
        grey: '#505050',
        lightGrey: '#808080',
        white: '#ffffff'
    },
    safeArea: { // 8-10% padding
        top: 0.08,
        right: 0.08,
        bottom: 0.08,
        left: 0.08
    }
};

// ===== ANIMATION CONTROLLER CLASS =====
class AnimationController {
    constructor(canvasId, animationFn) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.animationFn = animationFn;
        this.isPlaying = false;
        this.isPaused = false;
        this.isLocked = false;
        this.startTime = 0;
        this.pauseTime = 0;
        this.animFrame = null;
        
        this.setupCanvas();
        this.setupInteractions();
    }
    
    setupCanvas() {
        const parent = this.canvas.parentElement;
        this.canvas.width = parent.clientWidth;
        this.canvas.height = parent.clientHeight;
        
        // Resize handler
        window.addEventListener('resize', () => {
            this.canvas.width = parent.clientWidth;
            this.canvas.height = parent.clientHeight;
        });
    }
    
    setupInteractions() {
        const parent = this.canvas.parentElement;
        const playPauseBtn = parent.querySelector('.play-pause-btn');
        
        // Hover: pause + show tooltips
        parent.addEventListener('mouseenter', () => {
            if (!this.isLocked && this.isPlaying) {
                this.pause();
            }
        });
        
        parent.addEventListener('mouseleave', () => {
            if (!this.isLocked && this.isPaused) {
                this.resume();
            }
        });
        
        // Click: toggle lock-pause
        parent.addEventListener('click', (e) => {
            if (e.target.closest('.play-pause-btn')) return; // Ignore button clicks
            
            this.isLocked = !this.isLocked;
            
            if (this.isLocked) {
                this.pause();
                parent.classList.add('paused');
                parent.querySelector('.playback-control').classList.remove('hidden');
            } else {
                this.resume();
                parent.classList.remove('paused');
                parent.querySelector('.playback-control').classList.add('hidden');
            }
        });
        
        // Resume button
        if (playPauseBtn) {
            playPauseBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.isLocked = false;
                this.resume();
                parent.classList.remove('paused');
                parent.querySelector('.playback-control').classList.add('hidden');
            });
        }
    }
    
    start() {
        if (this.isPlaying) return;
        this.isPlaying = true;
        this.startTime = Date.now();
        this.animate();
    }
    
    stop() {
        this.isPlaying = false;
        this.isPaused = false;
        this.isLocked = false;
        if (this.animFrame) {
            cancelAnimationFrame(this.animFrame);
        }
        // Draw first frame
        this.animationFn(this.ctx, 0, this.canvas.width, this.canvas.height);
    }
    
    pause() {
        if (!this.isPlaying) return;
        this.isPaused = true;
        this.pauseTime = Date.now();
    }
    
    resume() {
        if (!this.isPaused) return;
        this.isPaused = false;
        const pauseDuration = Date.now() - this.pauseTime;
        this.startTime += pauseDuration;
    }
    
    animate() {
        if (!this.isPlaying) return;
        
        if (!this.isPaused) {
            const elapsed = Date.now() - this.startTime;
            const progress = (elapsed % ANIM_CONFIG.loopDuration) / ANIM_CONFIG.loopDuration;
            
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.animationFn(this.ctx, progress, this.canvas.width, this.canvas.height);
        }
        
        this.animFrame = requestAnimationFrame(() => this.animate());
    }
}

// ===== HELPER FUNCTIONS =====
function drawRect(ctx, x, y, w, h, color, alpha = 1) {
    ctx.globalAlpha = alpha;
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
    ctx.globalAlpha = 1;
}

function drawCircle(ctx, x, y, radius, color, alpha = 1) {
    ctx.globalAlpha = alpha;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
}

function drawLine(ctx, x1, y1, x2, y2, color, width = 2, alpha = 1) {
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.globalAlpha = 1;
}

function drawGlow(ctx, x, y, radius, color) {
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
    gradient.addColorStop(0, color);
    gradient.addColorStop(1, 'transparent');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
}

function easeInOut(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

function easeOut(t) {
    return 1 - Math.pow(1 - t, 3);
}

// ===== SCREEN 1: PLUG & PLAY =====
function animatePlugPlay(ctx, progress, w, h) {
    const colors = ANIM_CONFIG.colors;
    const sa = ANIM_CONFIG.safeArea;
    
    // Safe area bounds
    const sx = w * sa.left;
    const sy = h * sa.top;
    const sw = w * (1 - sa.left - sa.right);
    const sh = h * (1 - sa.top - sa.bottom);
    
    // Store shell (fades in 0-0.125)
    const shellAlpha = Math.min(progress / 0.125, 1);
    ctx.strokeStyle = colors.grey;
    ctx.lineWidth = 2;
    ctx.globalAlpha = shellAlpha * 0.3;
    ctx.strokeRect(sx, sy, sw, sh);
    ctx.globalAlpha = 1;
    
    // 4 VM units (fly in 0.125-0.3125)
    const unitPositions = [
        { x: 0.2, y: 0.3 },
        { x: 0.5, y: 0.3 },
        { x: 0.2, y: 0.65 },
        { x: 0.5, y: 0.65 }
    ];
    
    unitPositions.forEach((pos, i) => {
        const startTime = 0.125 + i * 0.05;
        const endTime = startTime + 0.15;
        
        if (progress >= startTime) {
            const t = Math.min((progress - startTime) / (endTime - startTime), 1);
            const easedT = easeOut(t);
            
            const ux = sx + sw * pos.x;
            const uy = sy + sh * pos.y;
            const unitW = sw * 0.15;
            const unitH = sh * 0.25;
            
            // Slide in from sides
            const offsetX = i % 2 === 0 ? -w * 0.3 * (1 - easedT) : w * 0.3 * (1 - easedT);
            
            drawRect(ctx, ux + offsetX, uy, unitW, unitH, colors.lightGrey, easedT);
            
            // Glow after landing
            if (t === 1 && progress > 0.3125) {
                const glowT = (progress - 0.3125) / 0.1;
                const glowAlpha = Math.min(glowT, 1) * 0.6;
                drawGlow(ctx, ux + unitW / 2, uy + unitH / 2, unitW * 0.8, `rgba(0, 212, 255, ${glowAlpha})`);
            }
        }
    });
    
    // Power plug (0.3125-0.4)
    if (progress >= 0.3125) {
        const plugT = Math.min((progress - 0.3125) / 0.0875, 1);
        const plugX = sx + sw * 0.1;
        const plugY = sy + sh * 0.85;
        
        drawCircle(ctx, plugX, plugY, 10, colors.primary, plugT);
        
        if (plugT === 1) {
            drawLine(ctx, plugX, plugY, sx + sw * 0.2, sy + sh * 0.8, colors.primary, 2, 0.6);
        }
    }
    
    // WiFi router (0.4-0.5)
    if (progress >= 0.4) {
        const wifiT = Math.min((progress - 0.4) / 0.1, 1);
        const wifiX = sx + sw * 0.85;
        const wifiY = sy + sh * 0.85;
        
        // Router icon (simplified)
        drawCircle(ctx, wifiX, wifiY, 8, colors.primary, wifiT);
        
        // Connection lines to units
        if (wifiT === 1) {
            unitPositions.forEach(pos => {
                const ux = sx + sw * pos.x + sw * 0.075;
                const uy = sy + sh * pos.y + sh * 0.125;
                drawLine(ctx, wifiX, wifiY, ux, uy, colors.primary, 1, 0.3);
            });
        }
    }
    
    // Breathing glow (0.5-1.0)
    if (progress >= 0.5) {
        const breathe = Math.sin((progress - 0.5) * Math.PI * 4) * 0.3 + 0.7;
        unitPositions.forEach(pos => {
            const ux = sx + sw * pos.x + sw * 0.075;
            const uy = sy + sh * pos.y + sh * 0.125;
            drawGlow(ctx, ux, uy, 30, `rgba(0, 212, 255, ${breathe * 0.4})`);
        });
    }
}

// ===== SCREEN 2: MEMBERS ONLY =====
function animateMembersOnly(ctx, progress, w, h) {
    const colors = ANIM_CONFIG.colors;
    const sa = ANIM_CONFIG.safeArea;
    
    const sx = w * sa.left;
    const sy = h * sa.top;
    const sw = w * (1 - sa.left - sa.right);
    const sh = h * (1 - sa.top - sa.bottom);
    
    // Phone card (0-0.125)
    if (progress >= 0) {
        const cardT = Math.min(progress / 0.125, 1);
        const cardX = sx + sw * 0.2;
        const cardY = sy + sh * 0.2 + sh * 0.3 * (1 - easeOut(cardT));
        const cardW = sw * 0.25;
        const cardH = sh * 0.4;
        
        drawRect(ctx, cardX, cardY, cardW, cardH, colors.lightGrey, cardT);
        
        // Join/Member text
        if (progress < 0.125) {
            ctx.fillStyle = colors.white;
            ctx.font = '14px Inter';
            ctx.textAlign = 'center';
            ctx.fillText('Join', cardX + cardW / 2, cardY + cardH / 2);
        } else if (progress >= 0.125 && progress < 0.25) {
            // Transition to Member (0.125-0.25)
            const transT = (progress - 0.125) / 0.125;
            ctx.fillStyle = colors.primary;
            ctx.font = 'bold 16px Inter';
            ctx.textAlign = 'center';
            ctx.globalAlpha = transT;
            ctx.fillText('Member ✓', cardX + cardW / 2, cardY + cardH / 2);
            ctx.globalAlpha = 1;
        } else {
            ctx.fillStyle = colors.primary;
            ctx.font = 'bold 16px Inter';
            ctx.textAlign = 'center';
            ctx.fillText('Member ✓', cardX + cardW / 2, cardY + cardH / 2);
        }
    }
    
    // Door lock (0.25-0.375)
    const doorX = sx + sw * 0.65;
    const doorY = sy + sh * 0.4;
    const lockSize = 40;
    
    if (progress >= 0.25) {
        const lockT = Math.min((progress - 0.25) / 0.125, 1);
        
        // Lock icon
        ctx.strokeStyle = progress < 0.375 ? colors.warning : colors.success;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(doorX, doorY, lockSize / 2, 0, Math.PI * 2);
        ctx.stroke();
        
        // Lock shackle (open/closed)
        if (progress < 0.375) {
            ctx.beginPath();
            ctx.arc(doorX, doorY - lockSize / 3, lockSize / 4, Math.PI, 0);
            ctx.stroke();
        } else {
            const openAngle = Math.PI * 0.3;
            ctx.beginPath();
            ctx.arc(doorX, doorY - lockSize / 3, lockSize / 4, Math.PI, Math.PI + openAngle);
            ctx.stroke();
        }
    }
    
    // Member enters (0.375-0.5625)
    if (progress >= 0.375) {
        const enterT = Math.min((progress - 0.375) / 0.1875, 1);
        const memberX = doorX + sw * 0.1 * easeInOut(enterT);
        const memberY = doorY;
        
        drawCircle(ctx, memberX, memberY, 15, colors.primary, enterT);
    }
    
    // Blocked person (0.5625-0.75)
    if (progress >= 0.5625) {
        const blockT = Math.min((progress - 0.5625) / 0.1875, 1);
        const blockedX = doorX - sw * 0.15;
        const blockedY = doorY + sh * 0.15;
        
        // Attempt to approach
        const approachX = blockedX + sw * 0.05 * Math.min(blockT * 2, 1);
        
        // Blocked
        if (blockT > 0.5) {
            const bounceX = approachX - sw * 0.03 * easeOut((blockT - 0.5) * 2);
            drawCircle(ctx, bounceX, blockedY, 15, colors.grey, blockT);
            
            // X mark
            ctx.strokeStyle = colors.warning;
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(bounceX - 8, blockedY - 8);
            ctx.lineTo(bounceX + 8, blockedY + 8);
            ctx.moveTo(bounceX + 8, blockedY - 8);
            ctx.lineTo(bounceX - 8, blockedY + 8);
            ctx.stroke();
        } else {
            drawCircle(ctx, approachX, blockedY, 15, colors.grey, blockT);
        }
    }
}

// ===== SCREEN 3: TAP TO PAY =====
function animateTapToPay(ctx, progress, w, h) {
    const colors = ANIM_CONFIG.colors;
    const sa = ANIM_CONFIG.safeArea;
    
    const sx = w * sa.left;
    const sy = h * sa.top;
    const sw = w * (1 - sa.left - sa.right);
    const sh = h * (1 - sa.top - sa.bottom);
    
    // 3 machines
    const machines = [
        { x: 0.15, y: 0.5, type: 'ambient' },
        { x: 0.5, y: 0.5, type: 'chill' },
        { x: 0.8, y: 0.5, type: 'heat' }
    ];
    
    // Machines always visible
    machines.forEach((m, i) => {
        const mx = sx + sw * m.x;
        const my = sy + sh * m.y;
        const mw = sw * 0.12;
        const mh = sh * 0.35;
        
        drawRect(ctx, mx - mw / 2, my - mh / 2, mw, mh, colors.lightGrey, 1);
        
        // Payment area highlight
        const payAreaY = my - mh * 0.3;
        drawRect(ctx, mx - mw / 2, payAreaY, mw, mh * 0.2, colors.grey, 0.5);
    });
    
    // Sequential tap + dispense (each takes ~0.25 duration)
    const sequenceTime = 0.1875; // ~1.5s each
    machines.forEach((m, i) => {
        const startT = i * sequenceTime;
        const endT = startT + sequenceTime;
        
        if (progress >= startT && progress < endT) {
            const t = (progress - startT) / sequenceTime;
            
            const mx = sx + sw * m.x;
            const my = sy + sh * m.y;
            
            // Tap ripple (0-0.4 of sequence)
            if (t < 0.4) {
                const rippleT = t / 0.4;
                const rippleRadius = 30 * rippleT;
                const rippleAlpha = 1 - rippleT;
                
                ctx.strokeStyle = colors.primary;
                ctx.lineWidth = 2;
                ctx.globalAlpha = rippleAlpha;
                ctx.beginPath();
                ctx.arc(mx, my - sh * 0.15, rippleRadius, 0, Math.PI * 2);
                ctx.stroke();
                ctx.globalAlpha = 1;
            }
            
            // Product dispense (0.4-1.0 of sequence)
            if (t >= 0.4) {
                const dispenseT = (t - 0.4) / 0.6;
                const productY = my + sh * 0.2 * dispenseT;
                const productSize = 15;
                
                drawRect(ctx, mx - productSize / 2, productY - productSize / 2, productSize, productSize, colors.success, 1);
            }
        }
    });
    
    // Payment icons (top right)
    if (progress >= 0) {
        const iconX = sx + sw * 0.92;
        const iconY = sy + sh * 0.1;
        const iconSize = 20;
        const iconGap = 25;
        
        ctx.font = '12px Inter';
        ctx.fillStyle = colors.white;
        ctx.textAlign = 'right';
        ctx.fillText('💳', iconX, iconY);
        ctx.fillText('', iconX, iconY + iconGap);
        ctx.fillText('G', iconX, iconY + iconGap * 2);
    }
}

// ===== SCREEN 4: REAL-TIME DATA =====
function animateRealTimeData(ctx, progress, w, h) {
    const colors = ANIM_CONFIG.colors;
    const sa = ANIM_CONFIG.safeArea;
    
    const sx = w * sa.left;
    const sy = h * sa.top;
    const sw = w * (1 - sa.left - sa.right);
    const sh = h * (1 - sa.top - sa.bottom);
    
    // WiFi router center
    const routerX = sx + sw * 0.5;
    const routerY = sy + sh * 0.5;
    
    // Router lights up (0-0.125)
    if (progress >= 0) {
        const routerT = Math.min(progress / 0.125, 1);
        drawCircle(ctx, routerX, routerY, 20, colors.primary, routerT);
        drawGlow(ctx, routerX, routerY, 40, `rgba(0, 212, 255, ${routerT * 0.6})`);
    }
    
    // 4 machines
    const machines = [
        { x: 0.2, y: 0.2 },
        { x: 0.8, y: 0.2 },
        { x: 0.2, y: 0.8 },
        { x: 0.8, y: 0.8 }
    ];
    
    machines.forEach((m, i) => {
        const mx = sx + sw * m.x;
        const my = sy + sh * m.y;
        const mw = sw * 0.1;
        const mh = sh * 0.15;
        
        drawRect(ctx, mx - mw / 2, my - mh / 2, mw, mh, colors.lightGrey, 1);
        
        // Data lines (0.125-0.3125)
        if (progress >= 0.125) {
            const lineT = Math.min((progress - 0.125) / 0.1875, 1);
            const growT = easeOut(lineT);
            
            const dx = routerX + (mx - routerX) * growT;
            const dy = routerY + (my - routerY) * growT;
            
            drawLine(ctx, routerX, routerY, dx, dy, colors.primary, 2, lineT * 0.6);
        }
    });
    
    // Dashboard (0.3125-0.5)
    if (progress >= 0.3125) {
        const dashT = Math.min((progress - 0.3125) / 0.1875, 1);
        const dashX = sx + sw * 0.05;
        const dashY = sy + sh * 0.05;
        const dashW = sw * 0.25;
        const dashH = sh * 0.2;
        
        const dashOffsetY = dashH * (1 - easeOut(dashT));
        
        drawRect(ctx, dashX, dashY - dashOffsetY, dashW, dashH, colors.grey, dashT * 0.8);
        
        if (dashT > 0.5) {
            ctx.fillStyle = colors.primary;
            ctx.font = 'bold 10px Inter';
            ctx.textAlign = 'left';
            ctx.fillText('Sales: $1,245', dashX + 10, dashY - dashOffsetY + 25);
            ctx.fillText('Stock: 87%', dashX + 10, dashY - dashOffsetY + 45);
            ctx.fillText('Status: ✓', dashX + 10, dashY - dashOffsetY + 65);
        }
    }
    
    // Data pulses (0.5-1.0)
    if (progress >= 0.5) {
        const pulseProgress = (progress - 0.5) / 0.5;
        
        machines.forEach((m, i) => {
            const mx = sx + sw * m.x;
            const my = sy + sh * m.y;
            
            const pulseT = (pulseProgress + i * 0.25) % 1;
            const pulseX = routerX + (mx - routerX) * pulseT;
            const pulseY = routerY + (my - routerY) * pulseT;
            
            drawCircle(ctx, pulseX, pulseY, 5, colors.primary, 1 - pulseT);
        });
    }
}

// ===== SCREEN 5: VENDOR RESTOCK =====
function animateVendorRestock(ctx, progress, w, h) {
    const colors = ANIM_CONFIG.colors;
    const sa = ANIM_CONFIG.safeArea;
    
    const sx = w * sa.left;
    const sy = h * sa.top;
    const sw = w * (1 - sa.left - sa.right);
    const sh = h * (1 - sa.top - sa.bottom);
    
    // Machine
    const mx = sx + sw * 0.5;
    const my = sy + sh * 0.5;
    const mw = sw * 0.15;
    const mh = sh * 0.4;
    
    drawRect(ctx, mx - mw / 2, my - mh / 2, mw, mh, colors.lightGrey, 1);
    
    // Stock bar (0-0.25: drops from 80% to 20%)
    const stockBarX = mx - mw * 0.4;
    const stockBarY = my - mh * 0.3;
    const stockBarW = mw * 0.8;
    const stockBarH = sh * 0.05;
    
    let stockLevel = 0.8;
    if (progress <= 0.25) {
        stockLevel = 0.8 - (0.6 * (progress / 0.25));
    } else {
        stockLevel = 0.2;
    }
    
    // Bar background
    drawRect(ctx, stockBarX, stockBarY, stockBarW, stockBarH, colors.grey, 0.3);
    
    // Bar fill
    const fillColor = stockLevel < 0.3 ? colors.warning : colors.success;
    drawRect(ctx, stockBarX, stockBarY, stockBarW * stockLevel, stockBarH, fillColor, 1);
    
    // Low stock alert (0.25-0.3125)
    if (progress >= 0.25 && progress < 0.5625) {
        const alertT = Math.min((progress - 0.25) / 0.0625, 1);
        const alertX = mx + mw * 0.7;
        const alertY = my - mh * 0.4;
        
        // Badge
        drawCircle(ctx, alertX, alertY, 12, colors.warning, alertT);
        
        // Text
        if (alertT > 0.5) {
            ctx.fillStyle = colors.white;
            ctx.font = 'bold 8px Inter';
            ctx.textAlign = 'center';
            ctx.fillText('!', alertX, alertY + 3);
        }
        
        // "Low stock" text
        ctx.fillStyle = colors.warning;
        ctx.font = '12px Inter';
        ctx.textAlign = 'center';
        ctx.fillText('Low Stock', mx, my + mh * 0.6);
    }
    
    // Vendor restocking (0.3125-0.5625)
    if (progress >= 0.3125 && progress < 0.6875) {
        const restockT = (progress - 0.3125) / 0.25;
        
        const vendorX = mx - sw * 0.25 + sw * 0.25 * easeInOut(restockT);
        const vendorY = my;
        
        // Vendor (person + box)
        drawCircle(ctx, vendorX, vendorY - 20, 15, colors.primary, 1);
        drawRect(ctx, vendorX - 15, vendorY, 30, 25, colors.primary, 0.6);
        
        // Box icon
        ctx.strokeStyle = colors.white;
        ctx.lineWidth = 2;
        ctx.strokeRect(vendorX - 10, vendorY + 5, 20, 15);
    }
    
    // Stock refilled (0.5625-0.6875)
    if (progress >= 0.5625) {
        const refillT = Math.min((progress - 0.5625) / 0.125, 1);
        const newStock = 0.2 + 0.7 * refillT;
        
        drawRect(ctx, stockBarX, stockBarY, stockBarW * newStock, stockBarH, colors.success, 1);
    }
}

// ===== SCREEN 6: AI SECURITY =====
function animateAISecurity(ctx, progress, w, h) {
    const colors = ANIM_CONFIG.colors;
    const sa = ANIM_CONFIG.safeArea;
    
    const sx = w * sa.left;
    const sy = h * sa.top;
    const sw = w * (1 - sa.left - sa.right);
    const sh = h * (1 - sa.top - sa.bottom);
    
    // Store outline
    ctx.strokeStyle = colors.grey;
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.3;
    ctx.strokeRect(sx, sy, sw, sh);
    ctx.globalAlpha = 1;
    
    // Camera icon (top right)
    const camX = sx + sw * 0.85;
    const camY = sy + sh * 0.15;
    
    drawCircle(ctx, camX, camY, 12, colors.primary, 1);
    
    // Breathing glow (0.625-1.0)
    if (progress >= 0.625) {
        const breathe = Math.sin((progress - 0.625) * Math.PI * 6) * 0.3 + 0.7;
        drawGlow(ctx, camX, camY, 25, `rgba(0, 212, 255, ${breathe * 0.4})`);
    }
    
    // Scan frame (0-0.1875)
    if (progress <= 0.1875) {
        const scanT = progress / 0.1875;
        const scanY = sy + sh * scanT;
        
        ctx.strokeStyle = colors.primary;
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.6;
        ctx.beginPath();
        ctx.moveTo(sx, scanY);
        ctx.lineTo(sx + sw, scanY);
        ctx.stroke();
        ctx.globalAlpha = 1;
    }
    
    // Anomaly detected (0.1875-0.275)
    if (progress >= 0.1875 && progress < 0.4375) {
        const anomalyX = sx + sw * 0.4;
        const anomalyY = sy + sh * 0.6;
        
        // Flash
        const flashT = (progress - 0.1875) / 0.0875;
        const flash = Math.sin(flashT * Math.PI * 3);
        
        drawCircle(ctx, anomalyX, anomalyY, 20, colors.warning, Math.abs(flash) * 0.6);
        
        // Alert badge
        if (progress >= 0.2) {
            const alertX = sx + sw * 0.05;
            const alertY = sy + sh * 0.85;
            
            drawCircle(ctx, alertX, alertY, 15, colors.warning, 1);
            
            ctx.fillStyle = colors.white;
            ctx.font = 'bold 10px Inter';
            ctx.textAlign = 'center';
            ctx.fillText('!', alertX, alertY + 4);
            
            ctx.fillStyle = colors.warning;
            ctx.font = '11px Inter';
            ctx.fillText('Anomaly', alertX + 30, alertY + 4);
        }
    }
    
    // Intercom waves (0.275-0.4375)
    if (progress >= 0.275 && progress < 0.4375) {
        const waveT = (progress - 0.275) / 0.1625;
        const waveX = sx + sw * 0.15;
        const waveY = sy + sh * 0.85;
        
        // 2 waves
        for (let i = 0; i < 2; i++) {
            const waveRadius = 30 + i * 20 + waveT * 40;
            const waveAlpha = (1 - waveT) * 0.6;
            
            ctx.strokeStyle = colors.primary;
            ctx.lineWidth = 2;
            ctx.globalAlpha = waveAlpha;
            ctx.beginPath();
            ctx.arc(waveX, waveY, waveRadius, 0, Math.PI * 2);
            ctx.stroke();
            ctx.globalAlpha = 1;
        }
    }
    
    // Resolved (0.4375-0.625)
    if (progress >= 0.4375) {
        const resolveT = Math.min((progress - 0.4375) / 0.1875, 1);
        
        // Green checkmark
        const checkX = sx + sw * 0.4;
        const checkY = sy + sh * 0.6;
        
        if (resolveT > 0.3) {
            ctx.strokeStyle = colors.success;
            ctx.lineWidth = 3;
            ctx.globalAlpha = resolveT;
            ctx.beginPath();
            ctx.moveTo(checkX - 10, checkY);
            ctx.lineTo(checkX - 3, checkY + 7);
            ctx.lineTo(checkX + 10, checkY - 10);
            ctx.stroke();
            ctx.globalAlpha = 1;
        }
    }
}

// ===== CTA NETWORK MAP =====
function animateNetworkMap(ctx, progress, w, h) {
    const colors = ANIM_CONFIG.colors;
    
    // Miniature network (simplified version of Screen 4)
    const nodeCount = 8;
    const centerX = w / 2;
    const centerY = h / 2;
    const radius = Math.min(w, h) * 0.3;
    
    for (let i = 0; i < nodeCount; i++) {
        const angle = (i / nodeCount) * Math.PI * 2;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;
        
        // Node
        const nodeT = Math.min(progress * 2, 1);
        drawCircle(ctx, x, y, 6, colors.primary, nodeT * 0.6);
        
        // Connections to center
        if (nodeT === 1) {
            drawLine(ctx, centerX, centerY, x, y, colors.primary, 1, 0.2);
        }
    }
    
    // Center hub
    drawCircle(ctx, centerX, centerY, 10, colors.primary, Math.min(progress * 2, 1));
}

// ===== INTERSECTION OBSERVER SETUP =====
function setupViewportObserver() {
    const sections = document.querySelectorAll('.animated-section');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const canvasId = entry.target.querySelector('.animation-canvas').id;
            const controller = controllers[canvasId];
            
            if (!controller) return;
            
            if (entry.isIntersecting && entry.intersectionRatio >= ANIM_CONFIG.viewportThreshold) {
                controller.start();
            } else if (entry.intersectionRatio <= ANIM_CONFIG.exitThreshold) {
                controller.stop();
            }
        });
    }, {
        threshold: [ANIM_CONFIG.exitThreshold, ANIM_CONFIG.viewportThreshold]
    });
    
    sections.forEach(section => observer.observe(section));
}

// ===== INITIALIZE ALL ANIMATIONS =====
const controllers = {};

document.addEventListener('DOMContentLoaded', () => {
    controllers['canvas_s1'] = new AnimationController('canvas_s1', animatePlugPlay);
    controllers['canvas_s2'] = new AnimationController('canvas_s2', animateMembersOnly);
    controllers['canvas_s3'] = new AnimationController('canvas_s3', animateTapToPay);
    controllers['canvas_s4'] = new AnimationController('canvas_s4', animateRealTimeData);
    controllers['canvas_s5'] = new AnimationController('canvas_s5', animateVendorRestock);
    controllers['canvas_s6'] = new AnimationController('canvas_s6', animateAISecurity);
    controllers['canvas_cta'] = new AnimationController('canvas_cta', animateNetworkMap);
    
    setupViewportObserver();
    
    console.log('How It Works animations loaded');
});

// ===== REDUCED MOTION SUPPORT =====
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    console.log('Reduced motion detected - animations simplified');
    ANIM_CONFIG.loopDuration = 16000; // Slower
}
