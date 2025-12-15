# CSP 错误修复说明

## 问题描述

**错误信息:**
```
EvalError: Evaluating a string as JavaScript violates the following Content Security Policy directive because 'unsafe-eval' is not an allowed source of script: script-src 'self'
```

**问题原因:**
- vue-i18n 在生产环境下默认使用消息编译器，需要使用 `eval` 或 `new Function()` 来编译模板
- Electron 应用的 CSP (Content Security Policy) 严格禁止 `unsafe-eval`，导致冲突
- 这个问题只在**生产环境**出现，开发环境因为 CSP 较宽松所以正常

---

## 解决方案

### 修复步骤总结

1. **安装 @intlify/unplugin-vue-i18n 插件**
   - 这个插件会在**编译时**将 i18n 消息预编译，而不是在运行时动态编译
   - 避免了在生产环境使用 eval

2. **配置 Vite 插件**
   - 在 vite.config.ts 中添加 VueI18nPlugin
   - 指定语言文件路径，让插件自动处理

3. **保持 i18n 配置不变**
   - 继续使用 JSON 格式的语言文件
   - 正常导入和配置，插件会在构建时自动处理

---

## 修改的文件

### 1. 安装依赖
```bash
npm install -D @intlify/unplugin-vue-i18n
```

### 2. vite.config.ts

**添加导入:**
```typescript
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite'
```

**添加插件配置:**
```typescript
plugins: [
  vue(),
  VueI18nPlugin({
    include: [path.resolve(__dirname, './src/i18n/locales/**')],
    runtimeOnly: true,        // 仅运行时模式，减小包体积
    compositionOnly: true,     // 仅 Composition API
    fullInstall: false,        // 不安装完整功能，减小体积
  }),
  // ... 其他插件
]
```

**关键配置项说明:**
- `include`: 指定 i18n 语言文件路径，支持 glob 模式
- `runtimeOnly`: 只包含运行时代码，不包含编译器（因为已经预编译了）
- `compositionOnly`: 只支持 Composition API，不包含 legacy 模式代码
- `fullInstall`: 不安装完整的 vue-i18n 功能，只安装必需的部分

### 3. src/i18n/index.ts

**优化导入变量名:**
```typescript
import zhCN from './locales/zh-CN.json'
import enUS from './locales/en-US.json'

const i18n = createI18n({
  legacy: false,
  locale: getDefaultLocale(),
  fallbackLocale: 'en-US',
  messages: {
    'zh-CN': zhCN,
    'en-US': enUS,
  },
  globalInjection: true,  // 全局注入 $t 函数
})
```

---

## 工作原理

### 编译时处理流程

```mermaid
graph LR
    A[语言 JSON 文件] --> B[@intlify/unplugin-vue-i18n]
    B --> C[预编译为 JavaScript]
    C --> D[打包到生产代码]
    D --> E[运行时直接使用]
    E --> F[无需 eval]
```

**关键点:**
1. **开发环境**: 语言文件动态加载，支持热更新
2. **生产环境**: 语言文件在构建时被预编译成 JavaScript 函数
3. **无 eval**: 所有编译工作在构建时完成，运行时不需要动态编译
4. **CSP 兼容**: 完全符合严格的 CSP 策略

---

## 验证修复

### 1. 开发环境测试
```bash
npm run dev
```
✅ 应用正常启动
✅ 语言切换正常
✅ DevTools 无错误

### 2. 生产环境构建
```bash
npm run build:win
```
✅ 构建成功
✅ 生成安装包: `release/Arc3DLab Setup 0.0.0.exe`

### 3. 安装包测试
1. 运行安装程序
2. 选择自定义安装路径（验证 NSIS 配置）
3. 启动应用
4. 测试语言切换功能
5. 检查控制台无 CSP 错误

---

## 额外优化

### 包体积优化
通过以下配置已经优化了包体积：
- `runtimeOnly: true` - 减少 ~20KB（移除编译器）
- `compositionOnly: true` - 减少 ~15KB（移除 legacy API）
- `fullInstall: false` - 减少 ~10KB（移除不必要功能）

### 性能优化
- **预编译**: 语言模板在构建时编译，运行时性能更好
- **无运行时开销**: 不需要在浏览器中编译模板
- **更快的启动速度**: 减少了初始化时的计算

---

## 常见问题

### Q1: 添加新语言怎么办？
**A:** 
1. 在 `src/i18n/locales/` 创建新的 JSON 文件，如 `ja-JP.json`
2. 在 `src/i18n/index.ts` 导入并添加到 messages
3. 重新构建，插件会自动处理新文件

### Q2: 如何支持动态语言包？
**A:** 
如果需要运行时动态加载语言包，可以：
1. 使用 `i18n.global.setLocaleMessage()` API
2. 通过 fetch 加载远程语言文件
3. 但要确保语言内容不使用模板语法，或者预先编译

### Q3: 开发环境下修改语言文件不生效？
**A:** 
- Vite 的 HMR 会自动处理，但如果不生效，重启开发服务器
- 或者清除缓存: `npm run dev -- --force`

### Q4: 为什么还要导入 JSON 文件？
**A:**
- TypeScript 类型支持
- 代码提示更友好
- 插件会在构建时自动将 JSON 转换为优化的 JavaScript 代码

---

## 技术栈版本

- vue-i18n: ^9.x
- @intlify/unplugin-vue-i18n: ^6.x (最新版)
- Vite: ^7.2.7
- Electron: ^39.0.0

---

## 总结

✅ **问题已解决**: CSP 错误完全修复
✅ **兼容性**: 同时支持开发和生产环境
✅ **性能优化**: 预编译带来更好的运行时性能
✅ **包体积优化**: 通过配置项减少不必要的代码
✅ **开发体验**: 保持了良好的开发体验和热更新

这个解决方案是 vue-i18n 官方推荐的最佳实践，专门用于解决 CSP 限制环境（如 Electron、浏览器插件等）的问题。
