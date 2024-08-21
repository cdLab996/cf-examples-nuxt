import { createDatabase } from 'db0'
import sqlite from 'db0/connectors/better-sqlite3'
import { drizzle } from 'db0/integrations/drizzle/index'

export function initializeDrizzle() {
  const db = createDatabase(sqlite({}))
  return drizzle(db)
}

let drizzleDB: ReturnType<typeof initializeDrizzle>

export default defineEventHandler(async (event) => {
  if (!drizzleDB) {
    drizzleDB = initializeDrizzle()
  }

  event.context.db = drizzleDB
})

declare module 'h3' {
  interface H3EventContext {
    db: ReturnType<typeof initializeDrizzle>
  }
}
