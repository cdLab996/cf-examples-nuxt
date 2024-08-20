import Logger from '~/composables/Logger'

export default defineEventHandler(async (event) => {
  try {
    const db = useDatabase()

    const data = await db.sql`SELECT * FROM user`
    Logger.log('🚀 ~ defineEventHandler ~ data:', data)
    const result = data.rows?.results || []

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
