// 处理背景图片
const handleBackgroundImage = async () => {
    // 检查星空背景是否激活
    if (window.isStarfieldActive && window.isStarfieldActive()) {
        return; // 如果星空背景已激活，不加载背景图片
    }

    try {
        // 获取面板元素
        const panelElement = document.getElementById('panel');
        if (!panelElement) {
            console.error('找不到面板元素');
            return;
        }

        // 默认背景图片
        const defaultImage = '/images/photo.jpg';

        // 从会话存储中获取图片数据
        const imgUrls = JSON.parse(sessionStorage.getItem('imgUrls')) || [defaultImage];
        let index = parseInt(sessionStorage.getItem('index')) || 0;

        // 确保索引在有效范围内
        index = index >= imgUrls.length ? 0 : index;

        // 更新背景图片
        const updateBackground = (url) => {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = () => {
                    panelElement.style.background = `url('${url}') center center no-repeat #666`;
                    panelElement.style.backgroundSize = 'cover';
                    panelElement.style.transition = 'background 0.3s ease-in-out';
                    resolve();
                };
                img.onerror = () => {
                    console.warn('背景图片加载失败:', url);
                    reject();
                };
                img.src = url;
            });
        };

        // 尝试加载当前图片
        await updateBackground(imgUrls[index]).catch(async () => {
            // 如果当前图片加载失败，使用默认图片
            console.warn('使用默认背景图片');
            await updateBackground(defaultImage);
            // 重置会话存储
            sessionStorage.setItem('imgUrls', JSON.stringify([defaultImage]));
            sessionStorage.setItem('index', '0');
            return;
        });

        // 更新索引
        index = (index + 1) % imgUrls.length;
        sessionStorage.setItem('index', index.toString());

    } catch (error) {
        console.error('背景图片处理失败:', error);
        // 使用默认样式
        const panelElement = document.getElementById('panel');
        if (panelElement) {
            panelElement.style.background = '#666';
        }
    }
};

// 在DOM加载完成后执行
document.addEventListener('DOMContentLoaded', () => {
    handleBackgroundImage();
}); 