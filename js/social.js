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