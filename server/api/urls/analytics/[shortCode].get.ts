import { defineEventHandler, getRouterParam } from 'h3'
import { eq } from 'drizzle-orm'
import { urlAnalytics } from '~~/db/schema'

export default defineEventHandler(async (event) => {
  const { db, logger } = event.context

  try {
    const shortCode = getRouterParam(event, 'shortCode')

    if (!shortCode) {
      logger.warn('Short code not provided')
      event.node.res.statusCode = 400
      return {
        code: 400,
        message: 'Short code not provided',
      }
    }

    const analytics = await db
      ?.select()
      .from(urlAnalytics)
      .where(eq(urlAnalytics.shortCode, shortCode))
      .get()

    const clickCount = analytics?.clickCount || 0

    logger.log(`🚀 ~ Analytics for shortCode ${shortCode}:`, { clickCount })

    return {
      code: 0,
      message: 'ok',
      data: {
        shortCode,
        clickCount,
      },
    }
  } catch (error) {
    event.node.res.statusCode = 500
    let errorMessage = 'Internal Server Error'
    if (error instanceof Error) {
      errorMessage = error.message
    }

    return {
      code: 500,
      message: errorMessage,
      data: null,
    }
  }
})
