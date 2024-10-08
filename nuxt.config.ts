// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',

  // https://nuxt.com/docs/getting-started/upgrade#testing-nuxt-4
  future: { compatibilityVersion: 4 },

  devtools: { enabled: true },
  // imports: {
  //   dirs: ['./app/composables/*', './app/composables/**/*'],
  // },
  nitro: {
    preset: 'cloudflare-pages',
    experimental: {
      wasm: true,
      database: true,
    },
    database: {
      default: {
        connector: 'cloudflare-d1',
        options: {
          bindingName: 'DB',
        },
      },
    },
  },
  runtimeConfig: {
    dbType: process.env.NUXT_DB_TYPE,
    redirectUrl: process.env.NUXT_REDIRECT_URL,
    public: {
      redirectUrl: process.env.NUXT_REDIRECT_URL,
    },
  },

  modules: ['nitro-cloudflare-dev', '@vueuse/nuxt', '@unocss/nuxt', '@element-plus/nuxt'],
})
