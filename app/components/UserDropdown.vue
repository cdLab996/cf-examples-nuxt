<script setup lang="ts">
const items = computed(() => [
  [
    {
      slot: 'headline',
      label: 'Theme',
      disabled: true,
    },
    {
      label: 'Light',
      icon: 'i-heroicons-sun-solid',
      click: () => handleThemeChange('light'),
    },
    {
      label: 'Dark',
      icon: 'i-heroicons-moon-solid',
      click: () => handleThemeChange('dark'),
    },
  ],
  [
    {
      label: 'GitHub repository',
      icon: 'i-simple-icons-github',
      to: 'https://github.com/WuChenDi/webrtc-examples',
      target: '_blank',
    },
  ],
])

function handleThemeChange(newTheme: 'dark' | 'light') {
  const themeClasses = ['dark', 'light']

  themeClasses.forEach((theme) => document.documentElement.classList.remove(theme))

  document.documentElement.classList.add(newTheme)
}
</script>

<template>
  <UDropdown
    mode="hover"
    :items="items"
    :ui="{ width: 'w-full', item: { disabled: 'cursor-text select-text' } }"
    :popper="{ strategy: 'absolute', placement: 'top' }"
    class="w-full"
  >
    <template #default="{ open }">
      <UButton
        color="gray"
        variant="ghost"
        class="w-full"
        label="Chendi Wu (wudi)"
        :class="[open && 'bg-gray-50 dark:bg-gray-800']"
      >
        <template #leading>
          <UAvatar
            src="https://avatars.githubusercontent.com/u/31385662?v=4"
            size="2xs"
          />
        </template>

        <template #trailing>
          <UIcon name="i-heroicons-ellipsis-vertical" class="w-5 h-5 ml-auto" />
        </template>
      </UButton>
    </template>
  </UDropdown>
</template>
