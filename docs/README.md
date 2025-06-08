# 个人主页项目

这是一个现代化、高性能的个人主页项目，采用模块化设计，优化了代码结构和性能。

## 项目结构

```
Index/
├── css/                # 样式文件
│   ├── fonts.css       # 字体样式
│   ├── iconfont.css    # 图标字体
│   ├── layout.css      # 布局样式
│   ├── main.css        # 主样式文件
│   ├── navigation.css  # 导航样式
│   ├── social-popups.css # 社交弹窗样式
│   └── visitor-info.css  # 访客信息样式
├── js/                 # JavaScript文件
│   ├── app.js          # 主应用入口
│   └── modules/        # 功能模块
│       ├── animations.js     # 动画效果
│       ├── background.js     # 背景处理
│       ├── clock.js          # 时钟功能
│       ├── hitokoto.js       # 一言功能
│       ├── lazy-loading.js   # 图片懒加载
│       ├── social.js         # 社交功能
│       ├── visitor-info.js   # 访客信息
│       └── protect.js        # 保护模块
├── images/             # 图片资源
│   ├── photo.jpg       # 背景图片
│   ├── kl.gif          # 头像动画
│   └── weixin.png      # 微信二维码
├── webfonts/           # 字体文件
│   ├── fa-brands-400.woff2  # 品牌图标字体
│   └── fa-solid-900.woff2   # 实心图标字体
└── docs/               # 文档
    └── README.md       # 项目说明
```

## 技术特点

1. **现代化UI设计**：
   - CSS变量系统实现主题定制
   - 毛玻璃效果和渐变动画
   - 统一的设计语言

1. **模块化设计**：
   - 使用ES模块将功能分离为独立模块
   - 每个模块负责单一功能，便于维护和扩展

2. **性能优化**：
   - 使用CSS变量统一管理样式
   - CSS模块化设计，提升样式管理效率
   - 图片懒加载，提升首屏加载速度
   - 使用CDN加载外部库
   - 延迟加载非关键资源
   - 使用requestAnimationFrame优化动画性能

3. **布局优化**：
   - 模块化的CSS文件组织
   - 响应式导航设计
   - 优化的字体加载策略
   - 灵活的布局系统

4. **代码质量**：
   - 统一的代码风格和命名规范
   - 详细的代码注释
   - 错误处理和降级方案

5. **响应式设计**：
   - 适配各种屏幕尺寸
   - 移动端优化
   - 自适应导航菜单

6. **浏览器兼容性**：
   - 提供降级方案，支持旧版浏览器
   - 使用特性检测而非浏览器检测
   - WebFont优化加载

## 功能模块

### 背景模块 (background.js)
- 星空背景效果
- 背景图片加载优化

### 时钟模块 (clock.js)
- 模拟时钟动画
- 高性能Canvas绘制
- 渐变动画和发光效果
- 移动端自适应优化

### 一言模块 (hitokoto.js)
- 获取一言API数据
- 错误处理和备用内容

### 访客信息模块 (visitor-info.js)
- 获取访客IP、地理位置、系统信息
- 根据时间显示不同问候语
- 毛玻璃效果和平滑动画
- 响应式布局优化

### 动画模块 (animations.js)
- 页面元素渐入效果
- 移动菜单动画

### 懒加载模块 (lazy-loading.js)
- 图片懒加载
- 多种实现方式，支持降级

### 社交模块 (social.js)
- 微信扫码功能
- QQ联系功能
- 邮箱联系功能

### 保护模块 (protect.js)
- 防止开发者工具的使用
- 禁用右键菜单和快捷键
- 禁用文本选择和剪贴板操作
- 异常操作检测和重定向
- 模块化设计，可按需启用功能

## 使用方法

1. 克隆项目到本地
2. 修改个人信息：
   - 在index.html中修改名称、描述等信息
   - 在social.js中修改联系方式
   - 替换images目录下的图片
3. 部署到服务器或GitHub Pages

## 自定义主题

可以通过修改CSS变量来自定义主题颜色：

```css
:root {
  --primary-color: #42A5F5;    /* 主色调 */
  --secondary-color: #2196F3;  /* 次要色调 */
  --text-color: #f0f0f0;       /* 主文本颜色 */
  --text-secondary: #e0e0e0;   /* 次要文本颜色 */
  --background-overlay: rgba(68, 68, 68, 0.6); /* 背景遮罩 */
  --animation-speed: 0.3s;     /* 动画速度 */
}
```

## 性能建议

1. 使用WebP格式图片可进一步提升加载速度
2. 考虑使用Service Worker实现离线访问
3. 可添加预渲染或静态生成提升首屏加载速度

## 浏览器支持

- Chrome 60+
- Firefox 55+
- Safari 11+
- Edge 16+
- 旧版浏览器有基本功能支持，但动画效果可能受限