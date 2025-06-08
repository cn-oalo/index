/**
 * 时钟模块
 * 实现数字时钟动画效果
 */

// 时钟配置
const config = {
    canvasWidth: 820,
    canvasHeight: 250,
    radius: 7,
    numberSpacing: 10,
    bounceRate: 0.65,
    // 更新颜色配置
    colors: [
        "#FF6B6B", "#4ECDC4", "#45B7D1", "#96E6B3",
        "#FFBE0B", "#FF447C", "#21D4FD", "#B721FF"
    ],
    // 添加渐变色配置
    gradients: [
        { start: '#FF6B6B', end: '#4ECDC4' },
        { start: '#45B7D1', end: '#FFBE0B' },
        { start: '#21D4FD', end: '#B721FF' }
    ],
    // 添加发光效果
    glow: {
        enabled: true,
        blur: 15,
        color: 'rgba(255, 255, 255, 0.8)'
    },
    // 添加渐变动画配置
    gradientAnimation: {
        speed: 0.005,  // 渐变速度
        enabled: true  // 是否启用渐变动画
    }
};

// 数字点阵定义
const numberMatrix = [
    // 0-9 的点阵定义（保持原有的数组）
    [[0, 0, 1, 1, 1, 0, 0], [0, 1, 1, 0, 1, 1, 0], [1, 1, 0, 0, 0, 1, 1], [1, 1, 0, 0, 0, 1, 1], [1, 1, 0, 0, 0, 1, 1], [1, 1, 0, 0, 0, 1, 1], [1, 1, 0, 0, 0, 1, 1], [1, 1, 0, 0, 0, 1, 1], [0, 1, 1, 0, 1, 1, 0], [0, 0, 1, 1, 1, 0, 0]],
    [[0, 0, 0, 1, 1, 0, 0], [0, 1, 1, 1, 1, 0, 0], [0, 0, 0, 1, 1, 0, 0], [0, 0, 0, 1, 1, 0, 0], [0, 0, 0, 1, 1, 0, 0], [0, 0, 0, 1, 1, 0, 0], [0, 0, 0, 1, 1, 0, 0], [0, 0, 0, 1, 1, 0, 0], [0, 0, 0, 1, 1, 0, 0], [1, 1, 1, 1, 1, 1, 1]],
    [[0, 1, 1, 1, 1, 1, 0], [1, 1, 0, 0, 0, 1, 1], [0, 0, 0, 0, 0, 1, 1], [0, 0, 0, 0, 1, 1, 0], [0, 0, 0, 1, 1, 0, 0], [0, 0, 1, 1, 0, 0, 0], [0, 1, 1, 0, 0, 0, 0], [1, 1, 0, 0, 0, 0, 0], [1, 1, 0, 0, 0, 1, 1], [1, 1, 1, 1, 1, 1, 1]],
    [[1, 1, 1, 1, 1, 1, 1], [0, 0, 0, 0, 0, 1, 1], [0, 0, 0, 0, 1, 1, 0], [0, 0, 0, 1, 1, 0, 0], [0, 0, 1, 1, 1, 0, 0], [0, 0, 0, 0, 1, 1, 0], [0, 0, 0, 0, 0, 1, 1], [0, 0, 0, 0, 0, 1, 1], [1, 1, 0, 0, 0, 1, 1], [0, 1, 1, 1, 1, 1, 0]],
    [[0, 0, 0, 0, 1, 1, 0], [0, 0, 0, 1, 1, 1, 0], [0, 0, 1, 1, 1, 1, 0], [0, 1, 1, 0, 1, 1, 0], [1, 1, 0, 0, 1, 1, 0], [1, 1, 1, 1, 1, 1, 1], [0, 0, 0, 0, 1, 1, 0], [0, 0, 0, 0, 1, 1, 0], [0, 0, 0, 0, 1, 1, 0], [0, 0, 0, 1, 1, 1, 1]],
    [[1, 1, 1, 1, 1, 1, 1], [1, 1, 0, 0, 0, 0, 0], [1, 1, 0, 0, 0, 0, 0], [1, 1, 1, 1, 1, 1, 0], [0, 0, 0, 0, 0, 1, 1], [0, 0, 0, 0, 0, 1, 1], [0, 0, 0, 0, 0, 1, 1], [0, 0, 0, 0, 0, 1, 1], [1, 1, 0, 0, 0, 1, 1], [0, 1, 1, 1, 1, 1, 0]],
    [[0, 0, 0, 0, 1, 1, 0], [0, 0, 1, 1, 0, 0, 0], [0, 1, 1, 0, 0, 0, 0], [1, 1, 0, 0, 0, 0, 0], [1, 1, 0, 1, 1, 1, 0], [1, 1, 0, 0, 0, 1, 1], [1, 1, 0, 0, 0, 1, 1], [1, 1, 0, 0, 0, 1, 1], [1, 1, 0, 0, 0, 1, 1], [0, 1, 1, 1, 1, 1, 0]],
    [[1, 1, 1, 1, 1, 1, 1], [1, 1, 0, 0, 0, 1, 1], [0, 0, 0, 0, 1, 1, 0], [0, 0, 0, 0, 1, 1, 0], [0, 0, 0, 1, 1, 0, 0], [0, 0, 0, 1, 1, 0, 0], [0, 0, 1, 1, 0, 0, 0], [0, 0, 1, 1, 0, 0, 0], [0, 0, 1, 1, 0, 0, 0], [0, 0, 1, 1, 0, 0, 0]],
    [[0, 1, 1, 1, 1, 1, 0], [1, 1, 0, 0, 0, 1, 1], [1, 1, 0, 0, 0, 1, 1], [1, 1, 0, 0, 0, 1, 1], [0, 1, 1, 1, 1, 1, 0], [1, 1, 0, 0, 0, 1, 1], [1, 1, 0, 0, 0, 1, 1], [1, 1, 0, 0, 0, 1, 1], [1, 1, 0, 0, 0, 1, 1], [0, 1, 1, 1, 1, 1, 0]],
    [[0, 1, 1, 1, 1, 1, 0], [1, 1, 0, 0, 0, 1, 1], [1, 1, 0, 0, 0, 1, 1], [1, 1, 0, 0, 0, 1, 1], [0, 1, 1, 1, 0, 1, 1], [0, 0, 0, 0, 0, 1, 1], [0, 0, 0, 0, 0, 1, 1], [0, 0, 0, 0, 1, 1, 0], [0, 0, 0, 1, 1, 0, 0], [0, 1, 1, 0, 0, 0, 0]],
    // 冒号的点阵
    [[0, 0, 0, 0], [0, 0, 0, 0], [0, 1, 1, 0], [0, 1, 1, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 1, 1, 0], [0, 1, 1, 0], [0, 0, 0, 0], [0, 0, 0, 0]]
];

let ctx;
let particles = [];
let lastDigits = [];

// 导出初始化函数
export function initClock() {
    const canvas = document.getElementById("canvas");
    if (!canvas) return; // 确保canvas存在

    canvas.width = config.canvasWidth;
    canvas.height = config.canvasHeight;
    ctx = canvas.getContext("2d");
    if (!ctx) return; // 确保context存在

    // 立即渲染第一帧
    renderClock(ctx);

    // 启动时钟，每秒更新一次
    setInterval(() => {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        renderClock(ctx);
    }, 50); // 改为50ms以获得更流畅的动画效果
}

// 缓存数字模板
const digitTemplates = new Map();

// 渲染时钟
function renderClock(ctx) {
    const digits = [];
    ctx.fillStyle = "#005EAC";

    // 获取当前时间
    const now = new Date();
    let offsetX = 70;
    const offsetY = 30;

    // 处理小时
    const hours = now.getHours();
    digits.push({ num: Math.floor(hours / 10) });
    digits.push({ num: hours % 10 });
    digits.push({ num: 10 }); // 冒号

    // 处理分钟
    const minutes = now.getMinutes();
    digits.push({ num: Math.floor(minutes / 10) });
    digits.push({ num: minutes % 10 });
    digits.push({ num: 10 }); // 冒号

    // 处理秒钟
    const seconds = now.getSeconds();
    digits.push({ num: Math.floor(seconds / 10) });
    digits.push({ num: seconds % 10 });

    // 计算每个数字的位置
    for (let i = 0; i < digits.length; i++) {
        digits[i].offsetX = offsetX;
        offsetX = renderDigit(offsetX, offsetY, digits[i].num, ctx);
        if (i < digits.length - 1) {
            if (digits[i].num != 10 && digits[i + 1].num != 10) {
                offsetX += config.numberSpacing;
            }
        }
    }

    // 处理数字变化时的动画效果
    if (lastDigits.length == 0) {
        lastDigits = digits;
    } else {
        for (let i = 0; i < lastDigits.length; i++) {
            if (lastDigits[i].num != digits[i].num) {
                addParticles(digits[i]);
                lastDigits[i].num = digits[i].num;
            }
        }
    }

    // 渲染粒子
    renderParticles(ctx);
    updateParticles();

    return now;
}

// 添加粒子效果
function addParticles(digit) {
    const matrix = numberMatrix[digit.num];
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[i].length; j++) {
            if (matrix[i][j] == 1) {
                const particle = {
                    offsetX: digit.offsetX + config.radius + config.radius * 2 * j,
                    offsetY: 30 + config.radius + config.radius * 2 * i,
                    color: config.colors[Math.floor(Math.random() * config.colors.length)],
                    g: 1.5 + Math.random(),
                    vx: Math.pow(-1, Math.ceil(Math.random() * 10)) * 4 + Math.random(),
                    vy: -5
                };
                particles.push(particle);
            }
        }
    }
}

// 渲染粒子
function renderParticles(ctx) {
    for (let i = 0; i < particles.length; i++) {
        ctx.beginPath();
        ctx.fillStyle = particles[i].color;
        ctx.arc(particles[i].offsetX, particles[i].offsetY, config.radius, 0, 2 * Math.PI);
        ctx.fill();
    }
}

// 更新粒子位置
function updateParticles() {
    let count = 0;
    for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.offsetX += p.vx;
        p.offsetY += p.vy;
        p.vy += p.g;

        if (p.offsetY > config.canvasHeight - config.radius) {
            p.offsetY = config.canvasHeight - config.radius;
            p.vy = -p.vy * config.bounceRate;
        }

        if (p.offsetX > config.radius && p.offsetX < config.canvasWidth - config.radius) {
            particles[count] = particles[i];
            count++;
        }
    }

    while (particles.length > count) {
        particles.pop();
    }
}

// 添加渐变动画进度变量
let gradientProgress = 0;

// 渲染单个数字
function renderDigit(x, y, num, ctx) {
    const matrix = numberMatrix[num];

    // 根据时间更新渐变进度
    if (config.gradientAnimation.enabled) {
        gradientProgress += config.gradientAnimation.speed;
        if (gradientProgress >= config.gradients.length) {
            gradientProgress = 0;
        }
    }

    // 计算当前渐变索引和下一个渐变索引
    const currentIndex = Math.floor(gradientProgress);
    const nextIndex = (currentIndex + 1) % config.gradients.length;
    const progress = gradientProgress - currentIndex;

    // 计算当前渐变颜色
    const currentGradient = config.gradients[currentIndex];
    const nextGradient = config.gradients[nextIndex];

    // 创建动态渐变
    const grd = ctx.createLinearGradient(x, y, x, y + matrix.length * config.radius * 2);

    // 混合两个渐变的颜色
    const startColor = interpolateColor(currentGradient.start, nextGradient.start, progress);
    const endColor = interpolateColor(currentGradient.end, nextGradient.end, progress);

    grd.addColorStop(0, startColor);
    grd.addColorStop(1, endColor);

    // 设置发光效果
    if (config.glow.enabled) {
        ctx.shadowBlur = config.glow.blur;
        ctx.shadowColor = config.glow.color;
    }

    // 渲染数字
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[i].length; j++) {
            if (matrix[i][j] == 1) {
                ctx.beginPath();
                ctx.fillStyle = grd;
                ctx.arc(x + config.radius + config.radius * 2 * j,
                    y + config.radius + config.radius * 2 * i,
                    config.radius, 0, 2 * Math.PI);
                ctx.fill();
            }
        }
    }

    // 重置阴影效果
    if (config.glow.enabled) {
        ctx.shadowBlur = 0;
    }

    ctx.beginPath();
    x += matrix[0].length * config.radius * 2;
    return x;
}

// 颜色插值函数
function interpolateColor(color1, color2, factor) {
    const rgb1 = hexToRgb(color1);
    const rgb2 = hexToRgb(color2);

    const r = Math.round(rgb1.r + factor * (rgb2.r - rgb1.r));
    const g = Math.round(rgb1.g + factor * (rgb2.g - rgb1.g));
    const b = Math.round(rgb1.b + factor * (rgb2.b - rgb1.b));

    return `rgb(${r}, ${g}, ${b})`;
}

// 十六进制颜色转RGB
function hexToRgb(hex) {
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);

    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
} 