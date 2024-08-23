import { defineEventHandler } from 'h3'
import { urls } from '~~/db/schema'

export default defineEventHandler(async (event) => {
  const { db, logger } = event.context

  try {
    const allUrls = await db.select().from(urls).all()

    logger.log('🚀 ~ defineEventHandler ~ allUrls:', allUrls)

    return {
      code: 0,
      message: 'ok',
      data: allUrls,
    }
  } catch (error) {
    logger.error('🚀 ~ defineEventHandler ~ error:', error)
    event.node.res.statusCode = 500
    let errorMessage = 'Internal Server Error'
    if (error instanceof Error) {
      errorMessage = error.message
    }

    return {
      code: 500,
      message: errorMessage,
      data: [],
    }
  }
})
