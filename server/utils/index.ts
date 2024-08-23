import { customAlphabet } from 'nanoid'
import logger from '../utils/logger'

// Define the character set for the shortcode, including uppercase, lowercase letters, and digits
const CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

// Create a custom nanoid function with the specified character set and length
const nanoid = customAlphabet(CHARACTERS, 6)

/**
 * Generate a short code for a URL
 *
 * e.g., "aB3xZ1k9"
 */
export const generateShortCode = () => nanoid()

// Fetch OpenGraph metadata for a given URL
export async function fetchOpenGraphMetadata(url: string): Promise<{
  ogTitle: string
  ogDescription: string
  ogImage: string
}> {
  let ogTitle = ''
  let ogDescription = ''
  let ogImage = ''
  let titleText = ''
  try {
    const rewriter = new HTMLRewriter()
      .on('meta[property="og:title"]', {
        element(element) {
          ogTitle = element.getAttribute('content') || ''
        },
      })
      .on('meta[property="og:description"]', {
        element(element) {
          ogDescription = element.getAttribute('content') || ''
        },
      })
      .on('meta[property="og:image"]', {
        element(element) {
          ogImage = element.getAttribute('content') || ''
        },
      })
      .on('title', {
        text(text) {
          titleText += text.text
        },
      })

    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Failed to fetch OpenGraph metadata: ${response.status}`)
    }

    await rewriter.transform(response).arrayBuffer()
  } catch (error) {
    logger.error('Error fetching OpenGraph metadata:', error)
    // Fallback values
    ogTitle = titleText || 'Untitled'
    ogDescription = 'No description available'
    ogImage = 'https://via.placeholder.com/1200x630?text=No+Image'
  }
  // Validate OpenGraph metadata
  const isValidUrl = (str: string) => {
    try {
      // eslint-disable-next-line no-new
      new URL(str)
      return true
    } catch (error) {
      logger.error('🚀 ~ isValidUrl ~ error:', error)
      return false
    }
  }
  if (!isValidUrl(ogImage)) {
    ogImage = 'https://via.placeholder.com/1200x630?text=No+Image'
  }
  const metadata = {
    ogTitle,
    ogDescription,
    ogImage,
  }
  return metadata
}
