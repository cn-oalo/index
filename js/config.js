// 配置对象
const config = {
    title: 'R Aries',
    subtitle: ['欲卖桂花同载酒，终不似，少年游！', '浮世景色百千年依旧，人之在世却如白露与泡影，虚无'],
    defaultDescription: '因为你在，我不是太阳，而是化作星辰，与你遨游星空。<br>-「<strong>原创</strong>」',
    links: {
        blog: 'https://blog.oalo.cn',
        resume: 'resume.html',
        douyin: 'https://v.douyin.com/hU1qpMX/',
        friends: 'https://blog.oalo.cn/friends.html',
        cloud: 'https://cloud.oalo.cn'
    },
    social: {
        github: 'https://github.com/',
        qq: '674401983',
        email: 'admin@oalo.cn'
    },
    avatar: 'https://q1.qlogo.cn/g?b=qq&nk=674401983&s=100',
    avatarGif: 'images/kl.gif'
};

// DOM加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    // 初始化打字效果
    initTypewriter();
    // 初始化访客信息
    fetchVisitorInfo();
    // 初始化一言
    fetchHitokoto();
    // 初始化背景
    handleBackgroundImage();
    // 初始化图片懒加载
    initLazyLoading();
    // 更新版权年份
    updateCopyright();
});

// 导出配置供其他模块使用
window.siteConfig = config;
