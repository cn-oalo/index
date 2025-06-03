// UI 交互增强模块
export class UIEnhancement {
  constructor() {
    this.initializeIntersectionObserver();
    this.initializeThemeToggle();
    this.initializeScrollProgress();
  }

  // 初始化交叉观察器实现渐入效果
  initializeIntersectionObserver() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1
    });

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
      observer.observe(el);
    });
  }

  // 主题切换功能
  initializeThemeToggle() {
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    const toggleTheme = (e) => {
      if (e.matches) {
        document.body.classList.add('dark-theme');
      } else {
        document.body.classList.remove('dark-theme');
      }
    };

    prefersDarkScheme.addListener(toggleTheme);
    toggleTheme(prefersDarkScheme);
  }

  // 滚动进度条
  initializeScrollProgress() {
    window.addEventListener('scroll', () => {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      
      if (document.getElementById('scroll-progress')) {
        document.getElementById('scroll-progress').style.width = scrolled + '%';
      }
    });
  }
}

// 图片加载优化
export class ImageOptimization {
  constructor() {
    this.initializeLazyLoading();
  }

  initializeLazyLoading() {
    if ('loading' in HTMLImageElement.prototype) {
      document.querySelectorAll('img[loading="lazy"]').forEach(img => {
        img.src = img.dataset.src;
      });
    } else {
      // 回退方案
      this.loadLazyLoadingPolyfill();
    }
  }

  loadLazyLoadingPolyfill() {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/lozad/dist/lozad.min.js';
    script.onload = () => {
      const observer = lozad();
      observer.observe();
    };
    document.body.appendChild(script);
  }
}

// 性能优化
export class PerformanceOptimization {
  constructor() {
    this.initializePerformanceMonitoring();
  }

  initializePerformanceMonitoring() {
    if ('performance' in window) {
      window.addEventListener('load', () => {
        const timing = performance.timing;
        const loadTime = timing.loadEventEnd - timing.navigationStart;
        console.log(`页面加载时间: ${loadTime}ms`);
      });
    }
  }
}

// 初始化所有增强功能
export function initializeEnhancements() {
  new UIEnhancement();
  new ImageOptimization();
  new PerformanceOptimization();
}
