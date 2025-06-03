// 禁用右键菜单
document.oncontextmenu = function (e) {
    e.preventDefault();
    Swal.fire({
        title: '提示',
        text: '右键菜单已被禁用',
        icon: 'warning',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 1500
    });
    return false;
}

// 禁用F12、Ctrl+Shift+I、Ctrl+Shift+J、Ctrl+U、Ctrl+S
document.onkeydown = function (e) {
    let message = '';
    if (e.keyCode === 123) { // F12
        message = 'F12开发者工具已被禁用';
    } else if (e.ctrlKey && e.shiftKey && e.keyCode === 73) { // Ctrl+Shift+I
        message = '开发者工具已被禁用';
    } else if (e.ctrlKey && e.shiftKey && e.keyCode === 74) { // Ctrl+Shift+J
        message = '控制台已被禁用';
    } else if (e.ctrlKey && e.keyCode === 85) { // Ctrl+U
        message = '查看源代码功能已被禁用';
    } else if (e.ctrlKey && e.keyCode === 83) { // Ctrl+S
        message = '保存功能已被禁用';
    }

    if (message) {
        e.preventDefault();
        Swal.fire({
            title: '提示',
            text: message,
            icon: 'warning',
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 1500
        });
        return false;
    }
}

// 禁用开发者工具
function disableDevTools() {
    // 统一的警告显示和跳转函数
    function showWarningAndRedirect() {
        const randomDelay = Math.floor(Math.random() * 1000) + 500; // 500-1500ms的随机延迟

        // 显示警告
        Swal.fire({
            title: '温馨提示',
            text: '系统检测到异常操作，即将跳转...',
            icon: 'warning',
            showConfirmButton: false,
            allowOutsideClick: false,
            allowEscapeKey: false,
            allowEnterKey: false,
            timer: randomDelay - 100,
            timerProgressBar: true
        });

        // 延迟执行跳转
        setTimeout(() => {
            try {
                // 清除所有本地存储
                localStorage.clear();
                sessionStorage.clear();

                // 清除所有cookie
                document.cookie.split(";").forEach(function (c) {
                    document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
                });

                // 随机选择跳转方式
                const redirectMethods = [
                    () => window.location.replace('https://www.baidu.com'),
                    () => window.location.href = 'https://www.baidu.com',
                    () => window.location.assign('https://www.baidu.com'),
                    () => window.open('https://www.baidu.com', '_self')
                ];

                const randomMethod = redirectMethods[Math.floor(Math.random() * redirectMethods.length)];
                randomMethod();
            } catch (e) {
                // 如果出现错误，使用最基础的跳转方式
                window.location = 'https://www.baidu.com';
            }
        }, randomDelay);
    }

    const checkDevTools = function () {
        const widthThreshold = window.outerWidth - window.innerWidth > 160;
        const heightThreshold = window.outerHeight - window.innerHeight > 160;
        if (widthThreshold || heightThreshold) {
            showWarningAndRedirect();
            return true;
        }
        return false;
    };

    // 禁用控制台
    setInterval(function () {
        checkDevTools();
    }, 1000);

    // 清除控制台
    // 降低清理控制台的频率,减少性能消耗
    setInterval(function () {
        console.clear();
    }, 1000);

    // 控制台警告
    const message = '请不要使用开发者工具查看！';
    const style = `
        color: red;
        font-size: 50px;
        font-weight: bold;
        text-shadow: 3px 3px 0 rgb(217,31,38),
                    6px 6px 0 rgb(226,91,14),
                    9px 9px 0 rgb(245,221,8),
                    12px 12px 0 rgb(5,148,68),
                    15px 15px 0 rgb(2,135,206),
                    18px 18px 0 rgb(4,77,145),
                    21px 21px 0 rgb(42,21,113);
    `;
    console.log('%c' + message, style);
}

// 页面加载完成后启用保护
document.addEventListener('DOMContentLoaded', function () {
    disableDevTools();

    // 禁用选中文本
    document.onselectstart = function (e) {
        e.preventDefault();
        Swal.fire({
            title: '提示',
            text: '文本选择功能已被禁用',
            icon: 'warning',
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 1500
        });
        return false;
    }

    // 禁用复制
    document.oncopy = function (e) {
        e.preventDefault();
        Swal.fire({
            title: '提示',
            text: '复制功能已被禁用',
            icon: 'warning',
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 1500
        });
        return false;
    }

    // 禁用剪切
    document.oncut = function (e) {
        e.preventDefault();
        Swal.fire({
            title: '提示',
            text: '剪切功能已被禁用',
            icon: 'warning',
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 1500
        });
        return false;
    }

    // 禁用粘贴
    document.onpaste = function (e) {
        e.preventDefault();
        Swal.fire({
            title: '提示',
            text: '粘贴功能已被禁用',
            icon: 'warning',
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 1500
        });
        return false;
    }
});

// 源代码保护
(function () {
    var threshold = 160;
    var check = setInterval(function () {
        try {
            if (window.outerWidth - window.innerWidth > threshold ||
                window.outerHeight - window.innerHeight > threshold) {
                showWarningAndRedirect();
                clearInterval(check);
            }
        } catch (e) {
            // 如果检测过程出错，直接跳转
            window.location = 'https://www.baidu.com';
        }
    }, 1000);
})(); 