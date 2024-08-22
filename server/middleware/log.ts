import { defineEventHandler, getRequestURL } from 'h3'
import { serverLog } from '~/composables/logger'

export default defineEventHandler((event) => {
  serverLog.log('New request: ' + getRequestURL(event))
})
