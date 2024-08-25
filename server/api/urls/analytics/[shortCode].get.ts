import { defineEventHandler } from 'h3'
import { eq } from 'drizzle-orm'
import { urlAnalytics } from '~~/db/schema'

export default defineEventHandler(async (event) => {
  const { db, logger } = event.context

  try {
    const shortCode = event.context.params?.shortCode

    if (!shortCode) {
      logger.warn('Short code not provided')
      event.node.res.statusCode = 400
      return {
        code: 400,
        message: 'Short code not provided',
      }
    }

    // 查询该短链接的点击次数
    const result = await db
      ?.select({
        clickCount: urlAnalytics.clickCount,
      })
      .from(urlAnalytics)
      .where(eq(urlAnalytics.shortCode, shortCode))
      .get()

    const clickCount = result?.clickCount || 0

    return {
      code: 0,
      message: 'ok',
      data: { shortCode, clickCount },
    }
  } catch (error) {
    logger.error('Error fetching analytics for short code:', error)
    event.node.res.statusCode = 500
    return {
      code: 500,
      message: 'Internal Server Error',
      data: null,
    }
  }
})
