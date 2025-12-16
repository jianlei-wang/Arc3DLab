import { createI18n } from 'vue-i18n'
import zhCN from './locales/zh-CN.json'
import enUS from './locales/en-US.json'

// 从 localStorage 获取语言设置，默认为中文
const getDefaultLocale = () => {
  const savedLocale = localStorage.getItem('locale')
  // 确保返回有效的语言标识符
  if (savedLocale === 'zh-CN' || savedLocale === 'en-US') {
    return savedLocale
  }
  return 'zh-CN'
}

const i18n = createI18n({
  legacy: false, // 使用 Composition API 模式
  locale: getDefaultLocale(), // 默认语言
  fallbackLocale: 'en-US', // 回退语言
  globalInjection: true,
  messages: {
    'zh-CN': zhCN,
    'en-US': enUS,
  },
})

// 监听页面可见性变化，确保在页面重新激活时使用最新的语言设置
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) {
    const savedLocale = localStorage.getItem('locale')
    // 确保是有效的语言标识符
    if ((savedLocale === 'zh-CN' || savedLocale === 'en-US') && i18n.global.locale.value !== savedLocale) {
      i18n.global.locale.value = savedLocale as 'zh-CN' | 'en-US'
    }
  }
})

export default i18n