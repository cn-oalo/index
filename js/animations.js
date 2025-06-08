// 动画效果控制
const iUp = (() => {
    let t = 0;
    const d = 150;

    return {
        clean: () => t = 0,
        up: (e) => {
            setTimeout(() => e.classList.add("up"), t);
            t += d;
        },
        down: (e) => e.classList.remove("up"),
        toggle: (e) => {
            setTimeout(() => e.classList.toggle("up"), t);
            t += d;
        }
    };
})();

// 在DOM加载完成后执行
document.addEventListener('DOMContentLoaded', () => {
    // 初始化动画
    document.querySelectorAll(".iUp").forEach(el => iUp.up(el));

    // 头像加载完成后显示
    const avatarElement = document.querySelector('.js-avatar');
    if (avatarElement) {
        avatarElement.addEventListener('load', () => avatarElement.classList.add("show"));
    }
}); 