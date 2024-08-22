import { defineEventHandler, getRequestURL } from 'h3'
import { consola } from 'consola'
import type { ConsolaInstance } from 'consola'

const createLoggerWithTimestamp = (tag: string) =>
  consola.withTag(
    `${tag}: ${new Date().toLocaleString()}.${new Date().getMilliseconds()}`
  )

const serverLog = createLoggerWithTimestamp('server-log')

export default defineEventHandler((event) => {
  serverLog.log('New request: ' + getRequestURL(event))

  event.context.logger = serverLog
})

declare module 'h3' {
  interface H3EventContext {
    logger: ConsolaInstance
  }
}
