import { defineEventHandler, readBody } from 'h3'
import { eq } from 'drizzle-orm'
import { urls, urlAnalytics } from '~~/db/schema'

interface Query {
  id: string
  shortCode: string
  expiresIn?: string
}

export default defineEventHandler(async (event) => {
  const { db, logger } = event.context
  const { id: idParam, shortCode, expiresIn } = await readBody<Query>(event)

  try {
    const id = Number.parseInt(idParam, 10)

    if (Number.isNaN(id)) {
      logger.warn('Invalid ID provided:', idParam)
      event.node.res.statusCode = 400
      return {
        code: 400,
        message: 'Invalid ID provided',
        data: null,
      }
    }

    await db?.transaction(async (tx) => {
      const existingUrl = await tx.select().from(urls).where(eq(urls.id, id)).get()

      if (!existingUrl) {
        logger.warn('ID not found:', id)
        event.node.res.statusCode = 404
        throw new Error('ID not found')
      }

      if (existingUrl.shortCode !== shortCode) {
        const shortCodeExists = await tx
          .select()
          .from(urls)
          .where(eq(urls.shortCode, shortCode))
          .get()

        if (shortCodeExists) {
          logger.warn('Short code already exists:', shortCode)
          event.node.res.statusCode = 409 // Conflict
          throw new Error('Short code already exists')
        }

        await tx
          .update(urlAnalytics)
          .set({ shortCode })
          .where(eq(urlAnalytics.shortCode, existingUrl.shortCode))
          .run()
      }

      const updateData: Partial<{ shortCode: string; expirationDate?: number }> = {
        shortCode,
      }

      if (expiresIn) {
        updateData.expirationDate = Number.parseInt(expiresIn)
      }

      await tx.update(urls).set(updateData).where(eq(urls.id, id)).run()
    })

    logger.log('Short code and expiration date updated successfully for ID:', id)

    return {
      code: 0,
      message: 'Short code and expiration date updated successfully',
      data: {
        id,
        shortCode,
        expiresIn: expiresIn ? Number.parseInt(expiresIn) : undefined,
      },
    }
  } catch (error) {
    logger.error('Error updating record for ID:', error)
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
