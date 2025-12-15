<script setup lang="ts">
import { onMounted, ref } from 'vue';

defineOptions({ name: "GitHub状态", inheritAttrs: false });

// GitHub 仓库信息
const REPO_OWNER = "jianlei-wang";
const REPO_NAME = "Arc3DLab";
const repoStats = ref({
  stars: 0,
  forks: 0,
  watchers: 0,
  loading: true,
});

// 获取 GitHub 仓库数据
const fetchGithubStats = async () => {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}`
    );
    if (response.ok) {
      const data = await response.json();
      repoStats.value = {
        stars: data.stargazers_count,
        forks: data.forks_count,
        watchers: data.subscribers_count,
        loading: false,
      };
    } else {
      repoStats.value.loading = false;
    }
  } catch (error) {
    repoStats.value.loading = false;
  }
};

const openGithub = () => {
  const url = `https://github.com/${REPO_OWNER}/${REPO_NAME}`;
  const electronAPI = window.electronAPI;
  typeof electronAPI !== "undefined" && electronAPI?.openExternal
    ? electronAPI.openExternal(url)
    : window.open(url, "_blank");
};

onMounted(() => {
  fetchGithubStats();
});
</script>
<template>
  <div class="menu-right__item github-stats" @click="openGithub">
    <img src="@/assets/images/github.png" alt="github" class="github-icon" />
    <div v-if="!repoStats.loading" class="stats-container">
      <div class="stat-item" title="Watchers">
        <svg class="stat-icon" viewBox="0 0 16 16" width="12" height="12">
          <path fill="currentColor"
            d="M8 2c1.981 0 3.671.992 4.933 2.078 1.27 1.091 2.187 2.345 2.637 3.023a1.62 1.62 0 0 1 0 1.798c-.45.678-1.367 1.932-2.637 3.023C11.67 13.008 9.981 14 8 14c-1.981 0-3.671-.992-4.933-2.078C1.797 10.83.88 9.576.43 8.898a1.62 1.62 0 0 1 0-1.798c.45-.677 1.367-1.931 2.637-3.022C4.33 2.992 6.019 2 8 2ZM1.679 7.932a.12.12 0 0 0 0 .136c.411.622 1.241 1.75 2.366 2.717C5.176 11.758 6.527 12.5 8 12.5c1.473 0 2.825-.742 3.955-1.715 1.124-.967 1.954-2.096 2.366-2.717a.12.12 0 0 0 0-.136c-.412-.621-1.242-1.75-2.366-2.717C10.824 4.242 9.473 3.5 8 3.5c-1.473 0-2.825.742-3.955 1.715-1.124.967-1.954 2.096-2.366 2.717ZM8 10a2 2 0 1 1-.001-3.999A2 2 0 0 1 8 10Z">
          </path>
        </svg>
        <span class="stat-value">{{ repoStats.watchers }}</span>
      </div>
      <div class="stat-item" title="Forks">
        <svg class="stat-icon" viewBox="0 0 16 16" width="12" height="12">
          <path fill="currentColor"
            d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 1 1.5 0v.878a2.25 2.25 0 0 1-2.25 2.25h-1.5v2.128a2.251 2.251 0 1 1-1.5 0V8.5h-1.5A2.25 2.25 0 0 1 3.5 6.25v-.878a2.25 2.25 0 1 1 1.5 0ZM5 3.25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Zm6.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm-3 8.75a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z">
          </path>
        </svg>
        <span class="stat-value">{{ repoStats.forks }}</span>
      </div>
      <div class="stat-item" title="Stars">
        <svg class="stat-icon" viewBox="0 0 16 16" width="12" height="12">
          <path fill="currentColor"
            d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Zm0 2.445L6.615 5.5a.75.75 0 0 1-.564.41l-3.097.45 2.24 2.184a.75.75 0 0 1 .216.664l-.528 3.084 2.769-1.456a.75.75 0 0 1 .698 0l2.77 1.456-.53-3.084a.75.75 0 0 1 .216-.664l2.24-2.183-3.096-.45a.75.75 0 0 1-.564-.41L8 2.694Z">
          </path>
        </svg>
        <span class="stat-value">{{ repoStats.stars }}</span>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.github-stats {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background-color 0.2s;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }

  .github-icon {
    width: 20px;
    height: 20px;
  }

  .stats-container {
    display: flex;
    gap: 10px;

    .stat-item {
      display: flex;
      align-items: center;
      gap: 3px;
      color: rgba(255, 255, 255, 0.9);
      font-size: 12px;

      .stat-icon {
        opacity: 0.8;
      }

      .stat-value {
        font-weight: 500;
      }
    }
  }
}
</style>
