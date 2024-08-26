import { defineEventHandler, getRequestURL } from 'h3'
import logger from '../utils/logger'

export default defineEventHandler((event) => {
  const { method } = event.node.req
  const url = getRequestURL(event)

  logger.info(`New request: ${method} ${url}`)

  event.context.logger = logger
})

declare module 'h3' {
  interface H3EventContext {
    logger: typeof logger
  }
}
