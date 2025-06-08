// 获取访客信息
const fetchVisitorInfo = async () => {
    try {
        // 创建访客信息容器
        const visitorInfoContainer = document.createElement('div');
        visitorInfoContainer.className = 'visitor-info';
        visitorInfoContainer.innerHTML = `
            <div class="visitor-info-content">
                <div class="visitor-info-item">正在获取数据...</div>
            </div>
        `;

        // 先添加到页面，显示加载状态
        // 查找panel-cover__description元素的父元素，确保居中显示
        const panelContent = document.querySelector('.panel-main__content');
        if (panelContent) {
            // 创建一个专门的容器来居中显示访客信息
            const visitorContainer = document.createElement('div');
            visitorContainer.style.display = 'flex';
            visitorContainer.style.justifyContent = 'center';
            visitorContainer.style.width = '100%';
            visitorContainer.appendChild(visitorInfoContainer);

            // 插入到description元素之后
            const descriptionElement = document.getElementById('description');
            if (descriptionElement) {
                panelContent.insertBefore(visitorContainer, descriptionElement.nextSibling);
            } else {
                panelContent.appendChild(visitorContainer);
            }
        } else {
            // 回退方案：如果找不到panel-content，使用原来的逻辑
            const descriptionElement = document.getElementById('description');
            if (descriptionElement && descriptionElement.parentNode) {
                descriptionElement.parentNode.insertBefore(visitorInfoContainer, descriptionElement.nextSibling);
            }
        }

        // 获取操作系统信息
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
            console.warn('ip.cn API请求失败:', error);
        }

        // 更新访客信息内容
        const contentElement = visitorInfoContainer.querySelector('.visitor-info-content');

        // 获取问候语
        const greeting = getGreeting();

        // 更新内容
        contentElement.innerHTML = `
            <div class="visitor-info-greeting">${greeting}</div>
            ${ipInfo ? `
                <div class="visitor-info-item"><span class="visitor-info-icon">🌐</span> IP: ${ipInfo.ip}</div>
                <div class="visitor-info-item"><span class="visitor-info-icon">📍</span> 位置: ${ipInfo.region}</div>
                ${ipInfo.isp ? `<div class="visitor-info-item"><span class="visitor-info-icon">🏢</span> ISP: ${ipInfo.isp}</div>` : ''}
            ` : ''}
            <div class="visitor-info-item"><span class="visitor-info-icon">🖥️</span> 系统: ${osInfo}</div>
        `;

    } catch (error) {
        console.warn('获取访客信息失败:', error);

        // 如果出错，至少显示基本信息
        const visitorInfoContainer = document.querySelector('.visitor-info');
        if (visitorInfoContainer) {
            const contentElement = visitorInfoContainer.querySelector('.visitor-info-content');

            if (contentElement) {
                const userAgent = navigator.userAgent;
                const osInfo = getOSInfo(userAgent);

                // 获取问候语
                const greeting = getGreeting();

                contentElement.innerHTML = `
                    <div class="visitor-info-greeting">${greeting}</div>
                    <div class="visitor-info-item"><span class="visitor-info-icon">⚠️</span> IP信息获取失败</div>
                    <div class="visitor-info-item"><span class="visitor-info-icon">🖥️</span> 系统: ${osInfo}</div>
                `;
            }
        }
    }
};

// 获取操作系统信息
const getOSInfo = (userAgent) => {
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
};

// 获取问候语
const getGreeting = () => {
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
};

// 在DOM加载完成后执行
document.addEventListener('DOMContentLoaded', () => {
    fetchVisitorInfo();
}); 