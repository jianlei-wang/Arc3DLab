# Arc3DLab

Arc3DLab 是一个基于 Electron、Vue 3 和 Cesium 的三维地理信息系统应用框架。该应用提供了现代化的用户界面和强大的 3D 地球和地图可视化功能。

## 项目结构

```
├── build/                 # 构建资源目录
├── dist/                  # Web 应用构建输出目录
├── dist-electron/         # Electron 构建输出目录
├── electron/              # Electron 主进程和预加载脚本
│   ├── main.ts           # Electron 主进程入口
│   └── preload.ts        # 预加载脚本
├── src/                  # Vue 应用源码目录
│   ├── assets/           # 静态资源
│   ├── components/       # Vue 组件
│   ├── i18n/             # 国际化配置
│   ├── layouts/          # 页面布局组件
│   ├── styles/           # 全局样式
│   ├── types/            # TypeScript 类型定义
│   ├── utils/            # 工具函数
│   ├── App.vue           # 根组件
│   └── main.ts           # 应用入口
├── splash-en.html        # 英文启动屏幕
├── splash-zh.html        # 中文启动屏幕
├── index.html            # HTML 模板
├── vite.config.ts        # Vite 配置文件
├── tsconfig.json         # TypeScript 配置
└── package.json          # 项目配置和依赖
```

## 环境配置

### 开发环境要求
- Node.js >= 18.x
- npm >= 8.x

### 环境变量
项目使用两个环境配置文件：
- `.env.development` - 开发环境配置
- `.env.production` - 生产环境配置

## 已安装的依赖

### 运行时依赖
- `cesium` - 3D 地理可视化库
- `vue` - 渐进式 JavaScript 框架
- `vue-i18n` - 国际化插件

### 开发依赖
- `@vitejs/plugin-vue` - Vue 3 的 Vite 插件
- `electron` - 跨平台桌面应用框架
- `electron-builder` - Electron 应用打包工具
- `vite` - 下一代前端构建工具
- `vite-plugin-cesium` - Cesium 的 Vite 插件
- `vite-plugin-electron` - Electron 的 Vite 插件
- `typescript` - JavaScript 的超集
- `sass-embedded` - CSS 扩展语言

## 使用方法

### 安装依赖
```bash
npm install
```

### 开发模式
```bash
npm run dev
```
启动开发服务器，具有热重载功能。

### 构建应用
```bash
# 构建所有平台
npm run build

# 仅构建 Windows 平台
npm run build:win

# 仅构建 macOS 平台
npm run build:mac

# 仅构建 Linux 平台
npm run build:linux
```

### 预览构建
```bash
npm run preview
```

## 特别说明

### 国际化支持
- 支持中英文切换
- 语言设置持久化保存
- 启动屏幕根据用户偏好显示对应语言版本

### Cesium 集成
- 集成了专业的 3D 地球和地图可视化库
- 提供地理空间数据展示功能

### Electron 特性
- 跨平台桌面应用支持
- 自定义启动屏幕
- 系统托盘集成

### 开发注意事项
1. 使用 Vue 3 Composition API 和 `<script setup>` 语法
2. TypeScript 用于类型安全
3. SCSS 用于样式编写
4. 遵循 ESLint 和 Prettier 代码规范

### 故障排除
- 如果遇到构建问题，请确保 Node.js 版本符合要求
- 开发过程中如遇白屏问题，检查控制台错误信息
- 国际化功能如未生效，请检查 `src/i18n` 目录下的配置文件
- 启动屏幕在生产环境中无法显示的问题已修复，确保 splash 文件在 Electron Builder 配置中被正确打包