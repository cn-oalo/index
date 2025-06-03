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

document.addEventListener('DOMContentLoaded', () => {
	// 缓存所有需要的DOM元素,减少重复查询
	const elements = {
		panel: document.getElementById('panel'),
		description: document.getElementById('description'),
		avatar: document.querySelector('.js-avatar'),
		navigationWrapper: document.querySelector('.navigation-wrapper')
	};

// 获取访客信息
	const fetchVisitorInfo = async () => {
		try {
			const response = await fetch('https://ipapi.co/json/');
			const data = await response.json();
			if (data) {
				// 创建访客信息显示元素
				const visitorInfoDiv = document.createElement('div');
				visitorInfoDiv.className = 'visitor-info';
				
				// 获取问候语（根据时间）
				const hour = new Date().getHours();
				const greetings = {
					morning: { text: '早上好', emoji: '🌅', hours: [5, 11] },
					afternoon: { text: '下午好', emoji: '🌞', hours: [12, 17] },
					evening: { text: '晚上好', emoji: '🌙', hours: [18, 23] },
					night: { text: '夜深了', emoji: '🌠', hours: [0, 4] }
				};

				let greeting = greetings.morning;
				for (const [_, info] of Object.entries(greetings)) {
					if (hour >= info.hours[0] && hour <= info.hours[1]) {
						greeting = info;
						break;
					}
				}
				
				const locationInfo = [
					data.city || '未知城市',
					data.region,
					data.country_name
				].filter(Boolean).join(' · ');

				visitorInfoDiv.innerHTML = `
					<div class="visitor-card">
						<div class="visitor-header">
							<span class="greeting-text">${greeting.emoji} ${greeting.text}！</span>
						</div>
						<div class="visitor-content">
							<p class="visitor-location">
								来自<span class="highlight">${locationInfo}</span>的朋友
							</p>
							<div class="visitor-details">
								<p class="visitor-item">
									<span>📍 ${data.ip}</span>
								</p>
								<p class="visitor-item">
									<span>🌐 ${data.org || '未知网络'}</span>
								</p>
							</div>
						</div>
					</div>
				`;
				
				// 将访客信息添加到导航栏下方
				const navigationWrapper = document.querySelector('.navigation-wrapper');
				if (navigationWrapper) {
					navigationWrapper.parentNode.insertBefore(visitorInfoDiv, navigationWrapper.nextSibling);
					// 添加渐入动画效果
					requestAnimationFrame(() => {
						visitorInfoDiv.querySelector('.visitor-card').classList.add('up');
					});
				}
			}
		} catch (error) {
			console.warn('获取访客信息失败:', error);
		}
	};

	// 获取一言数据
	const fetchHitokoto = async () => {
		try {
			const response = await fetch('https://v1.hitokoto.cn');
			const data = await response.json();
			elements.description.innerHTML = `${data.hitokoto}<br/> -「<strong>${data.from}</strong>」`;
		} catch (error) {
			console.warn('获取一言数据失败:', error);
			// 使用默认内容
			elements.description.innerHTML = '因为你在，我不是太阳，而是化作星辰，与你遨游星空。<br>-「<strong>原创</strong>」';
		}
	};

	// 处理背景图片
	const handleBackgroundImage = async () => {
		// 检查星空背景是否激活
		if (window.isStarfieldActive && window.isStarfieldActive()) {
			return; // 如果星空背景已激活，不加载背景图片
		}

		try {
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
						elements.panel.style.background = `url('${url}') center center no-repeat #666`;
						elements.panel.style.backgroundSize = 'cover';
						elements.panel.style.transition = 'background 0.3s ease-in-out';
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
			elements.panel.style.background = '#666';
		}
	};

	// 更新版权信息样式
	const updateCopyright = () => {
		const remark = document.querySelector('.remark');
		if (remark) {
			remark.innerHTML = `
				<div class="copyright-container">
					<div class="copyright-content">
						<div class="copyright-line"></div>
						<p class="power">
							<span class="copyright-icon">❤</span>
							<span class="copyright-text">
								Copyright © 2020 - ${new Date().getFullYear()}
							</span>
							<span class="copyright-divider">·</span>
							<span class="copyright-author">R_Aries</span>
							<span class="copyright-icon">❤</span>
						</p>
						<div class="copyright-line"></div>
					</div>
					<div class="copyright-decoration">
						<span class="decoration-item">♪</span>
						<span class="decoration-item">♫</span>
						<span class="decoration-item">♩</span>
					</div>
				</div>
			`;
		}
	};

	// 初始化动画
	document.querySelectorAll(".iUp").forEach(el => iUp.up(el));

	// 头像加载完成后显示
	if (elements.avatar) {
		elements.avatar.addEventListener('load', () => elements.avatar.classList.add("show"));
	}

	// 执行初始化
	fetchHitokoto();
	handleBackgroundImage();
	fetchVisitorInfo();
	updateCopyright();
});

$('.btn-mobile-menu__icon').click(function () {
	if ($('.navigation-wrapper').css('display') == "block") {
		$('.navigation-wrapper').on('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
			$('.navigation-wrapper').toggleClass('visible animated bounceOutUp');
			$('.navigation-wrapper').off('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend');
		});
		$('.navigation-wrapper').toggleClass('animated bounceInDown animated bounceOutUp');

	} else {
		$('.navigation-wrapper').toggleClass('visible animated bounceInDown');
	}
	$('.btn-mobile-menu__icon').toggleClass('social iconfont icon-list social iconfont icon-ngleup animated fadeIn');
});
