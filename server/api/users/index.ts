import { defineEventHandler } from 'h3'
import { users } from '~/db/schema'
import Logger from '~/composables/Logger'

export default defineEventHandler(async (event) => {
  try {
    const db = event.context.db

    // const query = db.select().from(users)
    // const result = await query.all()
    const result = await db?.select().from(users).all()
    Logger.log('🚀 ~ defineEventHandler ~ result:', result)

    return {
      code: 0,
      message: 'ok',
      data: result,
    }
  } catch (error) {
    Logger.error('🚀 ~ defineEventHandler ~ error:', error)
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
