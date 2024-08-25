import { defineEventHandler } from 'h3'
import { sql } from 'drizzle-orm'
import { urlAnalytics } from '~~/db/schema'

export default defineEventHandler(async (event) => {
  const { db, logger } = event.context

  try {
    // 获取总点击数
    const totalClicksResult = await db
      ?.select({ totalClicks: sql<number>`SUM(${urlAnalytics.clickCount})` })
      .from(urlAnalytics)
      .get()

    const totalClicks = totalClicksResult?.totalClicks || 0

    // 获取点击量最多的短链接
    const topUrls = await db
      ?.select({
        shortCode: urlAnalytics.shortCode,
        clickCount: urlAnalytics.clickCount,
      })
      .from(urlAnalytics)
      .orderBy(sql`${urlAnalytics.clickCount} DESC`)
      .limit(10)
      .all()

    return {
      code: 0,
      message: 'ok',
      data: {
        totalClicks,
        topUrls,
      },
    }
  } catch (error) {
    logger.error('Error fetching analytics data:', error)
    event.node.res.statusCode = 500
    return {
      code: 500,
      message: 'Internal Server Error',
      data: null,
    }
  }
})
