<script setup lang="ts">
import GitHub from '@/components/GitHub.vue';
import LanguageSwitcher from '@/components/LanguageSwitcher.vue';
import TimeNow from '@/components/TimeNow.vue';
import { ref, } from 'vue';
defineOptions({ name: '主菜单标题', inheritAttrs: false });
const items = ["project", "data", "edit", "view", "tools", "setting", "help"]
const activeItem = ref('')

</script>
<template>
  <div class="first-menu">
    <div class="menu-items">
      <div class="menu-item" :class="{ active: activeItem === item }" v-for="item in items" :key="item"
        @mouseenter="activeItem = item" @mouseleave="activeItem = ''">
        <span class="menu-item__text">{{ $t(`menu.${item}`) }}</span>
        <div v-if="activeItem === item" class="menu-item__dropdown"></div>
      </div>
    </div>
    <div class="menu-right">
      <LanguageSwitcher />
      <GitHub />
      <TimeNow />
    </div>

  </div>
</template>
<style lang="scss" scoped>
@use '@/styles/base.scss';

.first-menu {
  display: flex;
  background: linear-gradient(0deg, #1f201d 0%, #046cef 100%);

  .menu-items {
    display: flex;
    align-items: center;
    font-weight: 500;
    padding: 0 5px;

    .menu-item {
      position: relative;
      display: inline-flex;
      flex-direction: column;

      &.active,
      &:hover {
        cursor: pointer;

        .menu-item__text {
          color: var(--ev-color-active);
          background: linear-gradient(0deg, #047DD6 0%, #047dd600 100%);
        }
      }

      .menu-item__text {
        padding: 5px 15px;
        transition: all 0.3s ease;
        letter-spacing: 1px;
      }

      .menu-item__dropdown {
        position: absolute;
        top: 100%;
        left: 0;
        height: 100px;
        width: 100px;
        background: #17375D;
        border-top: 1px solid var(--ev-border-light);
        z-index: 1;
      }
    }
  }

  .menu-right {
    margin-left: auto;
    display: flex;
    align-items: center;
    gap: 15px;
    padding-right: 15px;
  }
}
</style>
