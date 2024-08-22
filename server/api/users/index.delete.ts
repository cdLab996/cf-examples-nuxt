import { readBody, defineEventHandler } from 'h3'
import { sql } from 'drizzle-orm'
import { users } from '~/db/schema'

interface Query {
  id: string
}

export default defineEventHandler(async (event) => {
  const { logger } = event.context
  try {
    const { id } = await readBody<Query>(event)

    if (!id) {
      event.node.res.statusCode = 400
      return {
        code: 400,
        message: 'Missing ID in request body',
      }
    }

    const db = event.context.db

    // TODO: In actual business, it shouldn't be deleted, it should just be added with a logo
    const result = await db
      ?.delete(users)
      .where(sql`${users.id} = ${id}`)
      .returning()
      .get()

    logger.log('🚀 ~ defineEventHandler ~ result:', result)

    if (!result) {
      event.node.res.statusCode = 404
      return {
        code: 404,
        message: 'User not found',
      }
    }

    return {
      code: 0,
      message: 'User deleted successfully',
      data: result,
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
      data: [],
    }
  }
})
