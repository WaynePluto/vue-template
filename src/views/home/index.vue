<template>
  <div>
    Home View
    <div>{{ log }}</div>
    <Counter />
  </div>
</template>
<script lang="ts" setup>
import Counter from '@/components/counter'

// 测试babel polyfill
const log = ref('test replaceAll')
try {
  log.value = log.value.replaceAll('l', 'A')
} catch (error) {
  log.value = log.value.replace(/l/g, 'E')
}
</script>
<style lang="scss" scoped></style>
