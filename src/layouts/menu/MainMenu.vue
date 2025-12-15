<script setup lang="ts">
import LanguageSwitcher from '@/components/LanguageSwitcher.vue';
defineOptions({ name: '主菜单标题', inheritAttrs: false });
</script>
<template>
  <div class="first-menu">
    <div>
      <span>{{ $t('menu.project') }}</span>
    </div>
    <LanguageSwitcher />
  </div>
</template>
<style lang="scss" scoped>
.first-menu {
  display: flex;

  background: linear-gradient(0deg, #1f201d 0%, #046cef 100%);
}
</style>
