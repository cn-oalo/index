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

	// 图片懒加载
	if ("loading" in HTMLImageElement.prototype) {
		// 如果浏览器支持原生懒加载
		const images = document.querySelectorAll("img[data-src]");
		images.forEach(img => {
			img.src = img.dataset.src;
			img.removeAttribute("data-src");
		});
	} else if ("IntersectionObserver" in window) {
		// 使用 IntersectionObserver 实现懒加载
		const imageObserver = new IntersectionObserver((entries, observer) => {
			entries.forEach(entry => {
				if (entry.isIntersecting) {
					const img = entry.target;
					img.src = img.dataset.src;
					img.removeAttribute("data-src");
					imageObserver.unobserve(img);
				}
			});
		}, {
			rootMargin: "50px 0px" // 提前50px加载
		});

		document.querySelectorAll("img[data-src]").forEach(img => {
			imageObserver.observe(img);
		});
	}
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

	

	// 初始化动画
	document.querySelectorAll(".iUp").forEach(el => iUp.up(el));

	// 头像加载完成后显示
	if (elements.avatar) {
		elements.avatar.addEventListener('load', () => elements.avatar.classList.add("show"));
	}	// 执行初始化
	fetchHitokoto();
	handleBackgroundImage();

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

// 微信扫码弹窗函数
window.weixin = () => {
    Swal.fire({
        title: '<span style="font-size: 24px">👋 扫码添加</span>',
        html: '<p style="color: #666; margin-top: 10px">请使用微信扫一扫添加好友</p>',
        imageUrl: './images/weixin.png',
        imageWidth: 200,
        imageHeight: 200,
        showClass: {
            popup: 'animate__animated animate__fadeInDown'
        },
        hideClass: {
            popup: 'animate__animated animate__fadeOutUp'
        },
        confirmButtonText: '关闭',
        confirmButtonColor: '#28a745',
        showCloseButton: true,
        customClass: {
            popup: 'wechat-popup',
            image: 'wechat-qrcode',
            confirmButton: 'wechat-confirm-btn'
        },
        backdrop: `
            rgba(0,0,0,0.4)
            url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M73 50c0-12.7-10.3-23-23-23S27 37.3 27 50m3.9 0c0-10.5 8.5-19.1 19.1-19.1S69.1 39.5 69.1 50' fill='none' stroke='%239ACD32' stroke-width='3'%3E%3CanimateTransform attributeName='transform' attributeType='XML' type='rotate' dur='1s' from='0 50 50' to='360 50 50' repeatCount='indefinite' /%3E%3C/path%3E%3C/svg%3E")
            center 
            no-repeat
        `
    });
};

// 添加必要的CSS样式
const style = document.createElement('style');
style.textContent = `    .wechat-popup {
        border-radius: 15px !important;
        padding: 20px !important;
    }
    .wechat-qrcode {
        border-radius: 10px;
        box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        transition: transform 0.3s ease;
    }
    .wechat-qrcode:hover {
        transform: scale(1.05);
    }
    .wechat-confirm-btn {
        border-radius: 25px !important;
        padding: 10px 30px !important;
        font-weight: 600 !important;
    }
    .swal2-popup .swal2-title {
        margin-bottom: 0;
    }
`;
document.head.appendChild(style);

// QQ聊天函数
window.openQQ = () => {
    const qqNumber = '674401983';
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    Swal.fire({
        title: '<div class="qq-title">💬 与我联系</div>',
        html: `
            <div class="qq-content">
                <div class="qq-avatar">
                    <img src="https://q1.qlogo.cn/g?b=qq&nk=${qqNumber}&s=100" alt="QQ头像" 
                         onerror="this.src='./images/photo.jpg'">
                </div>
                <div class="qq-info">
                    <p class="qq-name">1000001001</p>
                    <p class="qq-number">${qqNumber}</p>
                </div>
                <div class="qq-buttons">
                    ${isMobile ? 
                        `<a href="mqq://im/chat?chat_type=wpa&uin=${qqNumber}&version=1&src_type=web" class="qq-btn mobile-qq">
                            打开QQ App
                        </a>` : 
                        `<a href="tencent://message/?uin=${qqNumber}&Site=&Menu=yes" class="qq-btn pc-qq">
                            打开QQ
                        </a>`
                    }
                </div>
            </div>
        `,
        showConfirmButton: false,
        showCloseButton: true,
        background: '#fff',
        backdrop: `rgba(0,0,0,0.6)`,
        showClass: {
            popup: 'animate__animated animate__zoomIn animate__faster'
        },
        hideClass: {
            popup: 'animate__animated animate__zoomOut animate__faster'
        },
        customClass: {
            popup: 'qq-popup',
            closeButton: 'qq-close-button'
        }
    });
};

// 添加QQ聊天按钮样式
const qqStyle = document.createElement('style');
qqStyle.textContent = `
    .qq-popup {
        border-radius: 20px !important;
        padding: 0 !important;
        max-width: 360px !important;
        overflow: hidden !important;
        box-shadow: 0 10px 30px rgba(0,0,0,0.1) !important;
    }
    .qq-title {
        font-size: 24px;
        background: linear-gradient(135deg, #42A5F5, #2196F3);
        color: white;
        padding: 35px 20px 20px;
        margin: -20px -20px 0 !important;
    }
    .qq-content {
        padding: 20px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 15px;
    }
    .qq-avatar {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        overflow: hidden;
        border: 3px solid #fff;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }
    .qq-avatar img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
    .qq-info {
        text-align: center;
    }
    .qq-name {
        font-size: 18px;
        font-weight: 600;
        color: #333;
        margin: 0 0 5px;
    }
    .qq-number {
        font-size: 14px;
        color: #666;
        margin: 0;
    }
    .qq-close-button {
        color: #fff !important;
        transition: transform 0.3s ease !important;
    }
    .qq-close-button:hover {
        transform: rotate(90deg) !important;
    }
    .qq-buttons {
        width: 100%;
        padding: 0 20px;
    }
    .qq-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        padding: 12px 24px;
        border-radius: 12px;
        color: #fff;
        text-decoration: none;
        font-weight: 600;
        font-size: 16px;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        background: linear-gradient(135deg, #42A5F5, #2196F3);
        border: none;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
    .qq-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(33,150,243,0.3);
    }
    .qq-btn:active {
        transform: translateY(0);
    }
    .qq-btn::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(
            120deg,
            transparent,
            rgba(255,255,255,0.3),
            transparent
        );
        transition: 0.5s;
    }
    .qq-btn:hover::before {
        left: 100%;
    }
    .qq-popup .swal2-html-container {
        margin: 0;
        padding: 0;
    }
    @media (max-width: 480px) {
        .qq-popup {
            width: 90% !important;
            margin: 0 auto;
        }
        .qq-content {
            gap: 12px;
        }
        .qq-avatar {
            width: 70px;
            height: 70px;
        }
        .qq-btn {
            padding: 10px 20px;
            font-size: 15px;
        }
    }
`;
document.head.appendChild(qqStyle);

// 邮箱点击函数
window.openEmail = () => {
    const email = 'admin@oalo.cn';
    
    Swal.fire({
        title: '<div class="email-title">📧 发送邮件</div>',
        html: `
            <div class="email-content">
                <p class="email-address">我的邮箱：${email}</p>
                <div class="email-info">
                    <p>点击下方按钮发送邮件给我</p>
                </div>
            </div>
        `,
        showCancelButton: true,
        confirmButtonText: '发送邮件',
        cancelButtonText: '复制邮箱',
        confirmButtonColor: '#42A5F5',
        cancelButtonColor: '#64748b',
        background: '#fff',
        showClass: {
            popup: 'animate__animated animate__fadeInDown animate__faster'
        },
        hideClass: {
            popup: 'animate__animated animate__fadeOutUp animate__faster'
        },
        customClass: {
            popup: 'email-popup',
            title: 'email-popup-title',
            confirmButton: 'email-confirm-btn',
            cancelButton: 'email-cancel-btn'
        }
    }).then((result) => {
        if (result.isConfirmed) {
            window.location.href = `mailto:${email}`;
        } else if (result.dismiss === Swal.DismissReason.cancel) {
            // 复制邮箱到剪贴板
            navigator.clipboard.writeText(email).then(() => {
                Swal.fire({
                    title: '已复制',
                    text: '邮箱地址已复制到剪贴板',
                    icon: 'success',
                    timer: 1500,
                    showConfirmButton: false
                });
            }).catch(err => {
                console.error('复制失败:', err);
            });
        }
    });
};

// 添加邮箱弹窗样式
const emailStyle = document.createElement('style');
emailStyle.textContent = `
    .email-popup {
        border-radius: 20px !important;
        padding: 20px !important;
        max-width: 400px !important;
        box-shadow: 0 10px 30px rgba(0,0,0,0.1) !important;
    }
    .email-title {
        font-size: 24px;
        color: #1e293b;
        margin-bottom: 15px;
    }
    .email-content {
        padding: 10px 0;
    }
    .email-address {
        font-size: 18px;
        color: #42A5F5;
        font-weight: 600;
        margin-bottom: 15px;
    }
    .email-info {
        color: #64748b;
        font-size: 14px;
    }
    .email-confirm-btn, .email-cancel-btn {
        border-radius: 12px !important;
        padding: 12px 24px !important;
        font-weight: 600 !important;
    }
    .email-popup .swal2-html-container {
        margin: 1em 0 !important;
    }
`;
document.head.appendChild(emailStyle);
// 这里可以添加其他功能
