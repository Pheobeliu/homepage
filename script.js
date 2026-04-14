/**
 * 高级简约 - 水波纹艺术效果（多主题版）
 */

// ===================================
// 主题切换功能
// ===================================
function setTheme(themeName) {
    document.body.setAttribute('data-theme', themeName);

    // 更新按钮状态
    document.querySelectorAll('.theme-switcher button').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('onclick').includes(themeName)) {
            btn.classList.add('active');
        }
    });

    // 保存选择
    localStorage.setItem('selected-theme', themeName);
}

// 加载保存的主题
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('selected-theme');
    if (savedTheme) {
        setTheme(savedTheme);
    }
});

// ===================================
// 水波纹动画系统
// ===================================
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
        this.waves = [
            { amplitude: 15, wavelength: 400, speed: 0.008, offset: 0, opacity: 0.08, y: 0.65 },
            { amplitude: 25, wavelength: 600, speed: 0.012, offset: Math.PI / 3, opacity: 0.06, y: 0.75 },
            { amplitude: 18, wavelength: 350, speed: 0.015, offset: Math.PI / 2, opacity: 0.05, y: 0.85 }
        ];
    }

    getWaveColor() {
        const style = getComputedStyle(document.body);
        return style.getPropertyValue('--wave-color').trim().split(',').map(c => parseInt(c.trim()));
    }

    drawWave(wave, time) {
        const { amplitude, wavelength, speed, offset, opacity, y } = wave;
        const yPos = this.canvas.height * y;
        const [r, g, b] = this.getWaveColor();

        this.ctx.beginPath();
        this.ctx.moveTo(0, this.canvas.height);

        for (let x = 0; x <= this.canvas.width; x += 3) {
            const waveY = yPos +
                Math.sin((x / wavelength) * Math.PI * 2 + time * speed + offset) * amplitude +
                Math.sin((x / (wavelength * 0.6)) * Math.PI * 2 + time * speed * 1.3) * (amplitude * 0.4);

            this.ctx.lineTo(x, waveY);
        }

        this.ctx.lineTo(this.canvas.width, this.canvas.height);
        this.ctx.closePath();

        const gradient = this.ctx.createLinearGradient(0, yPos - amplitude, 0, this.canvas.height);
        gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${opacity})`);
        gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, ${opacity * 0.2})`);

        this.ctx.fillStyle = gradient;
        this.ctx.fill();
    }

    drawMouseGlow() {
        if (this.mouseX && this.mouseY) {
            const [r, g, b] = this.getWaveColor();
            const gradient = this.ctx.createRadialGradient(
                this.mouseX, this.mouseY, 0,
                this.mouseX, this.mouseY, 200
            );
            gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.04)`);
            gradient.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, 0.02)`);
            gradient.addColorStop(1, 'transparent');

            this.ctx.fillStyle = gradient;
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.waves.forEach(wave => this.drawWave(wave, this.time));
        this.drawMouseGlow();

        this.time++;
        requestAnimationFrame(() => this.animate());
    }

    setupMouseTracking() {
        let targetX = 0, targetY = 0;

        document.addEventListener('mousemove', (e) => {
            targetX = e.clientX;
            targetY = e.clientY;
        });

        const smoothFollow = () => {
            this.mouseX += (targetX - this.mouseX) * 0.05;
            this.mouseY += (targetY - this.mouseY) * 0.05;
            requestAnimationFrame(smoothFollow);
        };
        smoothFollow();
    }
}

// ===================================
// 涟漪效果
// ===================================
class RippleEffect {
    constructor() {
        this.container = document.getElementById('rippleContainer');
        this.lastRipple = 0;
        this.setupEventListeners();
    }

    getWaveColor() {
        const style = getComputedStyle(document.body);
        return style.getPropertyValue('--wave-color').trim().split(',').map(c => parseInt(c.trim()));
    }

    setupEventListeners() {
        document.addEventListener('mousemove', (e) => {
            if (Date.now() - this.lastRipple > 150) {
                this.createRipple(e.clientX, e.clientY, false);
                this.lastRipple = Date.now();
            }
        });

        document.addEventListener('click', (e) => {
            this.createRipple(e.clientX, e.clientY, true);
        });
    }

    createRipple(x, y, isClick = false) {
        const [r, g, b] = this.getWaveColor();
        const ripple = document.createElement('div');
        ripple.className = 'ripple';

        const size = isClick ? 200 : 100;
        ripple.style.width = `${size}px`;
        ripple.style.height = `${size}px`;
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;

        if (isClick) {
            ripple.style.background = `radial-gradient(
                circle,
                rgba(${r}, ${g}, ${b}, 0.18) 0%,
                rgba(${r}, ${g}, ${b}, 0.06) 40%,
                transparent 70%
            )`;
            ripple.style.animationDuration = '2.5s';
        }

        this.container.appendChild(ripple);
        setTimeout(() => ripple.remove(), 3000);
    }
}

// ===================================
// 初始化
// ===================================
document.addEventListener('DOMContentLoaded', () => {
    new WaterEffect();
    new RippleEffect();
});
