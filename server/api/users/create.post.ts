import { readBody } from 'h3'
import { users } from '~/db/schema'
import { isValidEmail } from '~/server/utils/validate'
import { serverLog } from '~/composables/logger'

interface Query {
  name: string
  email: string
}

interface ValidationError {
  code: number
  message: string
  data: Record<string, any>
}

interface ValidationResult {
  valid: boolean
  data?: Query
  error?: ValidationError
}

function validateAndPrepareData(data: Query): ValidationResult {
  const { name, email } = data
  const missingFields: string[] = []

  if (!name) {
    missingFields.push('name')
  }
  if (!email) {
    missingFields.push('email')
  }

  if (missingFields.length > 0) {
    return {
      valid: false,
      error: {
        code: 400,
        message: 'Missing required fields',
        data: {
          missingFields,
        },
      },
    }
  }

  if (!isValidEmail(email)) {
    return {
      valid: false,
      error: {
        code: 400,
        message: 'Invalid email format',
        data: {
          field: 'email',
        },
      },
    }
  }

  return { valid: true, data: { name, email } }
}

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody<Query | Query[]>(event)

    const records: Query[] = []

    if (Array.isArray(body)) {
      for (const item of body) {
        const validationResult = validateAndPrepareData(item)
        if (!validationResult.valid && validationResult.error) {
          event.node.res.statusCode = validationResult.error.code
          return validationResult.error
        }
        if (validationResult.data) {
          records.push(validationResult.data)
        }
      }
    } else {
      const validationResult = validateAndPrepareData(body)
      if (!validationResult.valid && validationResult.error) {
        event.node.res.statusCode = validationResult.error.code
        return validationResult.error
      }
      if (validationResult.data) {
        records.push(validationResult.data)
      }
    }

    const db = event.context.db
    const result = await db?.insert(users).values(records).returning().all()
    serverLog.log('🚀 ~ defineEventHandler ~ result:', result)

    return {
      code: 0,
      message: 'ok',
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
