import { defineEventHandler, getQuery, readBody } from 'h3'
import { eq } from 'drizzle-orm'
import { urls } from '~~/db/schema'

interface Query {
  shortCode: string
}

export default defineEventHandler(async (event) => {
  const { db, logger } = event.context

  try {
    const { shortCode } = getQuery<Query>(event)
    const { url } = await readBody(event)

    // 查找是否存在对应的短码
    const existingUrl = await db
      .select()
      .from(urls)
      .where(eq(urls.shortCode, shortCode))
      .get()

    if (!existingUrl) {
      logger.warn('Short code not found:', shortCode)
      event.node.res.statusCode = 404
      return {
        code: 404,
        message: 'Short code not found',
        data: null,
      }
    }

    // 更新短码对应的 URL
    await db.update(urls).set({ url }).where(eq(urls.shortCode, shortCode)).run()

    logger.log('URL updated successfully for short code:', shortCode)

    return {
      code: 0,
      message: 'URL updated successfully',
      data: { shortCode, url },
    }
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
