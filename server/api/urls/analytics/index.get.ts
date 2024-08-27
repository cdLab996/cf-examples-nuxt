import { defineEventHandler } from 'h3'
import { sql } from 'drizzle-orm'
import { urlAnalytics } from '~~/db/schema'

export default defineEventHandler(async (event) => {
  const { db, logger } = event.context

  try {
    const [{ totalClicks }] = await db
      ?.select({ totalClicks: sql`SUM(${urlAnalytics.clickCount})` })
      .from(urlAnalytics)
      .all()

    const allUrls = await db?.select().from(urlAnalytics).all()

    logger.log('🚀 ~ defineEventHandler ~ allUrls:', allUrls)

    return {
      code: 0,
      message: 'ok',
      data: {
        totalClicks: totalClicks || 0,
        allUrls,
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
