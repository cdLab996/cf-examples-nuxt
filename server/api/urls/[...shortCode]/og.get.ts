import { defineEventHandler, getQuery } from 'h3'
import { urls } from '~~/db/schema'
import { eq } from 'drizzle-orm'

interface Query {
  shortCode: string
}

function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

export default defineEventHandler(async (event) => {
  const { db, logger } = event.context

  try {
    const { shortCode } = getQuery<Query>(event)

    // 查找数据库中是否存在对应的短码
    const urlData = await db
      .select()
      .from(urls)
      .where(eq(urls.shortCode, shortCode))
      .get()

    if (!urlData) {
      logger.warn('Short code not found:', shortCode)
      event.node.res.statusCode = 404
      return {
        code: 404,
        message: 'Short code not found',
      }
    }

    // 解析并生成 HTML 响应
    const { url, ogTitle, ogDescription, ogImage } = urlData
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${escapeHtml(ogTitle || 'Untitled')}</title>
          <meta property="og:title" content="${escapeHtml(ogTitle || 'Untitled')}" />
          <meta property="og:description" content="${escapeHtml(ogDescription || '')}" />
          <meta property="og:image" content="${escapeHtml(ogImage || '')}" />
          <meta property="og:url" content="${escapeHtml(url)}" />
          <meta property="og:type" content="website" />
        </head>
        <body>
          <script>
            window.location.href = '${escapeHtml(url)}';
          </script>
        </body>
      </html>
    `

    event.node.res.setHeader('Content-Type', 'text/html')
    event.node.res.end(html)
  } catch (error) {
    logger.error('Error processing OpenGraph metadata redirect:', error)
    event.node.res.statusCode = 500
    return {
      code: 500,
      message: 'Internal Server Error',
    }
  }
})
