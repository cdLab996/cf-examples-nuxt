import { defineEventHandler, readBody } from 'h3'
import { eq } from 'drizzle-orm'
import { urls, urlAnalytics } from '~~/db/schema'

interface Query {
  id: string
  shortCode: string
  expiresIn?: string
}

export default defineEventHandler(async (event) => {
  const { db, logger } = event.context
  const { id: idParam, shortCode, expiresIn } = await readBody<Query>(event)

  try {
    const id = Number.parseInt(idParam, 10)

    if (Number.isNaN(id)) {
      logger.warn('Invalid ID provided:', idParam)
      event.node.res.statusCode = 400
      return {
        code: 400,
        message: 'Invalid ID provided',
        data: null,
      }
    }

    /**
     * why no use transaction
     *
     * https://github.com/drizzle-team/drizzle-orm/issues/2463
     */
    const existingUrl = await db?.select().from(urls).where(eq(urls.id, id)).get()

    if (!existingUrl) {
      logger.warn('ID not found:', id)
      event.node.res.statusCode = 404
      return {
        code: 404,
        message: 'ID not found',
        data: null,
      }
    }

    let previousClickCount = 0

    if (existingUrl.shortCode !== shortCode) {
      const shortCodeExists = await db
        ?.select()
        .from(urls)
        .where(eq(urls.shortCode, shortCode))
        .get()

      if (shortCodeExists) {
        logger.warn('Short code already exists:', shortCode)
        event.node.res.statusCode = 409 // Conflict
        throw new Error('Short code already exists')
      }

      // 获取当前的 clickCount 并保存为 previousClickCount
      const analytics = await db
        ?.select()
        .from(urlAnalytics)
        .where(eq(urlAnalytics.shortCode, existingUrl.shortCode))
        .get()

      if (analytics) {
        previousClickCount = analytics?.clickCount || 0

        // 删除 urlAnalytics 表中的相关记录以避免外键约束失败
        await db
          ?.delete(urlAnalytics)
          .where(eq(urlAnalytics.shortCode, existingUrl.shortCode))
          .run()
      }
    }

    const updateData: Partial<{ shortCode: string; expirationDate?: number }> = {
      shortCode,
    }

    if (expiresIn) {
      updateData.expirationDate = Number.parseInt(expiresIn)
    }

    await db?.update(urls).set(updateData).where(eq(urls.id, id)).run()

    if (existingUrl.shortCode !== shortCode) {
      // 重新插入 urlAnalytics 表中的记录
      await db
        ?.insert(urlAnalytics)
        .values({
          shortCode,
          clickCount: previousClickCount,
        })
        .run()
    }

    logger.log('Short code and expiration date updated successfully for ID:', id)

    return {
      code: 0,
      message: 'Short code and expiration date updated successfully',
      data: {
        id,
        shortCode,
        expiresIn: expiresIn ? Number.parseInt(expiresIn) : undefined,
      },
    }
  } catch (error) {
    logger.error('Error updating record for ID:', error)
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
