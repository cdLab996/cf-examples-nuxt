import { defineEventHandler, readBody } from 'h3'
import { eq } from 'drizzle-orm'
import { urls, urlAnalytics } from '~~/db/schema'

interface Query {
  shortCode: string
}

export default defineEventHandler(async (event) => {
  const { db, logger } = event.context
  const { shortCode } = await readBody<Query>(event)

  try {
    if (!shortCode) {
      logger.warn('Short code not provided')
      event.node.res.statusCode = 400
      return {
        code: 400,
        message: 'Short code not provided',
      }
    }

    await db?.delete(urls).where(eq(urls.shortCode, shortCode)).run()
    await db?.delete(urlAnalytics).where(eq(urlAnalytics.shortCode, shortCode)).run()

    logger.info(`URL with ShortCode ${shortCode}, deleted successfully`)

    return {
      code: 0,
      message: 'URL deleted successfully',
      data: [],
    }
  } catch (error) {
    logger.error(`Error deleting URL with ShortCode ${shortCode}:`, error)
    event.node.res.statusCode = 500
    return {
      code: 500,
      message: 'Internal Server Error',
    }
  }
})
