# 幸运大抽奖转盘

一个响应式的幸运转盘抽奖网站，支持移动端和桌面端，具有精美的气泡动画效果。

## 功能特色

- 🎯 **精美转盘**: 10个奖品区域，不同颜色区分，金色外圈装饰
- 🎨 **响应式设计**: 完美适配手机、平板、电脑等各种设备
- 🎉 **丰富动画**: 转盘旋转动画、中奖结果展示、全屏气泡效果
- 🎵 **音效支持**: 内置简单的音效反馈（可选）
- ⚡ **高性能**: 使用Canvas绘制转盘，CSS3动画优化
- 🌈 **多样化气泡**: 每个奖品对应不同的气泡样式和内容

## 文件结构

```
lv_turntable/
├── index.html              # 主页面
├── css/
│   ├── style.css          # 主要样式
│   └── responsive.css     # 响应式样式
├── js/
│   ├── wheel.js           # 转盘逻辑
│   ├── bubbles.js         # 气泡动画
│   └── main.js            # 主程序
└── .trae/documents/       # 项目文档
    ├── prd_requirements.md
    └── technical_architecture.md
```

## 奖品配置

转盘包含以下10个奖品：
1. 特等奖 (红色)
2. 一等奖 (深红色)
3. 二等奖 (紫色)
4. 三等奖 (深紫色)
5. 四等奖 (蓝色)
6. 限量周边 (深蓝色)
7. 购物券 (绿色)
8. 谢谢惠顾 (青色)
9. 再来一次 (橙色)
10. 差一点 (深橙色)

## 使用方法

### 直接打开
1. 下载项目文件到本地
2. 双击 `index.html` 文件即可在浏览器中打开
3. 或者将文件部署到任何Web服务器

### 本地服务器（推荐）
```bash
# 使用Python
python -m http.server 8000

# 或使用Node.js
npx serve .

# 或使用Live Server插件（VS Code）
```

## 自定义配置

### 修改奖品内容
编辑 `js/wheel.js` 文件中的 `prizes` 数组：

```javascript
this.prizes = [
    { text: '你的奖品名称', color: '#你的颜色', bubbleType: '气泡类型' },
    // ... 更多奖品
];
```

### 修改气泡内容
编辑 `js/bubbles.js` 文件中的 `bubbleConfigs` 对象：

```javascript
special: {
    colors: ['#ff6b6b', '#ff8e8e', '#ffb3b3'],
    content: ['xxx', '特等奖', '恭喜'],  // 修改这里的内容
    size: { min: 40, max: 100 },
    speed: { min: 2, max: 4 }
}
```

### 调整动画参数
- **转盘旋转时间**: 修改 `js/wheel.js` 中的 `duration` 变量（默认4000ms）
- **气泡动画时间**: 修改 `js/main.js` 中的 `bubbleAnimation.start()` 调用参数
- **气泡数量**: 修改 `js/bubbles.js` 中的 `bubbleCount` 变量

## 浏览器兼容性

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+
- ✅ 移动端主流浏览器

## 性能优化

- 使用 `requestAnimationFrame` 优化动画性能
- 自动清理完成的气泡DOM元素
- CSS3硬件加速
- 响应式图片和图标

## 键盘支持

- `空格键` 或 `回车键`: 开始抽奖或领取奖品
- `ESC键`: 停止动画（可选实现）

## 触摸优化

- 移动端触摸反馈
- 防止页面滚动干扰
- 适合手指点击的按钮大小

## 部署建议

### 静态托管
- GitHub Pages
- Netlify
- Vercel
- 阿里云OSS
- 腾讯云COS

### CDN加速
建议将静态资源部署到CDN以获得更好的加载性能。

## 许可证

MIT License - 可自由使用和修改

## 更新日志

### v1.0.0 (2024-01)
- ✨ 初始版本发布
- 🎯 基础转盘功能
- 🎨 响应式设计
- 🎉 气泡动画效果
- ⚡ 性能优化

## 技术支持

如有问题或建议，欢迎提交Issue或Pull Request。

---

🎊 **祝您使用愉快，好运连连！** 🎊