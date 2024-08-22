import { defineEventHandler } from 'h3'
import { users } from '~~/db/schema'

export default defineEventHandler(async (event) => {
  const { db, logger } = event.context
  try {
    // const query = db.select().from(users)
    // const result = await query.all()
    const result = await db?.select().from(users).all()
    logger.log('🚀 ~ defineEventHandler ~ result:', result)

    return {
      code: 0,
      message: 'ok',
      data: result,
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
