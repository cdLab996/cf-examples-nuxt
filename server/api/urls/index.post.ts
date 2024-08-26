import { defineEventHandler } from 'h3'
import { eq } from 'drizzle-orm'
import { generateShortCode, fetchOpenGraphMetadata } from '~~/server/utils'
import { urls } from '~~/db/schema'

export default defineEventHandler(async (event) => {
  const { redirectUrl } = useRuntimeConfig()
  const { db, logger } = event.context

  const prefix = `${redirectUrl}/api/urls/u`

  try {
    const body = await readBody(event)
    const {
      url,
      shortCode: customCode,
      expiresIn,
      ogTitle,
      ogDescription,
      ogImage,
    } = body

    // 获取或解析 OpenGraph 元数据
    const ogMetadata =
      ogTitle && ogDescription && ogImage
        ? { ogTitle, ogDescription, ogImage }
        : await fetchOpenGraphMetadata(url)

    const {
      ogTitle: finalOgTitle,
      ogDescription: finalOgDescription,
      ogImage: finalOgImage,
    } = ogMetadata

    // 检查 URL 或自定义短码是否已存在
    const [existingUrl, customCodeExists] = await Promise.all([
      db?.select().from(urls).where(eq(urls.url, url)).get(),
      customCode
        ? db?.select().from(urls).where(eq(urls.shortCode, customCode)).get()
        : null,
    ])

    if (existingUrl) {
      const shortUrl = `${prefix}/${existingUrl.shortCode}`
      logger.warn('URL already exists, returning existing short URL:', shortUrl)
      return {
        code: 0,
        message: 'ok',
        data: { shortUrl, url },
      }
    }

    if (customCodeExists) {
      logger.warn('Custom code already exists:', customCode)
      return { code: 409, message: 'Custom code already exists', data: null }
    }

    const shortCode = customCode || generateShortCode()

    await db?.insert(urls).values({
      shortCode,
      url,
      expirationDate: expiresIn,
      ogTitle: finalOgTitle,
      ogDescription: finalOgDescription,
      ogImage: finalOgImage,
    })

    const shortUrl = `${prefix}/${shortCode}`
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
