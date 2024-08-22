// import { drizzle } from 'db0/integrations/drizzle/index'

// export function initializeDrizzle() {
//   const db = useDatabase()
//   return drizzle(db)
// }
import type { H3Event, EventHandlerRequest } from 'h3'
import { drizzle as drizzleSqlite } from 'drizzle-orm/libsql'
import { drizzle as drizzleD1 } from 'drizzle-orm/d1'
import * as schema from '~~/db/schema'

function initializeDrizzle(event: H3Event<EventHandlerRequest>) {
  const { dbType } = useRuntimeConfig()

  switch (dbType) {
    case 'sqlite': {
      const db = useDatabase()
      return drizzleSqlite(db, { schema })
    }
    case 'cf': {
      const { DB } = event.context.cloudflare.env
      return drizzleD1(DB, { schema })
    }
    default: {
      throw new Error(`Unsupported DB type: ${dbType}`)
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
