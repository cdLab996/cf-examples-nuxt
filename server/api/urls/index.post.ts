import { defineEventHandler } from 'h3'
import { eq } from 'drizzle-orm'
import { generateShortCode, fetchOpenGraphMetadata } from '~~/server/utils'
import { urls } from '~~/db/schema'

export default defineEventHandler(async (event) => {
  const { redirectUrl } = useRuntimeConfig()
  const { db, logger } = event.context

  try {
    // 获取请求体中的数据
    const body = await readBody(event)
    const { url, customCode, expiresIn, ogTitle, ogDescription, ogImage } = body

    // 获取 OpenGraph 元数据，如果请求中没有提供
    const {
      ogTitle: finalOgTitle,
      ogDescription: finalOgDescription,
      ogImage: finalOgImage,
    } = ogTitle && ogDescription && ogImage
      ? { ogTitle, ogDescription, ogImage }
      : await fetchOpenGraphMetadata(url)

    // 检查 URL 是否已经存在
    const existingUrl = await db?.select().from(urls).where(eq(urls.url, url)).get()
    logger.log('🚀 ~ defineEventHandler ~ redirectUrl:', redirectUrl)
    logger.log('🚀 ~ defineEventHandler ~ existingUrl:', existingUrl)

    if (existingUrl) {
      const shortUrl = `${redirectUrl}/${existingUrl.shortCode}`
      logger.log('URL already exists, returning existing short URL:', shortUrl)
      return {
        code: 0,
        message: 'ok',
        data: { shortUrl, url },
      }
    }

    // Check if custom code already exists
    if (customCode) {
      const customCodeExists = await db
        ?.select()
        .from(urls)
        .where(eq(urls.shortCode, customCode))
        .get()

      if (customCodeExists) {
        logger.warn('Custom code already exists:', customCode)
        return {
          code: 409,
          message: 'Custom code already exists',
          data: null,
        }
      }
    }

    // 生成短码并插入数据库
    const shortCode = customCode || generateShortCode()
    const expirationDate = expiresIn ? Math.floor(Date.now() / 1000) + expiresIn : null

    await db?.insert(urls).values({
      shortCode,
      url,
      expirationDate,
      ogTitle: finalOgTitle,
      ogDescription: finalOgDescription,
      ogImage: finalOgImage,
    })

    const shortUrl = `${redirectUrl}/${shortCode}`
    logger.log('New URL created with short code:', shortUrl)

    return {
      code: 0,
      message: 'ok',
      data: { shortUrl, url },
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
      data: null,
    }
  }
})
