import { defineEventHandler, readBody } from 'h3'
import { eq, or } from 'drizzle-orm'
import { urls, urlAnalytics } from '~~/db/schema'

interface Query {
  id?: string
  shortCode?: string
}

export default defineEventHandler(async (event) => {
  const { db, logger } = event.context
  const { id: idParam, shortCode } = await readBody<Query>(event)

  try {
    if (!idParam && !shortCode) {
      logger.warn('Neither ID nor ShortCode provided')
      event.node.res.statusCode = 400
      return {
        code: 400,
        message: 'ID or ShortCode must be provided',
      }
    }

    const id = idParam ? Number.parseInt(idParam, 10) : Number.NaN

    if (idParam && Number.isNaN(id)) {
      logger.warn('Invalid ID provided')
      event.node.res.statusCode = 400
      return {
        code: 400,
        message: 'Invalid ID provided',
      }
    }

    // 手动删除 urlAnalytics 表中的相关记录
    if (shortCode) {
      await db?.delete(urlAnalytics).where(eq(urlAnalytics.shortCode, shortCode)).run()
    } else if (!Number.isNaN(id)) {
      const urlRecord = await db?.select().from(urls).where(eq(urls.id, id)).get()

      if (urlRecord) {
        await db
          ?.delete(urlAnalytics)
          .where(eq(urlAnalytics.shortCode, urlRecord.shortCode))
          .run()
      }
    }

    // 删除 urls 表中的记录
    const deleteResult = await db
      ?.delete(urls)
      .where(
        or(
          idParam ? eq(urls.id, id) : undefined,
          shortCode ? eq(urls.shortCode, shortCode) : undefined
        )
      )
      .run()

    if (deleteResult.changes === 0) {
      logger.warn(
        `No URL found with ${idParam ? 'ID' : 'ShortCode'} ${idParam || shortCode}`
      )
      event.node.res.statusCode = 404
      return {
        code: 404,
        message: `No URL found with the provided ${idParam ? 'ID' : 'ShortCode'}`,
      }
    }

    logger.info(
      `URL with ${idParam ? 'ID' : 'ShortCode'} ${idParam || shortCode} deleted successfully`
    )

    return {
      code: 0,
      message: 'URL deleted successfully',
    }
  } catch (error) {
    logger.error(
      `Error deleting URL with ${idParam ? 'ID' : 'ShortCode'} ${idParam || shortCode}:`,
      error
    )
    event.node.res.statusCode = 500
    return {
      code: 500,
      message: 'Internal Server Error',
    }
  }
})
