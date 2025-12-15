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
  localStorage.setItem('locale', currentLocale.value)
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
