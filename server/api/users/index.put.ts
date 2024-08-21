import { readBody, defineEventHandler } from 'h3'
import { sql } from 'drizzle-orm'
import { users } from '~/db/schema'
import { isValidEmail } from '~/server/utils/validate'
import Logger from '~/composables/Logger'

interface Query {
  id: string
  name?: string
  email?: string
}

export default defineEventHandler(async (event) => {
  try {
    const { id, name, email } = await readBody<Query>(event)

    if (!id) {
      event.node.res.statusCode = 400
      return {
        code: 400,
        message: 'Missing ID in request body',
      }
    }

    if (!name && !email) {
      event.node.res.statusCode = 400
      return {
        code: 400,
        message: 'At least one field (name or email) must be provided for update',
      }
    }

    if (email && !isValidEmail(email)) {
      event.node.res.statusCode = 400
      return {
        code: 400,
        message: 'Invalid email format',
        data: {
          field: 'email',
        },
      }
    }

    const db = event.context.db

    const updateData: Partial<Query> = {}
    if (name) updateData.name = name
    if (email) updateData.email = email

    const result = await db
      ?.update(users)
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      .set(updateData)
      .where(sql`${users.id} = ${id}`)
      .returning()
      .get()

    Logger.log('🚀 ~ defineEventHandler ~ result:', result)

    if (!result) {
      event.node.res.statusCode = 404
      return {
        code: 404,
        message: 'User not found',
      }
    }

    return {
      code: 0,
      message: 'User updated successfully',
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
