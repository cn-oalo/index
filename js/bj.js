// 星空背景配置
// 使用 Object.freeze 防止配置被意外修改,提高性能
const starfieldConfig = Object.freeze({
    starsCount: 300,
    backgroundColor: '#0e1729',
    maxStarRadius: 0.8,
    maxSpeed: 0.5,
    starOpacity: 0.8
});

// 画布相关变量
let canvas;
let context;
let stars = [];
let animationId;
let isStarfieldActive = false; // 添加星空背景状态标志

// 初始化函数
function initCanvas() {
    // 取消之前的动画
    if (animationId) {
        cancelAnimationFrame(animationId);
    }

    // 获取并设置画布
    canvas = document.getElementById('starfield');
    if (!canvas) return false;

    try {
        // 设置画布大小
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        context = canvas.getContext('2d');
        if (!context) throw new Error('无法获取canvas上下文');

        stars = [];
        isStarfieldActive = true; // 标记星空背景已激活

        // 隐藏背景图片元素
        const panel = document.getElementById('panel');
        if (panel) {
            panel.style.background = 'none';
        }

        return true;
    } catch (error) {
        console.warn('星空背景初始化失败:', error);
        isStarfieldActive = false;
        // 如果星空背景失败，启用背景图片
        loadBackgroundImage();
        return false;
    }
}

// 创建星星
function createStars() {
    if (!canvas || !context || !isStarfieldActive) return;

    for (let i = 0; i < starfieldConfig.starsCount; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * starfieldConfig.maxStarRadius,
            color: `rgba(${Math.random() * 255 | 0},${Math.random() * 255 | 0},${Math.random() * 255 | 0},${starfieldConfig.starOpacity})`,
            speed: Math.random() * starfieldConfig.maxSpeed
        });
    }

    // 开始动画
    requestAnimationFrame(renderStars);
}

// 渲染星星
function renderStars() {
    if (!canvas || !context || !isStarfieldActive) {
        if (animationId) {
            cancelAnimationFrame(animationId);
            animationId = null;
        }
        return;
    }

    // 使用离屏canvas优化渲染
    const offscreenCanvas = document.createElement('canvas');
    offscreenCanvas.width = canvas.width;
    offscreenCanvas.height = canvas.height;
    const offscreenContext = offscreenCanvas.getContext('2d');

    // 清空离屏画布
    offscreenContext.fillStyle = starfieldConfig.backgroundColor;
    offscreenContext.fillRect(0, 0, canvas.width, canvas.height);

    // 批量绘制星星
    offscreenContext.beginPath();
    stars.forEach(star => {
        // 更新位置
        star.x -= star.speed;
        if (star.x < -2 * star.radius) {
            star.x = canvas.width;
        }

        // 添加星星路径
        offscreenContext.moveTo(star.x, star.y);
        offscreenContext.arc(star.x, star.y, star.radius * 2, 0, Math.PI * 2);
    });

    // 一次性填充所有星星
    offscreenContext.fillStyle = '#ffffff';
    offscreenContext.fill();

    // 将离屏canvas内容复制到主canvas
    context.drawImage(offscreenCanvas, 0, 0);

    // 继续动画，使用防抖优化
    animationId = window.requestAnimationFrame(renderStars);
}

// 加载背景图片
function loadBackgroundImage() {
    // 获取main.js中的handleBackgroundImage函数
    if (typeof handleBackgroundImage === 'function') {
        handleBackgroundImage();
    } else {
        // 如果找不到handleBackgroundImage函数，使用默认背景
        const panel = document.getElementById('panel');
        if (panel) {
            panel.style.background = starfieldConfig.backgroundColor;
        }
    }
}

// 窗口大小改变时重新初始化
function handleResize() {
    if (initCanvas()) {
        createStars();
    }
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    if (initCanvas()) {
        createStars();
    }
});

// 监听窗口大小变化
// 使用防抖优化resize事件处理
let resizeTimeout;
window.addEventListener('resize', () => {
    if (resizeTimeout) {
        clearTimeout(resizeTimeout);
    }
    resizeTimeout = setTimeout(handleResize, 250);
});

// 导出星空背景状态，供其他模块使用
window.isStarfieldActive = () => isStarfieldActive;
