/**
 * 背景模块
 * 处理星空背景和动画效果
 */

// 星空背景配置
// 使用 Object.freeze 防止配置被意外修改,提高性能
const starfieldConfig = Object.freeze({
    starsCount: window.innerWidth < 768 ? 150 : 300, // 移动端减少星星数量
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
let offscreenCanvas; // 离屏Canvas
let offscreenContext; // 离屏Context
let lastRenderTime = 0; // 上次渲染时间
const targetFPS = 30; // 目标帧率
const frameInterval = 1000 / targetFPS; // 帧间隔

// 初始化函数
function initCanvas() {
    // 取消之前的动画
    if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
    }

    // 获取并设置画布
    canvas = document.getElementById('starfield');
    if (!canvas) return false;

    try {
        // 设置画布大小
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        context = canvas.getContext('2d', { alpha: false }); // 禁用alpha通道提高性能
        if (!context) throw new Error('无法获取canvas上下文');

        // 创建离屏Canvas
        offscreenCanvas = document.createElement('canvas');
        offscreenCanvas.width = canvas.width;
        offscreenCanvas.height = canvas.height;
        offscreenContext = offscreenCanvas.getContext('2d', { alpha: false });

        if (!offscreenContext) throw new Error('无法创建离屏canvas上下文');

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

    // 预先计算星星
    const starsBuffer = new Array(starfieldConfig.starsCount);

    for (let i = 0; i < starfieldConfig.starsCount; i++) {
        starsBuffer[i] = {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * starfieldConfig.maxStarRadius,
            color: `rgba(${Math.random() * 255 | 0},${Math.random() * 255 | 0},${Math.random() * 255 | 0},${starfieldConfig.starOpacity})`,
            speed: Math.random() * starfieldConfig.maxSpeed
        };
    }

    // 一次性赋值，减少GC压力
    stars = starsBuffer;

    // 开始动画
    lastRenderTime = performance.now();
    requestAnimationFrame(renderStars);
}

// 渲染星星
function renderStars(timestamp) {
    if (!canvas || !context || !isStarfieldActive) {
        if (animationId) {
            cancelAnimationFrame(animationId);
            animationId = null;
        }
        return;
    }

    // 控制帧率
    const elapsed = timestamp - lastRenderTime;
    if (elapsed < frameInterval) {
        animationId = requestAnimationFrame(renderStars);
        return;
    }

    // 更新上次渲染时间
    lastRenderTime = timestamp - (elapsed % frameInterval);

    // 清空离屏画布
    offscreenContext.fillStyle = starfieldConfig.backgroundColor;
    offscreenContext.fillRect(0, 0, canvas.width, canvas.height);

    // 批量绘制星星
    offscreenContext.beginPath();

    // 使用对象池模式避免频繁创建对象
    const starsLength = stars.length;
    for (let i = 0; i < starsLength; i++) {
        const star = stars[i];

        // 更新位置
        star.x -= star.speed;
        if (star.x < -2 * star.radius) {
            star.x = canvas.width;
        }

        // 添加星星路径
        offscreenContext.moveTo(star.x, star.y);
        offscreenContext.arc(star.x, star.y, star.radius * 2, 0, Math.PI * 2);
    }

    // 一次性填充所有星星
    offscreenContext.fillStyle = '#ffffff';
    offscreenContext.fill();

    // 将离屏canvas内容复制到主canvas
    context.drawImage(offscreenCanvas, 0, 0);

    // 继续动画
    animationId = requestAnimationFrame(renderStars);
}

// 加载背景图片
function loadBackgroundImage() {
    // 获取handleBackgroundImage函数
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

// 处理背景图片
const handleBackgroundImage = async () => {
    // 检查星空背景是否激活
    if (isStarfieldActive) {
        return; // 如果星空背景已激活，不加载背景图片
    }

    try {
        // 获取面板元素
        const panelElement = document.getElementById('panel');
        if (!panelElement) {
            console.error('找不到面板元素');
            return;
        }

        // 默认背景图片
        const defaultImage = 'images/photo.jpg';

        // 从会话存储中获取图片数据
        const imgUrls = JSON.parse(sessionStorage.getItem('imgUrls')) || [defaultImage];
        let index = parseInt(sessionStorage.getItem('index')) || 0;

        // 确保索引在有效范围内
        index = index >= imgUrls.length ? 0 : index;

        // 更新背景图片
        const updateBackground = (url) => {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = () => {
                    panelElement.style.background = `url('${url}') center center no-repeat #666`;
                    panelElement.style.backgroundSize = 'cover';
                    panelElement.style.transition = 'background 0.3s ease-in-out';
                    resolve();
                };
                img.onerror = () => {
                    console.warn('背景图片加载失败:', url);
                    reject();
                };
                img.src = url;
            });
        };

        // 尝试加载当前图片
        await updateBackground(imgUrls[index]).catch(async () => {
            // 如果当前图片加载失败，使用默认图片
            console.warn('使用默认背景图片');
            await updateBackground(defaultImage);
            // 重置会话存储
            sessionStorage.setItem('imgUrls', JSON.stringify([defaultImage]));
            sessionStorage.setItem('index', '0');
            return;
        });

        // 更新索引
        index = (index + 1) % imgUrls.length;
        sessionStorage.setItem('index', index.toString());

    } catch (error) {
        console.error('背景图片处理失败:', error);
        // 使用默认样式
        const panelElement = document.getElementById('panel');
        if (panelElement) {
            panelElement.style.background = '#666';
        }
    }
};

// 窗口大小改变时重新初始化
function handleResize() {
    if (initCanvas()) {
        createStars();
    }
}

// 导出初始化函数
export function initBackground() {
    // 检测设备性能
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isLowPerfDevice = isMobile || (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4);

    // 如果是低性能设备，减少动画效果
    if (isLowPerfDevice) {
        // 可以选择不初始化星空背景，直接使用静态背景图片
        loadBackgroundImage();
        return;
    }

    // 初始化画布
    if (initCanvas()) {
        createStars();
    }

    // 监听窗口大小变化
    // 使用防抖优化resize事件处理
    let resizeTimeout;
    window.addEventListener('resize', () => {
        if (resizeTimeout) {
            clearTimeout(resizeTimeout);
        }
        resizeTimeout = setTimeout(handleResize, 250);
    });

    // 监听页面可见性变化，优化性能
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            // 页面不可见时暂停动画
            if (animationId) {
                cancelAnimationFrame(animationId);
                animationId = null;
            }
        } else {
            // 页面可见时恢复动画
            if (isStarfieldActive && !animationId) {
                lastRenderTime = performance.now();
                animationId = requestAnimationFrame(renderStars);
            }
        }
    });

    // 导出星空背景状态，供其他模块使用
    window.isStarfieldActive = () => isStarfieldActive;
} 