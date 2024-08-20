<script setup lang="ts">
const count = ref(1)
const { data } = await useFetch('/api')

Logger.log(data.value)
</script>

<template>
  <el-input-number v-model="count" :min="1" :max="10" />
</template>
