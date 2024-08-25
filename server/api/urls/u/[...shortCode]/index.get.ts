import { defineEventHandler } from 'h3'
import { eq } from 'drizzle-orm'
import { urls, urlAnalytics } from '~~/db/schema'

export default defineEventHandler(async (event) => {
  const { db, logger } = event.context

  try {
    const shortCode = event.context.params?.shortCode
    logger.warn('🚀 ~ defineEventHandler ~ shortCode:', shortCode)

    if (!shortCode) {
      logger.warn('Short code not provided')
      event.node.res.statusCode = 400
      return {
        code: 400,
        message: 'Short code not provided',
      }
    }

    // 获取请求的用户代理信息
    const userAgent = event.node.req.headers['user-agent'] || ''

    // 如果用户代理是社交媒体爬虫，重定向到 OpenGraph 页面
    if (userAgent.includes('facebookexternalhit') || userAgent.includes('twitterbot')) {
      return sendRedirect(event, `/api/urls/${shortCode}/og`, 302)
    }

    // 查询数据库中的短码信息
    const urlData = await db
      ?.select()
      .from(urls)
      .where(eq(urls.shortCode, shortCode))
      .get()

    if (!urlData) {
      logger.warn('Short code not found:', shortCode)
      event.node.res.statusCode = 404
      return {
        code: 404,
        message: 'Short code not found',
      }
    }

    const { url, expirationDate } = urlData

    // 检查是否已过期
    if (expirationDate && Date.now() > expirationDate) {
      await db?.delete(urls).where(eq(urls.shortCode, shortCode)).run()
      logger.warn('Short code expired and deleted:', shortCode)
      event.node.res.statusCode = 404
      return {
        code: 404,
        message: 'Short code expired',
      }
    }

    // 查询当前点击次数
    const currentClickCount = await db
      ?.select()
      .from(urlAnalytics)
      .where(eq(urlAnalytics.shortCode, shortCode))
      .get()

    if (!currentClickCount) {
      // 如果不存在点击次数，插入新的记录
      await db
        ?.insert(urlAnalytics)
        .values({
          shortCode,
          clickCount: 1,
        })
        .run()
      logger.log('Inserted new analytics record for:', shortCode)
    } else {
      // 否则更新现有记录的点击次数
      const newClickCount = (currentClickCount?.clickCount || 0) + 1
      await db
        ?.update(urlAnalytics)
        .set({ clickCount: newClickCount })
        .where(eq(urlAnalytics.shortCode, shortCode))
        .run()
      logger.log(
        'Updated analytics record for:',
        shortCode,
        'with new click count:',
        newClickCount
      )
    }

    // 重定向到目标 URL
    return sendRedirect(event, url, 302)
  } catch (error) {
    logger.error('Error updating URL:', error)
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
