<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
defineOptions({ name: "TimeNow时间", inheritAttrs: false });

const currentTime = ref('')
let timer: number | null = null

const updateTime = () => {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const date = String(now.getDate()).padStart(2, '0')
    const hours = String(now.getHours()).padStart(2, '0')
    const minutes = String(now.getMinutes()).padStart(2, '0')
    const seconds = String(now.getSeconds()).padStart(2, '0')
    const weekDays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
    const weekDay = weekDays[now.getDay()]
    currentTime.value = `${year}-${month}-${date} ${weekDay} ${hours}:${minutes}:${seconds}`
}

onMounted(() => {
    updateTime()
    timer = setInterval(updateTime, 1000)
})

onUnmounted(() => {
    timer && clearInterval(timer)
})
</script>

<template>
    <div class="time-now">
        <span class="time-display">{{ currentTime }}</span>
    </div>
</template>

<style lang="scss" scoped>
.time-now {
    display: inline-flex;
    align-items: center;
    padding-top: 2px;
    font-size: 12px;

    .time-display {
        color: #ffffffe6;
        font-family: 'Courier New', monospace;
        letter-spacing: 1px;
    }
}
</style>
