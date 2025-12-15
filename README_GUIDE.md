# Electron + Vue 3 + TypeScript + Vite 项目

这是一个基于 Electron 39.0.0、Vue 3、TypeScript 和 Vite 的桌面应用程序模板。

## 技术栈

- **Electron**: 39.0.0
- **Vue**: 3.x
- **TypeScript**: 5.9.x
- **Vite**: 7.x
- **构建工具**: electron-builder

## 项目结构

```
electron-vue-app/
├── electron/                 # Electron 主进程代码
│   ├── main.ts              # 主进程入口文件
│   └── preload.ts           # 预加载脚本
├── src/                     # Vue 渲染进程代码
│   ├── assets/              # 静态资源
│   ├── components/          # Vue 组件
│   ├── types/               # TypeScript 类型定义
│   │   └── electron.d.ts    # Electron API 类型定义
│   ├── App.vue              # 根组件
│   └── main.ts              # Vue 入口文件
├── public/                  # 公共静态资源
├── dist/                    # Vue 构建输出目录
├── dist-electron/           # Electron 构建输出目录
├── release/                 # 应用打包输出目录
├── .env.development         # 开发环境变量
├── .env.production          # 生产环境变量
├── vite.config.ts           # Vite 配置文件
├── tsconfig.json            # TypeScript 配置（Vue）
├── tsconfig.electron.json   # TypeScript 配置（Electron）
└── package.json             # 项目配置
```

## 开发环境配置

项目支持开发和生产两种环境配置：

- **开发环境**（`.env.development`）：
  - 自动打开 DevTools
  - 加载 Vite 开发服务器
  - 支持热重载

- **生产环境**（`.env.production`）：
  - 加载打包后的静态文件
  - 优化性能

## 使用方法

### 安装依赖

```bash
npm install
```

### 开发模式

启动开发服务器和 Electron 应用：

```bash
npm run dev
```

此命令会：
1. 启动 Vite 开发服务器（端口 5173）
2. 启动 Electron 应用
3. 支持热重载，修改代码后自动刷新

### 构建生产版本

构建 Vue 应用和 Electron 应用：

```bash
npm run build
```

### 平台特定构建

```bash
# Windows
npm run build:win

# macOS
npm run build:mac

# Linux
npm run build:linux
```

构建完成后，安装包会输出到 `release` 目录。

## 主要特性

### 1. 安全的进程间通信

项目使用 `contextBridge` 和 `preload.ts` 确保安全的进程间通信：

```typescript
// 在渲染进程中使用
window.electronAPI.sendMessage('Hello from renderer')
window.electronAPI.onMessage((message) => {
  console.log('Message from main:', message)
})
```

### 2. TypeScript 支持

完整的 TypeScript 类型支持，包括：
- Electron API 类型
- Vue 3 组合式 API 类型
- 自定义类型定义

### 3. 开发环境优化

- Vite 快速热重载
- Electron 开发者工具自动打开
- 源码映射（Source Map）支持

### 4. 生产环境优化

- 代码压缩和优化
- Tree-shaking
- 自动化打包流程

## 配置说明

### Vite 配置（vite.config.ts）

- 配置了 `vite-plugin-electron` 用于 Electron 主进程和预加载脚本的构建
- 配置了 `vite-plugin-electron-renderer` 用于渲染进程的 Electron 集成
- 设置了路径别名 `@` 指向 `src` 目录

### Electron Builder 配置（package.json）

- `appId`: 应用程序 ID
- `productName`: 应用程序名称
- `directories.output`: 输出目录
- `files`: 打包包含的文件
- 支持 Windows（NSIS）、macOS（DMG）、Linux（AppImage）

## 注意事项

1. **首次安装**：Electron 首次安装可能需要较长时间，请耐心等待
2. **网络问题**：如果下载 Electron 失败，可以配置镜像源
3. **开发模式**：开发模式下 Electron 窗口会自动打开 DevTools
4. **生产构建**：生产构建前请确保所有依赖已正确安装

## 环境要求

- Node.js >= 18.x
- npm >= 9.x

## 许可证

MIT
