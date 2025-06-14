/**
 * 时钟模块
 * 实现数字时钟动画效果
 */

// 时钟配置
const config = {
    canvasWidth: 700,  // 基础宽度，将根据容器自动调整
    canvasHeight: 200, // 基础高度，将根据容器自动调整
    radius: 6,         // 基础点阵半径，将根据屏幕大小调整
    numberSpacing: 8,  // 数字间距，将根据屏幕大小调整
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
    },
    // 性能配置
    performance: {
        targetFPS: 30,
        particleLimit: 100,
        mobileOptimization: true
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
let lastRenderTime = 0;
let frameInterval = 1000 / config.performance.targetFPS;
let offscreenCanvas;
let offscreenContext;
let isInitialized = false;
let isMobile = false;
let containerWidth = 0;

// 缓存数字模板
const digitTemplates = new Map();

// 检测设备性能
function detectDeviceCapabilities() {
    isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isLowPerfDevice = isMobile || (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4);

    // 根据设备性能调整配置
    if (isLowPerfDevice) {
        config.performance.targetFPS = 20;
        config.performance.particleLimit = 30; // 减少粒子数量
        config.glow.enabled = false;
        frameInterval = 1000 / config.performance.targetFPS;
    }

    return isLowPerfDevice;
}

// 计算最佳尺寸
function calculateOptimalSize() {
    // 获取父容器宽度
    const canvas = document.getElementById("canvas");
    if (!canvas) return { width: config.canvasWidth, height: config.canvasHeight };

    // 获取父元素宽度
    const parentElement = canvas.parentElement;
    const parentWidth = parentElement ? parentElement.clientWidth : window.innerWidth;
    containerWidth = parentWidth;

    // 计算最佳宽度（考虑内边距）
    let optimalWidth = Math.min(config.canvasWidth, parentWidth - 30);

    // 根据宽度计算高度和点阵大小
    const aspectRatio = config.canvasHeight / config.canvasWidth;
    let optimalHeight = Math.round(optimalWidth * aspectRatio);

    // 根据屏幕大小调整点阵半径
    let optimalRadius = config.radius;
    if (optimalWidth < 400) {
        optimalRadius = Math.max(3, Math.floor(config.radius * (optimalWidth / config.canvasWidth)));
    }

    // 调整间距
    let optimalSpacing = Math.max(4, Math.floor(config.numberSpacing * (optimalWidth / config.canvasWidth)));

    return {
        width: optimalWidth,
        height: optimalHeight,
        radius: optimalRadius,
        spacing: optimalSpacing
    };
}

// 导出初始化函数
export function initClock() {
    const canvas = document.getElementById("canvas");
    if (!canvas) return; // 确保canvas存在

    // 检测设备性能
    const isLowPerfDevice = detectDeviceCapabilities();

    // 计算最佳尺寸
    const optimalSize = calculateOptimalSize();

    // 更新配置
    config.radius = optimalSize.radius;
    config.numberSpacing = optimalSize.spacing;

    // 设置画布大小
    canvas.width = optimalSize.width;
    canvas.height = optimalSize.height;

    // 移除CSS中的transform scale，使用原生尺寸
    canvas.style.transform = 'none';
    canvas.style.maxWidth = '100%';
    canvas.style.maxHeight = 'none';
    canvas.style.margin = '10px auto';

    // 创建上下文
    ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return; // 确保context存在

    // 创建离屏画布
    offscreenCanvas = document.createElement('canvas');
    offscreenCanvas.width = optimalSize.width;
    offscreenCanvas.height = optimalSize.height;
    offscreenContext = offscreenCanvas.getContext('2d', { alpha: true });

    // 预渲染数字模板
    preRenderDigits();

    // 立即渲染第一帧
    isInitialized = true;
    renderClock();

    // 启动时钟，根据设备性能决定更新频率
    const updateInterval = isLowPerfDevice ? 1000 : 100; // 降低更新频率

    setInterval(() => {
        if (document.hidden) return; // 页面不可见时不更新
        renderClock();
    }, updateInterval);

    // 监听页面可见性变化
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden && isInitialized) {
            renderClock(); // 页面变为可见时立即更新
        }
    });

    // 监听窗口大小变化，重新调整时钟大小
    window.addEventListener('resize', debounce(() => {
        if (isInitialized) {
            // 重新计算最佳尺寸
            const newSize = calculateOptimalSize();

            // 检查是否需要更新
            if (Math.abs(newSize.width - canvas.width) > 10) {
                // 更新配置
                config.radius = newSize.radius;
                config.numberSpacing = newSize.spacing;

                // 更新画布尺寸
                canvas.width = newSize.width;
                canvas.height = newSize.height;
                offscreenCanvas.width = newSize.width;
                offscreenCanvas.height = newSize.height;

                // 重新渲染数字模板
                digitTemplates.clear();
                preRenderDigits();

                // 重新渲染
                renderClock();
            }
        }
    }, 250));
}

// 防抖函数
function debounce(func, wait) {
    let timeout;
    return function () {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
    };
}

// 预渲染数字模板
function preRenderDigits() {
    for (let i = 0; i < 11; i++) { // 0-9 和冒号
        const tempCanvas = document.createElement('canvas');
        const matrix = numberMatrix[i];
        const width = (i === 10 ? 4 : 7) * config.radius * 2;
        const height = 10 * config.radius * 2;

        tempCanvas.width = width;
        tempCanvas.height = height;
        const tempCtx = tempCanvas.getContext('2d');

        // 创建渐变
        const grd = tempCtx.createLinearGradient(0, 0, 0, height);
        grd.addColorStop(0, config.gradients[0].start);
        grd.addColorStop(1, config.gradients[0].end);

        // 设置发光效果
        if (config.glow.enabled) {
            tempCtx.shadowBlur = config.glow.blur;
            tempCtx.shadowColor = config.glow.color;
        }

        // 渲染数字
        for (let y = 0; y < matrix.length; y++) {
            for (let x = 0; x < matrix[y].length; x++) {
                if (matrix[y][x] === 1) {
                    tempCtx.beginPath();
                    tempCtx.fillStyle = grd;
                    tempCtx.arc(
                        config.radius + config.radius * 2 * x,
                        config.radius + config.radius * 2 * y,
                        config.radius, 0, 2 * Math.PI
                    );
                    tempCtx.fill();
                }
            }
        }

        // 缓存模板
        digitTemplates.set(i, tempCanvas);
    }
}

// 计算时钟数字总宽度
function calculateTotalWidth() {
    // 计算时钟数字总宽度（精确计算）
    const digitWidth = config.radius * 2 * 7; // 一个数字的宽度
    const colonWidth = config.radius * 2 * 4; // 冒号的宽度
    const spacing = config.numberSpacing; // 间距

    // 总宽度 = 6个数字 + 2个冒号 + 7个间距
    return (digitWidth * 6) + (colonWidth * 2) + (spacing * 7);
}

// 渲染时钟
function renderClock() {
    if (!isInitialized || !ctx || !offscreenContext) return;

    // 清除画布
    offscreenContext.clearRect(0, 0, offscreenCanvas.width, offscreenCanvas.height);

    const digits = [];

    // 获取当前时间
    const now = new Date();

    // 计算时钟总宽度
    const totalWidth = calculateTotalWidth();

    // 计算起始位置，使时钟居中
    let offsetX = Math.max(10, (offscreenCanvas.width - totalWidth) / 2);
    const offsetY = 20; // 顶部边距

    // 处理小时
    const hours = now.getHours();
    digits.push({ num: Math.floor(hours / 10), offsetX });
    offsetX = renderDigitFromTemplate(offsetX, offsetY, Math.floor(hours / 10));

    digits.push({ num: hours % 10, offsetX });
    offsetX = renderDigitFromTemplate(offsetX, offsetY, hours % 10);

    digits.push({ num: 10, offsetX }); // 冒号
    offsetX = renderDigitFromTemplate(offsetX, offsetY, 10);

    // 处理分钟
    const minutes = now.getMinutes();
    digits.push({ num: Math.floor(minutes / 10), offsetX });
    offsetX = renderDigitFromTemplate(offsetX, offsetY, Math.floor(minutes / 10));

    digits.push({ num: minutes % 10, offsetX });
    offsetX = renderDigitFromTemplate(offsetX, offsetY, minutes % 10);

    digits.push({ num: 10, offsetX }); // 冒号
    offsetX = renderDigitFromTemplate(offsetX, offsetY, 10);

    // 处理秒钟
    const seconds = now.getSeconds();
    digits.push({ num: Math.floor(seconds / 10), offsetX });
    offsetX = renderDigitFromTemplate(offsetX, offsetY, Math.floor(seconds / 10));

    digits.push({ num: seconds % 10, offsetX });
    renderDigitFromTemplate(offsetX, offsetY, seconds % 10);

    // 处理数字变化时的动画效果
    if (lastDigits.length === 0) {
        lastDigits = digits;
    } else {
        for (let i = 0; i < lastDigits.length; i++) {
            if (i < digits.length && lastDigits[i].num !== digits[i].num) {
                // 只在非移动设备或特定条件下添加粒子效果
                if (!isMobile || particles.length < config.performance.particleLimit / 2) {
                    addParticles(digits[i]);
                }
                lastDigits[i].num = digits[i].num;
            }
        }
    }

    // 渲染粒子
    if (particles.length > 0) {
        renderParticles();
        updateParticles();
    }

    // 将离屏画布内容复制到主画布
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.drawImage(offscreenCanvas, 0, 0);

    return now;
}

// 从模板渲染数字
function renderDigitFromTemplate(x, y, num) {
    const template = digitTemplates.get(num);
    if (template) {
        offscreenContext.drawImage(template, x, y);
        return x + template.width + config.numberSpacing;
    }
    return x;
}

// 添加粒子效果
function addParticles(digit) {
    // 限制粒子数量
    if (particles.length > config.performance.particleLimit) {
        return;
    }

    const matrix = numberMatrix[digit.num];
    const particleCount = isMobile ? 5 : 3; // 移动设备增加间隔，减少粒子

    // 估计将添加的粒子数量
    const estimatedNewParticles = Math.ceil((matrix.length * matrix[0].length) / (particleCount * particleCount));

    // 如果添加这些粒子会超过限制，则按比例减少
    if (particles.length + estimatedNewParticles > config.performance.particleLimit) {
        return; // 完全跳过添加粒子
    }

    // 随机选择点阵中的一部分点生成粒子，而不是按规则间隔
    const totalPoints = matrix.length * matrix[0].length;
    const pointsToGenerate = Math.min(12, totalPoints / 3); // 最多12个粒子

    const usedPositions = new Set();

    for (let p = 0; p < pointsToGenerate; p++) {
        // 随机选择位置
        let i, j, posKey;
        let attempts = 0;

        do {
            i = Math.floor(Math.random() * matrix.length);
            j = Math.floor(Math.random() * matrix[0].length);
            posKey = `${i}-${j}`;
            attempts++;
        } while ((attempts < 10) && (usedPositions.has(posKey) || matrix[i][j] !== 1));

        if (matrix[i][j] === 1) {
            usedPositions.add(posKey);

            // 创建粒子，但使用更低的初速度减少计算量
            const particle = {
                offsetX: digit.offsetX + config.radius + config.radius * 2 * j,
                offsetY: 30 + config.radius + config.radius * 2 * i,
                color: config.colors[Math.floor(Math.random() * config.colors.length)],
                g: 1.0 + Math.random() * 0.5, // 减小重力加速度
                vx: (Math.random() > 0.5 ? 1 : -1) * (1 + Math.random() * 2), // 减小水平速度
                vy: -3 - Math.random() * 2 // 减小垂直初速度
            };
            particles.push(particle);
        }
    }
}

// 渲染粒子 - 优化批处理
function renderParticles() {
    // 使用批处理减少绘图操作
    offscreenContext.save();

    // 按颜色分组批处理渲染
    const colorGroups = {};

    for (let i = 0; i < particles.length; i++) {
        const color = particles[i].color;
        if (!colorGroups[color]) {
            colorGroups[color] = [];
        }
        colorGroups[color].push(particles[i]);
    }

    // 一次性渲染同一颜色的所有粒子
    for (const color in colorGroups) {
        const group = colorGroups[color];
        offscreenContext.fillStyle = color;

        for (let i = 0; i < group.length; i++) {
            const p = group[i];
            offscreenContext.beginPath();
            offscreenContext.arc(p.offsetX, p.offsetY, config.radius, 0, 2 * Math.PI);
            offscreenContext.fill();
        }
    }

    offscreenContext.restore();
}

// 更新粒子位置 - 优化计算
function updateParticles() {
    // 如果粒子太多，直接丢弃一些
    if (particles.length > config.performance.particleLimit) {
        particles.length = config.performance.particleLimit;
    }

    let count = 0;
    const threshold = 50; // 存活时间阈值

    for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // 添加年龄追踪
        p.age = p.age || 0;
        p.age++;

        // 年龄过大的粒子直接移除
        if (p.age > threshold) {
            continue;
        }

        // 优化物理计算
        p.offsetX += p.vx;
        p.offsetY += p.vy;
        p.vy += p.g;

        // 简化碰撞检测
        if (p.offsetY > offscreenCanvas.height - config.radius) {
            p.offsetY = offscreenCanvas.height - config.radius;
            p.vy = -p.vy * 0.5; // 降低反弹系数
            p.age += 10; // 加速老化
        }

        // 简化边界检测
        if (p.offsetX > 0 &&
            p.offsetX < offscreenCanvas.width &&
            p.age < threshold) {
            particles[count++] = particles[i];
        }
    }

    // 一次性截断数组
    particles.length = count;
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
    // 移除#前缀如果存在
    hex = hex.replace(/^#/, '');

    // 解析十六进制颜色
    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;

    return { r, g, b };
} 