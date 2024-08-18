// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  imports: {
    dirs: ['./composables/*', './composables/**/*'],
  },
  nitro: {
    preset: 'cloudflare-pages',
  },

  modules: ['nitro-cloudflare-dev', '@vueuse/nuxt', '@unocss/nuxt', 'nuxt-svgo'],
})
