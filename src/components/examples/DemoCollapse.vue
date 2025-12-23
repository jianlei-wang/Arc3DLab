<script setup lang="ts">
import { ref, defineAsyncComponent, shallowRef } from 'vue';

const activeNames = ref('1');
const activeDemo = shallowRef<any>(null);

// 使用 defineAsyncComponent 包装异步组件，并明确定义类型
const demoList = [
    {
        id: 'graph-vis',
        title: '知识图谱',
        items: [
            {
                id: 'antv-g6',
                name: 'AntvG6',
                component: defineAsyncComponent(() =>
                    import('./graph-vis/antv-g6/GraphView.vue')
                ),
            },
        ],
    },
];

const getImg = (pid: string, item: any) => {
    return new URL(`./${pid}/${item.id}/demo.png`, import.meta.url).href;
};

const selectDemo = (demo: any) => {
    activeDemo.value = demo;
};
</script>

<template>
    <el-collapse class="demo-collapse" v-model="activeNames" accordion>
        <el-collapse-item v-for="item in demoList" :key="item.id" :title="item.title" :name="item.id"
            class="demo-collapse-item">
            <span v-for="demo in item.items" :key="demo.id" class="demo-item" @click="selectDemo(demo)">
                <img :src="getImg(item.id, demo)" alt="" />
                <span>{{ demo.name }}</span>
            </span>
        </el-collapse-item>
    </el-collapse>
    <teleport to="#c-body">
        <div v-if="activeDemo" class="demo-modal">
            <div class="demo-modal-title">
                <span>示例：{{ activeDemo.name }}</span>
                <img src="@/assets/images/main/exit.png" alt="" @click="activeDemo = null">
            </div>
            <component :is="activeDemo.component" />
        </div>
    </teleport>
</template>



<style lang="scss" scoped>
.demo-collapse {
    padding: 5px 10px;

    :deep(.el-collapse-item) {
        .el-collapse-item__header {
            padding: 0;
        }
    }

    .demo-collapse-item {
        display: flex;
        flex-wrap: wrap;

        .demo-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            font-size: 12px;

            &:hover {
                cursor: pointer;
                color: var(--ev-color-active);

                img {
                    border: 1px solid var(--ev-color-active);
                }
            }

            img {
                width: 100px;
                height: 100px;
                border: 1px solid #ffffff40;
                border-radius: 5px;
                padding: 2px;
            }
        }
    }
}

.demo-modal {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: var(--ev-back-black);
    z-index: 9999;
    display: flex;
    flex-direction: column;

    .demo-modal-title {
        width: calc(100% - 40px);
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 5px 20px;
        background: var(--ev-back-primary);
        font-weight: bolder;
        color: var(--ev-color-active);

        img {
            cursor: pointer;
        }
    }
}
</style>