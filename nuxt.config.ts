// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  extends: ['@nuxt/ui-pro'],

  nitro: {
    preset: 'cloudflare-pages',
    experimental: {
      wasm: true,
    },
  },

  modules: [
    'nitro-cloudflare-dev',
    '@nuxt/fonts',
    '@nuxt/ui',
    '@vueuse/nuxt',
    'nuxt-svgo',
  ],

  imports: {
    dirs: ['./app/composables/*', './app/composables/**/*'],
  },

  colorMode: {
    disableTransition: true,
  },

  routeRules: {
    // Temporary workaround for prerender regression. see https://github.com/nuxt/nuxt/issues/27490
    '/': { prerender: true },
  },

  devtools: {
    enabled: true,
  },

  ui: {
    safelistColors: ['primary', 'red', 'orange', 'green'],
  },

  typescript: {
    strict: false,
  },

  future: {
    compatibilityVersion: 4,
  },

  compatibilityDate: '2024-04-03',
})
