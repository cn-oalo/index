document.addEventListener('DOMContentLoaded', () => {
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


