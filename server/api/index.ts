import { defineEventHandler } from 'h3'

export default defineEventHandler(() => {
  return {
    code: 0,
    message: 'ok',
    data: 'hello nuxt api',
  }
})
