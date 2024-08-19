// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  imports: {
    dirs: ['./composables/*', './composables/**/*'],
  },
  nitro: {
    preset: 'cloudflare-pages',
    experimental: {
      wasm: true,
    },
    database: {
      // default: {
      //   connector: 'sqlite',
      //   options: { name: 'db' },
      // },
      default: {
        connector: 'cloudflare-d1',
        options: {
          binding: 'DB',
          database_name: 'prisma-demo-db',
          database_id: '00e63464-8034-48ce-bcf5-15584a844ffa',
        },
      },
    },
  },

  modules: ['nitro-cloudflare-dev', '@vueuse/nuxt', '@unocss/nuxt', 'nuxt-svgo'],
})
