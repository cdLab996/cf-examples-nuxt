import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const users = sqliteTable('users', {
  id: integer('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(), // 添加 unique 约束，确保邮箱唯一
})

export const urls = sqliteTable('urls', {
  id: integer('id').primaryKey(),
  shortCode: text('short_code').notNull().unique(),
  url: text('url').notNull(),
  expirationDate: integer('expiration_date'),
  ogTitle: text('og_title').default('Untitled'),
  ogDescription: text('og_description').default('No description available'),
  ogImage: text('og_image').default('https://via.placeholder.com/1200x630?text=No+Image'),
})

export const urlAnalytics = sqliteTable('url_analytics', {
  id: integer('id').primaryKey(),
  shortCode: text('short_code')
    .notNull()
    .references(() => urls.shortCode),
  clickCount: integer('click_count').default(0),
})

export const apiKeys = sqliteTable('api_keys', {
  id: integer('id').primaryKey(),
  apiKey: text('api_key').notNull().unique(),
  description: text('description').default(''),
})
