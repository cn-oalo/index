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

    // 记录性能指标
    logPerformanceMetrics();
});

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
            }, 0);
        }
    });
}