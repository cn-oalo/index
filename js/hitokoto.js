// 获取一言数据
const fetchHitokoto = async () => {
    try {
        const descriptionElement = document.getElementById('description');
        if (!descriptionElement) {
            console.error('找不到description元素');
            return;
        }

        const response = await fetch('https://v1.hitokoto.cn');
        const data = await response.json();
        descriptionElement.innerHTML = `${data.hitokoto}<br/> -「<strong>${data.from}</strong>」`;
    } catch (error) {
        console.warn('获取一言数据失败:', error);
        // 使用默认内容
        const descriptionElement = document.getElementById('description');
        if (descriptionElement) {
            descriptionElement.innerHTML = '因为你在，我不是太阳，而是化作星辰，与你遨游星空。<br>-「<strong>原创</strong>」';
        }
    }
};

// 在DOM加载完成后执行
document.addEventListener('DOMContentLoaded', () => {
    fetchHitokoto();
}); 