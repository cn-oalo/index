/**
 * 访客信息模块
 * 获取并显示访客信息
 * 优化性能，使用缓存和延迟加载
 */

// 缓存时间（毫秒）
const CACHE_DURATION = 3600000; // 1小时

// 导出初始化函数
export function initVisitorInfo() {
    // 延迟加载访客信息，优先显示页面主体内容
    setTimeout(() => {
        // 尝试从本地存储加载缓存的数据
        const cachedData = loadFromCache();
        if (cachedData) {
            displayVisitorInfo(cachedData);
            // 在后台更新数据，不影响用户体验
            setTimeout(() => fetchVisitorInfo(true), 3000);
        } else {
            // 没有缓存数据，获取新数据
            fetchVisitorInfo(false);
        }
    }, 1000);
}

// 从缓存加载数据
function loadFromCache() {
    try {
        const cachedData = localStorage.getItem('visitorInfo');
        if (!cachedData) return null;

        const data = JSON.parse(cachedData);
        const timestamp = data.timestamp || 0;
        const now = Date.now();

        // 检查缓存是否过期
        if (now - timestamp < CACHE_DURATION) {
            return data;
        }
        return null;
    } catch (error) {
        console.warn('访客信息缓存读取失败:', error);
        return null;
    }
}

// 保存数据到缓存
function saveToCache(data) {
    try {
        // 添加时间戳
        data.timestamp = Date.now();
        localStorage.setItem('visitorInfo', JSON.stringify(data));
    } catch (error) {
        console.warn('访客信息缓存保存失败:', error);
    }
}

// 获取访客信息
async function fetchVisitorInfo(isBackgroundUpdate = false) {
    try {
        const visitorInfoContainer = document.querySelector('.visitor-info');
        if (!visitorInfoContainer) {
            console.warn('访客信息容器不存在');
            return;
        }

        // 获取操作系统信息
        const userAgent = navigator.userAgent;
        const osInfo = getOSInfo(userAgent);

        // 如果不是后台更新，先显示系统信息和问候语
        if (!isBackgroundUpdate) {
            // 更新问候语
            const greetingElement = visitorInfoContainer.querySelector('.visitor-info-greeting');
            greetingElement.textContent = getGreeting();

            // 更新系统信息
            const systemElement = visitorInfoContainer.querySelector('.system-info .visitor-info-text');
            systemElement.textContent = `系统: ${osInfo}`;

            // 显示加载状态
            const ipElement = visitorInfoContainer.querySelector('.ip-info .visitor-info-text');
            const locationElement = visitorInfoContainer.querySelector('.location-info .visitor-info-text');
            const ispElement = visitorInfoContainer.querySelector('.isp-info .visitor-info-text');

            ipElement.textContent = '正在获取IP信息...';
            locationElement.textContent = '正在获取位置信息...';
            ispElement.textContent = '正在获取ISP信息...';
        }

        // 使用ip.cn的API获取IP信息
        let ipInfo = null;
        try {
            // 设置超时
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000);

            // 使用ip.cn的API获取IP信息
            const response = await fetch('https://my.ip.cn/json/', {
                signal: controller.signal
            });
            clearTimeout(timeoutId);

            const data = await response.json();

            if (data && data.status === true && data.data) {
                // 提取需要的信息
                const ipData = data.data;

                ipInfo = {
                    ip: ipData.ip || '未知',
                    region: ipData.country && ipData.province ?
                        `${ipData.country} ${ipData.province} ${ipData.city || ''} ${ipData.district || ''}`.trim() : '未知地区',
                    isp: ipData.isp || '未知',
                    osInfo: osInfo
                };

                // 保存到缓存
                saveToCache(ipInfo);
            }
        } catch (error) {
            console.warn('IP信息获取失败:', error);
        }

        // 如果是后台更新且没有成功获取数据，直接返回
        if (isBackgroundUpdate && !ipInfo) {
            return;
        }

        // 如果不是后台更新，更新UI
        if (!isBackgroundUpdate) {
            displayVisitorInfo(ipInfo || {
                ip: '未知',
                region: '未知地区',
                isp: '未知',
                osInfo: osInfo
            });
        }
    } catch (error) {
        console.warn('获取访客信息失败:', error);

        // 如果不是后台更新，至少显示基本信息
        if (!isBackgroundUpdate) {
            const visitorInfoContainer = document.querySelector('.visitor-info');
            if (visitorInfoContainer) {
                const greetingElement = visitorInfoContainer.querySelector('.visitor-info-greeting');
                const systemElement = visitorInfoContainer.querySelector('.system-info .visitor-info-text');
                const ipElement = visitorInfoContainer.querySelector('.ip-info .visitor-info-text');
                const locationElement = visitorInfoContainer.querySelector('.location-info .visitor-info-text');
                const ispElement = visitorInfoContainer.querySelector('.isp-info .visitor-info-text');

                // 获取基本信息
                const osInfo = getOSInfo(navigator.userAgent);

                // 更新显示
                greetingElement.textContent = getGreeting();
                systemElement.textContent = `系统: ${osInfo}`;
                ipElement.textContent = 'IP信息获取失败';
                locationElement.textContent = '位置信息获取失败';
                ispElement.textContent = 'ISP信息获取失败';
            }
        }
    }
}

// 显示访客信息
function displayVisitorInfo(data) {
    const visitorInfoContainer = document.querySelector('.visitor-info');
    if (!visitorInfoContainer) return;

    const greetingElement = visitorInfoContainer.querySelector('.visitor-info-greeting');
    const ipElement = visitorInfoContainer.querySelector('.ip-info .visitor-info-text');
    const locationElement = visitorInfoContainer.querySelector('.location-info .visitor-info-text');
    const ispElement = visitorInfoContainer.querySelector('.isp-info .visitor-info-text');
    const systemElement = visitorInfoContainer.querySelector('.system-info .visitor-info-text');

    // 更新问候语
    greetingElement.textContent = getGreeting();

    // 更新IP信息
    ipElement.textContent = `IP: ${data.ip || '未知'}`;
    locationElement.textContent = `位置: ${data.region || '未知地区'}`;
    ispElement.textContent = `ISP: ${data.isp || '未知'}`;

    // 更新系统信息
    if (data.osInfo) {
        systemElement.textContent = `系统: ${data.osInfo}`;
    }
}

// 获取操作系统信息
function getOSInfo(userAgent) {
    let systemInfo = '未知系统';

    // 检测操作系统
    if (userAgent.includes('Windows')) {
        systemInfo = userAgent.includes('Windows NT 10.0') ? 'Windows 10' :
            userAgent.includes('Windows NT 6.3') ? 'Windows 8.1' :
                userAgent.includes('Windows NT 6.2') ? 'Windows 8' :
                    userAgent.includes('Windows NT 6.1') ? 'Windows 7' :
                        userAgent.includes('Windows NT 6.0') ? 'Windows Vista' :
                            userAgent.includes('Windows NT 5.1') ? 'Windows XP' : 'Windows';
    } else if (userAgent.includes('Mac')) {
        systemInfo = 'macOS';
    } else if (userAgent.includes('Android')) {
        systemInfo = 'Android';
    } else if (userAgent.includes('iPhone') || userAgent.includes('iPad')) {
        systemInfo = 'iOS';
    } else if (userAgent.includes('Linux')) {
        systemInfo = 'Linux';
    }

    // 检测浏览器
    let browserInfo = '未知浏览器';
    if (userAgent.includes('Chrome') && !userAgent.includes('Edg')) {
        browserInfo = 'Chrome';
    } else if (userAgent.includes('Firefox')) {
        browserInfo = 'Firefox';
    } else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
        browserInfo = 'Safari';
    } else if (userAgent.includes('Edg')) {
        browserInfo = 'Edge';
    } else if (userAgent.includes('MSIE') || userAgent.includes('Trident/')) {
        browserInfo = 'Internet Explorer';
    }

    return `${systemInfo} / ${browserInfo}`;
}

// 获取问候语
function getGreeting() {
    const hour = new Date().getHours();
    let greeting = '';
    let emoji = '';

    if (hour >= 5 && hour < 12) {
        greeting = '早上好';
        emoji = '🌞';
    } else if (hour >= 12 && hour < 14) {
        greeting = '中午好';
        emoji = '☀️';
    } else if (hour >= 14 && hour < 18) {
        greeting = '下午好';
        emoji = '🌤️';
    } else if (hour >= 18 && hour < 22) {
        greeting = '晚上好';
        emoji = '🌙';
    } else {
        greeting = '夜深了';
        emoji = '🌛';
    }

    return `${emoji} ${greeting}，欢迎访问`;
} 