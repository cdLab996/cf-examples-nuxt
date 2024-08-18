/// <reference types="@cloudflare/workers-types/2023-07-01" />

import type { CfProperties, Request, ExecutionContext } from '@cloudflare/workers-types'

declare module 'h3' {
  interface H3EventContext {
    cf: CfProperties
    cloudflare: {
      request: Request
      env: Env
      context: ExecutionContext
    }
  }
}

export {}
