import { drizzle } from 'db0/integrations/drizzle/index'

export function initializeDrizzle() {
  const db = useDatabase()
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
