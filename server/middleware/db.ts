import type { H3Event, EventHandlerRequest } from 'h3'
import { drizzle as drizzleSqlite } from 'drizzle-orm/libsql'
import { drizzle as drizzleD1 } from 'drizzle-orm/d1'
import * as schema from '~~/db/schema'
import logger from '../utils/logger'

function initializeDrizzle(event: H3Event<EventHandlerRequest>) {
  const { dbType } = useRuntimeConfig()

  switch (dbType) {
    case 'sqlite': {
      const db = useDatabase()
      return drizzleSqlite(db, { schema })
    }
    case 'cf': {
      const { DB = '' } = event.context.cloudflare?.env || {}
      if (!DB) {
        logger.error('D1 database not found')
        // return useDatabase()
      }
      return drizzleD1(DB, { schema })
    }
    default: {
      logger.error(`Unsupported DB type: ${dbType}`)
      // return useDatabase()
    }
  }
}

let drizzleDB: ReturnType<typeof initializeDrizzle>

export default defineEventHandler(async (event) => {
  if (!drizzleDB) {
    drizzleDB = initializeDrizzle(event)
  }

  event.context.db = drizzleDB
})

declare module 'h3' {
  interface H3EventContext {
    db: ReturnType<typeof initializeDrizzle>
  }
}
