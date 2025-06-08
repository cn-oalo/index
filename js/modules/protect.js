// 页面保护模块
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

// 统一的警告显示和跳转函数
function showWarningAndRedirect() {
    const randomDelay = Math.floor(Math.random() * 1000) + 500;

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

    setTimeout(() => {
        try {
            localStorage.clear();
            sessionStorage.clear();
            document.cookie.split(";").forEach(function (c) {
                document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
            });

            const redirectMethods = [
                () => window.location.replace('https://www.baidu.com'),
                () => window.location.href = 'https://www.baidu.com',
                () => window.location.assign('https://www.baidu.com'),
                () => window.open('https://www.baidu.com', '_self')
            ];

            const randomMethod = redirectMethods[Math.floor(Math.random() * redirectMethods.length)];
            randomMethod();
        } catch (e) {
            window.location = 'https://www.baidu.com';
        }
    }, randomDelay);
}

// 控制台保护函数
function disableDevTools() {
    const checkDevTools = function () {
        const widthThreshold = window.outerWidth - window.innerWidth > 160;
        const heightThreshold = window.outerHeight - window.innerHeight > 160;
        if (widthThreshold || heightThreshold) {
            showWarningAndRedirect();
            return true;
        }
        return false;
    };

    setInterval(checkDevTools, 1000);
    setInterval(console.clear, 1000);

    const message = '您的电脑已植入病毒！请立即断开网络连接并联系专业人员处理！';
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

// 剪贴板操作保护函数
function disableClipboardOperations() {
    const clipboardEvents = {
        'selectstart': '文本选择功能已被禁用',
        'copy': '复制功能已被禁用',
        'cut': '剪切功能已被禁用',
        'paste': '粘贴功能已被禁用'
    };

    Object.entries(clipboardEvents).forEach(([event, message]) => {
        document[`on${event}`] = function(e) {
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
        };
    });
}

// 源代码保护函数
function protectSourceCode() {
    const threshold = 160;
    const check = setInterval(function () {
        try {
            if (window.outerWidth - window.innerWidth > threshold ||
                window.outerHeight - window.innerHeight > threshold) {
                showWarningAndRedirect();
                clearInterval(check);
            }
        } catch (e) {
            window.location = 'https://www.baidu.com';
        }
    }, 1000);
}

// 初始化所有保护
document.addEventListener('DOMContentLoaded', function () {
    disableDevTools();
    disableClipboardOperations();
    protectSourceCode();
});
