/**
 * 图片懒加载模块
 * 使用 Intersection Observer API 实现高性能的图片懒加载
 */

export function initLazyLoading() {
    // 检查浏览器是否支持 Intersection Observer
    if ('IntersectionObserver' in window) {
        const lazyImages = document.querySelectorAll('.lazy-load');

        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                // 当元素进入视口
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const src = img.getAttribute('data-src');

                    if (src) {
                        // 设置图片源
                        img.src = src;

                        // 图片加载完成后添加loaded类
                        img.onload = () => {
                            img.classList.add('loaded');
                        };

                        // 停止观察该元素
                        observer.unobserve(img);
                    }
                }
            });
        }, {
            // 配置选项
            rootMargin: '0px 0px 200px 0px', // 提前200px加载
            threshold: 0.01 // 当1%的元素可见时触发
        });

        // 开始观察所有懒加载图片
        lazyImages.forEach(img => {
            imageObserver.observe(img);
        });
    } else {
        // 对于不支持Intersection Observer的浏览器，立即加载所有图片
        loadAllImages();
    }
}

// 回退方案：直接加载所有图片
function loadAllImages() {
    const lazyImages = document.querySelectorAll('.lazy-load');

    lazyImages.forEach(img => {
        const src = img.getAttribute('data-src');
        if (src) {
            img.src = src;
            img.classList.add('loaded');
        }
    });
} 