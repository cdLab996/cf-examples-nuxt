import logger from '../utils/logger'

export default defineEventHandler((event) => {
  logger.log('New request: ' + getRequestURL(event))

  event.context.logger = logger
})

declare module 'h3' {
  interface H3EventContext {
    logger: any
  }
}
