// ============================================
// 主题管理器
// ============================================

class ThemeManager {
    constructor() {
        this.currentTheme = 'lake-blue';
        this.themes = ['lake-blue', 'mono', 'macaron'];
        this.init();
    }

    init() {
        // 绑定主题按钮事件
        document.querySelectorAll('.theme-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const theme = btn.dataset.theme;
                this.setTheme(theme);
                this.updateActiveButton(btn);
            });
        });
    }

    setTheme(theme) {
        this.currentTheme = theme;
        document.documentElement.setAttribute('data-theme', theme);

        // 通知水波效果更新颜色
        if (window.waterEffect) {
            window.waterEffect.onThemeChange();
        }
    }

    updateActiveButton(activeBtn) {
        document.querySelectorAll('.theme-btn').forEach(b => b.classList.remove('active'));
        activeBtn.classList.add('active');
    }
}

// ============================================
// 水波纹动画系统
// ============================================

class WaterEffect {
    constructor() {
        this.canvas = document.getElementById('waterCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.time = 0;
        this.waves = [];
        this.mouseX = 0;
        this.mouseY = 0;

        this.init();
        this.createWaves();
        this.animate();
        this.setupMouseTracking();
    }

    init() {
        this.resize();
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createWaves() {
        this.waves = [];
        for (let i = 0; i < 4; i++) {
            this.waves.push({
                amplitude: 15 + Math.random() * 25,
                wavelength: 250 + Math.random() * 350,
                speed: 0.015 + Math.random() * 0.02,
                offset: Math.random() * Math.PI * 2,
                opacity: 0.08 + Math.random() * 0.12,
                y: this.canvas.height * (0.35 + i * 0.17)
            });
        }
    }

    getThemeColors() {
        const style = getComputedStyle(document.documentElement);
        return {
            wave1: style.getPropertyValue('--wave-color-1').trim() || 'rgba(0, 212, 255, 0.12)',
            wave2: style.getPropertyValue('--wave-color-2').trim() || 'rgba(0, 153, 204, 0.08)',
            accent: style.getPropertyValue('--accent').trim() || '#00d4ff',
            bgEnd: style.getPropertyValue('--bg-gradient-end').trim() || '#0f2744'
        };
    }

    onThemeChange() {
        // 主题切换时重新获取颜色
    }

    drawWave(wave, time, colors) {
        const { amplitude, wavelength, speed, offset, y } = wave;

        this.ctx.beginPath();
        this.ctx.moveTo(0, y);

        for (let x = 0; x <= this.canvas.width; x += 5) {
            const waveY =
                y +
                Math.sin((x / wavelength) * Math.PI * 2 + time * speed + offset) * amplitude +
                Math.sin((x / (wavelength * 0.5)) * Math.PI * 2 + time * speed * 1.3) * (amplitude * 0.25);
            this.ctx.lineTo(x, waveY);
        }

        this.ctx.lineTo(this.canvas.width, this.canvas.height);
        this.ctx.lineTo(0, this.canvas.height);
        this.ctx.closePath();

        const gradient = this.ctx.createLinearGradient(0, y - amplitude, 0, this.canvas.height);
        gradient.addColorStop(0, colors.wave1);
        gradient.addColorStop(0.6, colors.wave2);
        gradient.addColorStop(1, colors.bgEnd);

        this.ctx.fillStyle = gradient;
        this.ctx.fill();
    }

    drawMouseInfluence(colors) {
        if (this.mouseX && this.mouseY) {
            const gradient = this.ctx.createRadialGradient(
                this.mouseX, this.mouseY, 0,
                this.mouseX, this.mouseY, 180
            );
            gradient.addColorStop(0, colors.wave1.replace(/[\d.]+\)$/, '0.18)'));
            gradient.addColorStop(1, 'transparent');

            this.ctx.fillStyle = gradient;
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        const colors = this.getThemeColors();

        this.waves.forEach(wave => {
            this.drawWave(wave, this.time, colors);
        });

        this.drawMouseInfluence(colors);

        this.time++;
        requestAnimationFrame(() => this.animate());
    }

    setupMouseTracking() {
        document.addEventListener('mousemove', e => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
        });
    }
}

// ============================================
// 鼠标涟漪效果
// ============================================

class RippleEffect {
    constructor() {
        this.container = document.getElementById('rippleContainer');
        this.lastRipple = 0;
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.addEventListener('mousemove', e => {
            if (Date.now() - this.lastRipple > 120) {
                this.createRipple(e.clientX, e.clientY, false);
                this.lastRipple = Date.now();
            }
        });

        document.addEventListener('click', e => {
            this.createRipple(e.clientX, e.clientY, true);
        });
    }

    createRipple(x, y, isClick) {
        const ripple = document.createElement('div');
        ripple.className = 'ripple';

        const size = isClick ? 180 : 90;
        ripple.style.width = `${size}px`;
        ripple.style.height = `${size}px`;
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;

        if (isClick) {
            ripple.style.animationDuration = '3s';
        }

        this.container.appendChild(ripple);

        setTimeout(() => ripple.remove(), isClick ? 3000 : 2500);
    }
}

// ============================================
// 初始化
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    new ThemeManager();
    window.waterEffect = new WaterEffect();
    new RippleEffect();

    console.log(
        '%c Liu Jinjing %c Today ',
        'background: #00d4ff; color: #000; font-size: 16px; font-weight: 600; padding: 4px 8px; border-radius: 3px 0 0 3px;',
        'background: #fff; color: #000; font-size: 16px; font-weight: 400; padding: 4px 8px; border-radius: 0 3px 3px 0;'
    );
});
