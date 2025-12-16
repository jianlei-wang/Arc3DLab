# Splash 界面生产环境修复说明

## 问题描述
在开发环境中，`npm run dev` 运行正常，splash 界面可以正确显示。但在生产环境中，通过 `npm run build:win` 生成的安装包安装后，程序启动时 splash 界面只显示纯白背景，无法正常显示。

## 问题原因
1. **路径问题**：在开发环境和生产环境中，`__dirname` 指向的路径不同。开发环境中 splash 文件位于项目根目录，而在生产环境中这些文件被打包到了不同的位置。

2. **资源未正确打包**：splash HTML 文件没有被正确包含在 Electron Builder 的打包配置中，导致生产环境中缺少这些文件。

## 解决方案

### 1. 修复主进程中的路径逻辑
在 `electron/main.ts` 中修改了 splash 文件路径的处理逻辑：

```typescript
// 修复生产环境中的 splash 文件路径问题
let splashPath: string;
if (isDev) {
  // 开发环境：文件在项目根目录
  splashPath = path.join(__dirname, `../${splashFile}`);
} else {
  // 生产环境：文件被打包到 resources 目录
  splashPath = path.join(process.resourcesPath, splashFile);
}

const splashUrl = `file://${splashPath.replace(/\\/g, '/')}`;
```

### 2. 更新 Electron Builder 配置
在 `package.json` 中的 `build.extraResources` 部分添加了 splash 文件的打包配置：

```json
"extraResources": [
  {
    "from": "build/icon.ico",
    "to": "icon.ico"
  },
  {
    "from": "splash-en.html",
    "to": "splash-en.html"
  },
  {
    "from": "splash-zh.html",
    "to": "splash-zh.html"
  }
]
```

## 验证方法
1. 运行 `npm run build:win` 构建 Windows 版本
2. 安装生成的安装包
3. 启动应用程序
4. 观察 splash 界面是否正常显示

## 注意事项
1. 此修复方案同时兼容开发环境和生产环境
2. 确保 splash 文件名与代码中的引用保持一致
3. 如果添加更多语言版本的 splash 界面，需要相应更新 Electron Builder 配置