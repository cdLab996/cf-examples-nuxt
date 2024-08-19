import { PrismaClient } from '@prisma/client'
import { PrismaD1 } from '@prisma/adapter-d1'

export default defineEventHandler(async (event) => {
  try {
    const { cloudflare } = event.context

    const d1Client = cloudflare.env.DB
    const adapter = new PrismaD1(d1Client)
    const prisma = new PrismaClient({ adapter })
    await prisma.$connect()

    // const result = await prisma.$queryRaw`SELECT 1;`

    const result = await prisma.user.findMany()

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
