/**
 * 一言模块
 * 获取并显示一言内容
 */

// 初始化一言
export function initHitokoto() {
    const descriptionElement = document.getElementById('description');
    if (!descriptionElement) return;

    // 保存原始内容，以便在加载失败时显示
    const originalContent = descriptionElement.innerHTML;

    // 获取一言
    fetchHitokoto()
        .then(data => {
            if (data && data.hitokoto) {
                // 更新描述内容
                descriptionElement.innerHTML = `${data.hitokoto}<br>-「<strong>${data.from_who || data.from || '未知'}</strong>」`;
                descriptionElement.classList.add('fade-in');
            }
        })
        .catch(error => {
            console.warn('获取一言失败:', error);
            // 保持原始内容
            descriptionElement.innerHTML = originalContent;
        });
}

// 获取一言数据
async function fetchHitokoto() {
    try {
        // 使用官方API
        const response = await fetch('https://v1.hitokoto.cn?encode=json&c=i');

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.warn('一言API请求失败:', error);

        // 备用一言数据
        return {
            hitokoto: '因为你在，我不是太阳，而是化作星辰，与你遨游星空。',
            from: '原创'
        };
    }
} 