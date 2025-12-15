# Vue I18n Composition API 错误修复

## 错误信息

```
Uncaught SyntaxError: Unexpected return type in composer
    at createCompileError (vue-i18n.js?v=ad594d02:310:17)
    at createI18nError (vue-i18n.js?v=ad594d02:3767:10)
    at wrapWithDeps (vue-i18n.js?v=ad594d02:4094:13)
    at Proxy.t (vue-i18n.js?v=ad594d02:4098:12)
```

## 问题原因

当使用 vue-i18n 的 **Composition API 模式** (`legacy: false`) 时：

1. **不能直接使用 `$t()` 全局函数**
   - `$t` 是 Legacy API 的全局注入方式
   - Composition API 模式需要通过 `useI18n()` 获取 `t` 函数

2. **必须在组件中显式调用 `useI18n()`**
   - 需要解构出 `t` 函数
   - 在模板中使用 `t()` 而不是 `$t()`

## 解决方案

### ❌ 错误写法（导致报错）

```vue
<script setup lang="ts">
import { useI18n } from 'vue-i18n'

// 错误：只调用 useI18n() 但不使用返回值
useI18n()
</script>

<template>
  <!-- 错误：在 Composition API 模式下使用 $t -->
  <h1>{{ $t('app.welcome') }}</h1>
</template>
```

### ✅ 正确写法

```vue
<script setup lang="ts">
import { useI18n } from 'vue-i18n'

// 正确：解构出 t 函数
const { t } = useI18n()
</script>

<template>
  <!-- 正确：使用解构的 t 函数 -->
  <h1>{{ t('app.welcome') }}</h1>
</template>
```

## 修改的文件

### 1. src/App.vue

**修改前：**
```vue
<script setup lang="ts">
import { useI18n } from 'vue-i18n'
useI18n()  // ❌
</script>

<template>
  <h1>{{ $t('app.welcome') }}</h1>  <!-- ❌ -->
</template>
```

**修改后：**
```vue
<script setup lang="ts">
import { useI18n } from 'vue-i18n'
const { t } = useI18n()  // ✅
</script>

<template>
  <h1>{{ t('app.welcome') }}</h1>  <!-- ✅ -->
</template>
```

### 2. src/components/LanguageSwitcher.vue

**修改前：**
```vue
<script setup lang="ts">
const { locale } = useI18n()  // ❌ 缺少 t
</script>

<template>
  <option value="zh-CN">{{ $t('language.zh-CN') }}</option>  <!-- ❌ -->
</template>
```

**修改后：**
```vue
<script setup lang="ts">
const { locale, t } = useI18n()  // ✅ 添加 t
</script>

<template>
  <option value="zh-CN">{{ t('language.zh-CN') }}</option>  <!-- ✅ -->
</template>
```

### 3. src/i18n/index.ts

**修改：**
移除了 `globalInjection: true` 配置，因为：
- Composition API 模式下不需要全局注入
- 使用 `useI18n()` 更符合 Vue 3 的设计理念
- 更好的类型安全

```typescript
const i18n = createI18n({
  legacy: false,
  locale: getDefaultLocale(),
  fallbackLocale: 'en-US',
  messages: {
    'zh-CN': zhCN,
    'en-US': enUS,
  },
  // ✅ 移除了 globalInjection: true
})
```

## Composition API vs Legacy API

### Legacy API (不推荐)

```vue
<!-- 配置 -->
const i18n = createI18n({
  legacy: true,  // 启用 Legacy 模式
  globalInjection: true,
})

<!-- 使用 -->
<template>
  <h1>{{ $t('key') }}</h1>  <!-- 全局 $t -->
</template>
```

### Composition API (推荐) ✅

```vue
<!-- 配置 -->
const i18n = createI18n({
  legacy: false,  // 使用 Composition API
})

<!-- 使用 -->
<script setup>
const { t } = useI18n()
</script>

<template>
  <h1>{{ t('key') }}</h1>  <!-- 局部 t -->
</template>
```

## 为什么选择 Composition API？

### 优势

1. **更好的 TypeScript 支持**
   - 完整的类型推导
   - 更安全的类型检查

2. **更清晰的依赖关系**
   - 明确知道组件使用了哪些功能
   - 更容易追踪和调试

3. **更小的打包体积**
   - 配合 `@intlify/unplugin-vue-i18n` 的优化选项
   - 可以按需导入功能

4. **符合 Vue 3 最佳实践**
   - 与 Vue 3 的 Composition API 风格一致
   - 更好的代码组织

### 与 CSP 兼容

配合之前的 CSP 修复：
```typescript
// vite.config.ts
VueI18nPlugin({
  runtimeOnly: true,        // 运行时模式
  compositionOnly: true,    // 仅 Composition API ✅
  fullInstall: false,
})
```

## 完整的使用模式

### 基础使用

```vue
<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <p>{{ t('message.hello') }}</p>
</template>
```

### 带参数的翻译

```vue
<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const username = 'Alice'
</script>

<template>
  <!-- JSON: "welcome": "Welcome, {name}!" -->
  <p>{{ t('message.welcome', { name: username }) }}</p>
</template>
```

### 多功能使用

```vue
<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { 
  t,           // 翻译函数
  locale,      // 当前语言
  availableLocales,  // 可用语言列表
  n,           // 数字格式化
  d            // 日期格式化
} = useI18n()

const switchLanguage = (lang: string) => {
  locale.value = lang
}
</script>
```

### 在 setup 函数中使用

```vue
<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'

const { t, locale } = useI18n()

// 可以在 computed 中使用
const greeting = computed(() => t('message.greeting'))

// 可以在函数中使用
const showMessage = () => {
  alert(t('message.confirm'))
}
</script>
```

## 验证修复

### 开发环境测试

1. 启动开发服务器：
   ```bash
   npm run dev
   ```

2. 检查控制台无错误

3. 测试语言切换功能

4. 验证翻译正常显示

### 生产环境测试

1. 构建生产版本：
   ```bash
   npm run build:win
   ```

2. 运行打包后的应用

3. 验证：
   - ✅ 无 CSP 错误
   - ✅ 无 Composition API 错误
   - ✅ 翻译正常工作
   - ✅ 语言切换正常

## 总结

### 关键要点

1. **Composition API 模式下必须使用 `useI18n()` 解构 `t` 函数**
2. **模板中使用 `t()` 而不是 `$t()`**
3. **移除 `globalInjection` 配置**
4. **配合 `compositionOnly: true` 优化打包**

### 问题已解决

✅ **Composition API 错误已修复**  
✅ **CSP 兼容性已确保**  
✅ **类型安全已增强**  
✅ **打包体积已优化**

现在应用可以在开发和生产环境下正常运行！
