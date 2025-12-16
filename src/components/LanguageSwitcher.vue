<template>
  <div class="language-switcher">
    <select v-model="currentLocale" @change="changeLocale">
      <option value="zh-CN">{{ t('language.zh-CN') }}</option>
      <option value="en-US">{{ t('language.en-US') }}</option>
    </select>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

// 定义 IPC 调用（在 Electron 环境中可用）
const setLocaleInMainProcess = (locale: string) => {
  if (window.electronAPI && typeof window.electronAPI.setLocale === 'function') {
    window.electronAPI.setLocale(locale)
  }
}

const { locale, t } = useI18n()

// 初始化时从 localStorage 获取保存的语言设置
const savedLocale = localStorage.getItem('locale')
if (savedLocale) {
  locale.value = savedLocale
}

const currentLocale = computed({
  get: () => locale.value,
  set: (val) => {
    locale.value = val
  }
})

const changeLocale = () => {
  // 保存到 localStorage
  localStorage.setItem('locale', currentLocale.value)
  // 确保更新 i18n 实例
  locale.value = currentLocale.value
  // 通知主进程更新语言设置
  setLocaleInMainProcess(currentLocale.value)
}
</script>

<style lang="scss" scoped>
.language-switcher {
  display: inline-block;

  select {
    padding: 3px 5px;
    font-size: 14px;
    cursor: pointer;
    outline: none;
    font-size: 12px;
    background-color: #ffffff1a;
    color: #fff;
    border: 1px solid #ffffff33;
    border-radius: 4px;

    &:hover {
      background-color: #ffffff26;
    }

    &:focus {
      background-color: #ffffff26;
      box-shadow: 0 0 0 2px #646cff1a;
    }

    option {
      background-color: #2c3e50;
      color: #fff;
      padding: 5px;
    }
  }
}
</style>