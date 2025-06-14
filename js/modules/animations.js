/**
 * 动画模块
 * 处理页面动画效果，优化用户体验
 */

// 初始化动画
export function initAnimations() {
    // 添加页面进入动画
    document.addEventListener('DOMContentLoaded', () => {
        // 延迟执行以确保DOM完全加载
        setTimeout(() => {
            // 初始化滚动动画
            initScrollAnimations();

            // 初始化悬停动画
            initHoverAnimations();
        }, 100);
    });

    // 初始化交叉观察器实现渐入效果
    initIntersectionObserver();

    // 初始化移动菜单动画
    initMobileMenuAnimation();
}

// 初始化交叉观察器实现渐入效果
function initIntersectionObserver() {
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1
        });

        // 为所有需要动画的元素添加观察
        document.querySelectorAll('.panel-title, .panel-description, .navigation-wrapper, .profile-image')
            .forEach(el => {
                observer.observe(el);
            });
    } else {
        // 如果不支持 IntersectionObserver，直接添加动画类
        document.querySelectorAll('.panel-title, .panel-description, .navigation-wrapper, .profile-image')
            .forEach(el => {
                el.classList.add('fade-in');
            });
    }
}

// 初始化滚动动画
function initScrollAnimations() {
    // 检查浏览器是否支持 Intersection Observer
    if ('IntersectionObserver' in window) {
        const animatedElements = document.querySelectorAll('.animate__animated:not(.animate__fadeIn):not(.animate__fadeInUp)');

        const animationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // 当元素进入视口时，添加动画类
                    const element = entry.target;

                    // 如果元素没有指定动画，则默认使用淡入动画
                    if (!element.classList.contains('animate__fadeIn') &&
                        !element.classList.contains('animate__fadeInUp')) {
                        element.classList.add('animate__fadeIn');
                    }

                    // 移除观察
                    animationObserver.unobserve(element);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        // 开始观察所有动画元素
        animatedElements.forEach(element => {
            animationObserver.observe(element);
        });
    }
}

// 初始化悬停动画
function initHoverAnimations() {
    // 为导航项添加悬停效果
    const navigationItems = document.querySelectorAll('.navigation__item a');

    navigationItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            item.classList.add('pulse');
        });

        item.addEventListener('mouseleave', () => {
            setTimeout(() => {
                item.classList.remove('pulse');
            }, 300);
        });
    });

    // 为头像添加悬停效果
    const profileImage = document.querySelector('.profile-image');

    if (profileImage) {
        profileImage.addEventListener('mouseenter', () => {
            profileImage.classList.add('animate__pulse');
        });

        profileImage.addEventListener('mouseleave', () => {
            setTimeout(() => {
                profileImage.classList.remove('animate__pulse');
            }, 300);
        });
    }
}

// 初始化移动菜单动画
function initMobileMenuAnimation() {
    // 创建移动菜单按钮
    createMobileMenuButton();

    // 绑定菜单按钮事件
    const menuButton = document.querySelector('.btn-mobile-menu__icon');
    if (menuButton) {
        menuButton.addEventListener('click', toggleMobileMenu);
    }
}

// 创建移动菜单按钮
function createMobileMenuButton() {
    // 只在移动设备上创建
    if (window.innerWidth <= 768) {
        const mobileMenuButton = document.createElement('div');
        mobileMenuButton.className = 'btn-mobile-menu';
        mobileMenuButton.innerHTML = '<div class="btn-mobile-menu__icon"><i class="fas fa-bars"></i></div>';

        document.body.appendChild(mobileMenuButton);
    }
}

// 切换移动菜单
function toggleMobileMenu() {
    const navigationWrapper = document.querySelector('.navigation-wrapper');
    const menuIcon = document.querySelector('.btn-mobile-menu__icon i');

    if (navigationWrapper && menuIcon) {
        if (navigationWrapper.classList.contains('visible')) {
            // 收起菜单
            navigationWrapper.addEventListener('animationend', function handler() {
                navigationWrapper.classList.remove('visible', 'animated', 'bounceOutUp');
                navigationWrapper.removeEventListener('animationend', handler);
            });

            navigationWrapper.classList.add('animated', 'bounceOutUp');
            menuIcon.className = 'fas fa-bars animated fadeIn';
        } else {
            // 展开菜单
            navigationWrapper.classList.add('visible', 'animated', 'bounceInDown');
            menuIcon.className = 'fas fa-times animated fadeIn';
        }
    }
} 