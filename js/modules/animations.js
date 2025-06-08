/**
 * 动画模块
 * 处理页面动画效果
 */

// 初始化动画
export function initAnimations() {
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