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

const { locale, t } = useI18n()

const currentLocale = computed({
  get: () => locale.value,
  set: (val) => {
    locale.value = val
  }
})

const changeLocale = () => {
  // 保存语言设置到 localStorage
  localStorage.setItem('locale', currentLocale.value)
}
</script>

<style scoped>
.language-switcher {
  display: inline-block;
}

.language-switcher select {
  padding: 8px 12px;
  font-size: 14px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
  cursor: pointer;
  outline: none;
}

.language-switcher select:hover {
  border-color: #646cff;
}

.language-switcher select:focus {
  border-color: #646cff;
  box-shadow: 0 0 0 2px rgba(100, 108, 255, 0.1);
}
</style>
