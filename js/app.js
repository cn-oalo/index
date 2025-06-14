/**
 * 主应用入口文件
 * 使用ES模块化结构组织代码
 */

// 导入模块
import { initBackground } from './modules/background.js';
import { initClock } from './modules/clock.js';
import { initHitokoto } from './modules/hitokoto.js';
import { initVisitorInfo } from './modules/visitor-info.js';
import { initAnimations } from './modules/animations.js';
import { initLazyLoading } from './modules/lazy-loading.js';
import { initSocial } from './modules/social.js';
import { initProtect } from './modules/protect.js'; // 导入保护模块初始化函数

// 当DOM加载完成后初始化应用
document.addEventListener('DOMContentLoaded', () => {
    // 初始化各个模块
    initBackground();
    initClock();
    initHitokoto();
    initVisitorInfo();
    initAnimations();
    initLazyLoading();
    initSocial();
    initProtect(); // 初始化保护模块

    // 初始化加载指示器
    initLoadingIndicator();

    // 更新底部版权年份
    updateCopyrightYear();

    // 记录性能指标
    logPerformanceMetrics();
});

// 初始化加载指示器
function initLoadingIndicator() {
    window.addEventListener('load', () => {
        setTimeout(() => {
            document.body.classList.add('loaded');
        }, 500);
    });
}

// 更新底部版权年份
function updateCopyrightYear() {
    // 修改为匹配新的HTML结构
    const copyrightElement = document.querySelector('.footer-content span');
    if (copyrightElement) {
        const currentYear = new Date().getFullYear();
        const startYear = 2020;
        const copyrightText = copyrightElement.innerHTML;

        // 替换年份部分
        if (currentYear === startYear) {
            copyrightElement.innerHTML = copyrightText.replace(/© \d{4}(-\d{4})?/, `© ${startYear}`);
        } else {
            copyrightElement.innerHTML = copyrightText.replace(/© \d{4}(-\d{4})?/, `© ${startYear}-${currentYear}`);
        }
    }
}

// 记录页面加载性能指标
function logPerformanceMetrics() {
    window.addEventListener('load', () => {
        if ('performance' in window) {
            setTimeout(() => {
                const perfData = window.performance.timing;
                const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
                const domReadyTime = perfData.domComplete - perfData.domLoading;

                console.log(`页面加载时间: ${pageLoadTime}ms`);
                console.log(`DOM处理时间: ${domReadyTime}ms`);

                // 如果页面加载时间过长，可以考虑进一步优化
                if (pageLoadTime > 3000) {
                    console.warn('页面加载时间过长，请考虑进一步优化');
                }
            }, 0);
        }
    });
}