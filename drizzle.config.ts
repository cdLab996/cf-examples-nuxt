import { defineConfig } from 'drizzle-kit'

const { VITE_D1_TOKEN, VITE_ACCOUNT_ID, VITE_DATABASE_ID } = process.env

export default defineConfig({
  schema: './db/schema.ts',
  out: './db/migrations',
  dialect: 'sqlite',
  driver: 'd1-http',
  dbCredentials: {
    token: VITE_D1_TOKEN!,
    accountId: VITE_ACCOUNT_ID!,
    databaseId: VITE_DATABASE_ID!,
  },
})
