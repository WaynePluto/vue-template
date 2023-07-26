<template>
  <div>
    Home View
    <div>{{ log }}</div>
  </div>
</template>
<script lang="ts" setup>
const log = ref('test replaceAll')
try {
  log.value = log.value.replaceAll('l', 'A')
} catch (error) {
  log.value = log.value.replace(/l/g, 'E')
}
</script>
<style lang="scss" scoped></style>
