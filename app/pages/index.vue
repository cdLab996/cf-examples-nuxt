<script setup lang="ts">
import logger from '../composables/logger'

onMounted(() => {
  logger.log('index page')
})
</script>

<template>
  <div>index</div>
</template>
