/**
 * 访客信息模块
 * 获取并显示访客信息
 */

// 初始化访客信息
export function initVisitorInfo() {
    // 延迟加载访客信息，优先加载核心内容
    setTimeout(() => {
        fetchVisitorInfo();
    }, 800);
}

// 获取访客信息
async function fetchVisitorInfo() {
    try {
        const visitorInfoContainer = document.querySelector('.visitor-info');
        if (!visitorInfoContainer) {
            console.warn('访客信息容器不存在');
            return;
        }// 获取操作系统信息
        const userAgent = navigator.userAgent;
        const osInfo = getOSInfo(userAgent);

        // 使用ip.cn的API获取IP信息
        let ipInfo = null;
        try {
            // 使用ip.cn的API获取IP信息
            const response = await fetch('https://my.ip.cn/json/');
            const data = await response.json();

            if (data && data.status === true && data.data) {
                // 提取需要的信息
                const ipData = data.data;

                ipInfo = {
                    ip: ipData.ip || '未知',
                    region: ipData.country && ipData.province ?
                        `${ipData.country} ${ipData.province} ${ipData.city || ''} ${ipData.district || ''}`.trim() : '未知地区',
                    isp: ipData.isp || '未知'
                };
            }
        } catch (error) {
            console.warn('IP信息获取失败:', error);
        }        // 更新访客信息内容
        const greetingElement = visitorInfoContainer.querySelector('.visitor-info-greeting');
        const ipElement = visitorInfoContainer.querySelector('.ip-info .visitor-info-text');
        const locationElement = visitorInfoContainer.querySelector('.location-info .visitor-info-text');
        const ispElement = visitorInfoContainer.querySelector('.isp-info .visitor-info-text');
        const systemElement = visitorInfoContainer.querySelector('.system-info .visitor-info-text');

        // 更新问候语
        greetingElement.textContent = getGreeting();

        // 更新IP信息
        if (ipInfo) {
            ipElement.textContent = `IP: ${ipInfo.ip}`;
            locationElement.textContent = `位置: ${ipInfo.region}`;
            if (ipInfo.isp) {
                ispElement.textContent = `ISP: ${ipInfo.isp}`;
            } else {
                ispElement.parentElement.style.display = 'none';
            }
        }

        // 更新系统信息
        systemElement.textContent = `系统: ${osInfo}`;

    } catch (error) {
        console.warn('获取访客信息失败:', error);        // 如果出错，至少显示基本信息
        const visitorInfoContainer = document.querySelector('.visitor-info');
        if (visitorInfoContainer) {
            const greetingElement = visitorInfoContainer.querySelector('.visitor-info-greeting');
            const ipElement = visitorInfoContainer.querySelector('.ip-info .visitor-info-text');
            const locationElement = visitorInfoContainer.querySelector('.location-info .visitor-info-text');
            const ispElement = visitorInfoContainer.querySelector('.isp-info');
            const systemElement = visitorInfoContainer.querySelector('.system-info .visitor-info-text');

            // 获取基本信息
            const osInfo = getOSInfo(navigator.userAgent);
            
            // 更新显示
            greetingElement.textContent = getGreeting();
            ipElement.textContent = 'IP信息获取失败';
            locationElement.parentElement.style.display = 'none';
            ispElement.style.display = 'none';
            systemElement.textContent = `系统: ${osInfo}`;
        }
    }
}

// 获取操作系统信息
function getOSInfo(userAgent) {
    const os = {
        'Windows': /Windows NT/i,
        'Mac': /Macintosh/i,
        'Linux': /Linux/i,
        'Android': /Android/i,
        'iOS': /iPhone|iPad|iPod/i
    };

    for (const [osName, regex] of Object.entries(os)) {
        if (regex.test(userAgent)) {
            return osName;
        }
    }

    return '未知系统';
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