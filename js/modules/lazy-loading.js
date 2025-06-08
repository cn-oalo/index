/**
 * 懒加载模块
 * 优化图片加载性能
 */

// 初始化懒加载
export function initLazyLoading() {
    if ("loading" in HTMLImageElement.prototype) {
        // 如果浏览器支持原生懒加载
        enableNativeLazyLoading();
    } else if ("IntersectionObserver" in window) {
        // 使用 IntersectionObserver 实现懒加载
        enableIntersectionObserverLazyLoading();
    } else {
        // 降级方案：简单的滚动事件监听
        enableFallbackLazyLoading();
    }
}

// 启用原生懒加载
function enableNativeLazyLoading() {
    const images = document.querySelectorAll("img[data-src]");
    images.forEach(img => {
        img.src = img.dataset.src;
        img.removeAttribute("data-src");
    });
}

// 使用 IntersectionObserver 实现懒加载
function enableIntersectionObserverLazyLoading() {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute("data-src");
                img.classList.add("loaded");
                imageObserver.unobserve(img);
            }
        });
    }, {
        rootMargin: "50px 0px" // 提前50px加载
    });

    document.querySelectorAll("img[data-src]").forEach(img => {
        imageObserver.observe(img);
    });
}

// 降级方案：简单的滚动事件监听
function enableFallbackLazyLoading() {
    const images = document.querySelectorAll("img[data-src]");
    let active = false;

    const lazyLoad = () => {
        if (active === false) {
            active = true;

            setTimeout(() => {
                images.forEach(img => {
                    if ((img.getBoundingClientRect().top <= window.innerHeight && img.getBoundingClientRect().bottom >= 0) && getComputedStyle(img).display !== "none") {
                        img.src = img.dataset.src;
                        img.removeAttribute("data-src");
                        img.classList.add("loaded");

                        // 如果所有图片都已加载，移除滚动监听
                        if (document.querySelectorAll("img[data-src]").length === 0) {
                            document.removeEventListener("scroll", lazyLoad);
                            window.removeEventListener("resize", lazyLoad);
                            window.removeEventListener("orientationchange", lazyLoad);
                        }
                    }
                });

                active = false;
            }, 200);
        }
    };

    // 添加事件监听
    document.addEventListener("scroll", lazyLoad);
    window.addEventListener("resize", lazyLoad);
    window.addEventListener("orientationchange", lazyLoad);

    // 初始触发一次
    lazyLoad();
} 