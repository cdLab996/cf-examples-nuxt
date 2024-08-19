<script setup lang="ts">
const appConfig = useAppConfig()

const links = [
  {
    id: 'home',
    label: 'Home',
    icon: 'i-heroicons-home',
    to: '/',
    tooltip: {
      text: 'Home',
      shortcuts: ['G', 'H'],
    },
  },
  {
    id: 'inbox',
    label: 'Inbox',
    icon: 'i-heroicons-inbox',
    to: '/inbox',
  },
  {
    id: 'settings',
    label: 'Settings',
    to: '/settings/index',
    icon: 'i-heroicons-cog-8-tooth',
    children: [
      {
        label: 'General',
        to: '/settings',
      },
      {
        label: 'Members',
        to: '/settings/members',
      },
    ],
  },
  {
    id: 'users',
    label: 'Users',
    icon: 'i-heroicons-user-group',
    to: '/users',
  },
]

const defaultColors = ref(
  ['green', 'teal', 'cyan', 'sky', 'blue', 'indigo', 'violet'].map((color) => ({
    label: color,
    chip: color,
    click: () => (appConfig.ui.primary = color),
  }))
)

const colors = computed(() =>
  defaultColors.value.map((color) => ({
    ...color,
    active: appConfig.ui.primary === color.label,
  }))
)
</script>

<template>
  <UDashboardLayout>
    <UDashboardPanel :width="250" :resizable="{ min: 200, max: 300 }" collapsible>
      <UDashboardNavbar class="!border-transparent" :ui="{ left: 'flex-1' }">
        <template #left>
          <div class="w-full">
            <UButton color="gray" variant="ghost" class="w-full">
              <span class="truncate text-gray-900 dark:text-white font-semibold">
                URL shortener
              </span>
            </UButton>
          </div>
        </template>
      </UDashboardNavbar>

      <UDashboardSidebar>
        <UDashboardSidebarLinks :links="links" />

        <UDivider />

        <UDashboardSidebarLinks
          :links="[{ label: 'Colors', draggable: true, children: colors }]"
          @update:links="(colors) => (defaultColors = colors)"
        />

        <div class="flex-1" />

        <div class="text-sm truncate text-center">Copyright (c) 2024-PRESENT</div>

        <UDivider class="sticky bottom-0" />

        <template #footer>
          <!-- ~/components/UserDropdown.vue -->
          <UserDropdown />
        </template>
      </UDashboardSidebar>
    </UDashboardPanel>
    <slot />
  </UDashboardLayout>
</template>
