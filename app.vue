<script setup lang="ts">
onMounted(() => {
  // eslint-disable-next-line no-console
  console.log(123)
})
</script>

<template>
  <div class="flex">
    <NuxtRouteAnnouncer />
    <NuxtWelcome />
  </div>
</template>
