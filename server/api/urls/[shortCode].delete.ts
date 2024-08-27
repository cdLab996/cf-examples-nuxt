import { defineEventHandler, getRouterParam } from 'h3'
import { eq } from 'drizzle-orm'
import { urls, urlAnalytics } from '~~/db/schema'

export default defineEventHandler(async (event) => {
  const { db, logger } = event.context
  const shortCode = getRouterParam(event, 'shortCode')
  logger.info(`Attempting to delete URL and analytics for ShortCode: ${shortCode}`)

  try {
    if (!shortCode) {
      logger.warn('Short code not provided')
      event.node.res.statusCode = 400
      return {
        code: 400,
        message: 'Short code not provided',
      }
    }

    const analyticsDeleteResult = await db
      ?.delete(urlAnalytics)
      .where(eq(urlAnalytics.shortCode, shortCode))
      .run()
    logger.info(
      `Deleted analytics for ShortCode ${shortCode}, Result: ${analyticsDeleteResult}`
    )

    const urlDeleteResult = await db
      ?.delete(urls)
      .where(eq(urls.shortCode, shortCode))
      .run()
    logger.info(`Deleted URL for ShortCode ${shortCode}, Result: ${urlDeleteResult}`)

    return {
      code: 0,
      message: 'URL deleted successfully',
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
