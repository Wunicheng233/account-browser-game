# Account Browser Game

一个模拟现代在线账户注册和找回的荒诞游戏。

## 特性

- 🎮 两章完整游戏流程（创建账户 → 找回账户）
- 📋 渐进式解锁的验证规则系统
- 🔍 可搜索的浏览器地址栏
- 🌐 Proxy 切换和时区验证
- 📱 响应式设计
- 💾 自动保存进度到浏览器 localStorage

## 开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 运行测试
npm test

# 构建生产版本
npm run build
```

## 部署

本项目已配置 GitHub Actions 自动部署。

### 启用 GitHub Pages

1. 进入仓库 Settings → Pages
2. 在 "Build and deployment" 区域：
   - Source: 选择 **GitHub Actions**
3. 把代码推送到 `main` 分支，Action 会自动部署

### 手动部署

也可以直接把 `dist/` 目录的内容上传到任何静态托管服务：

```bash
npm run build
# 上传 dist/ 目录即可
```

## 技术栈

- React 19
- TypeScript
- Vite
- Vitest + Testing Library
