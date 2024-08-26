# cf-examples-nuxt

A simple and efficient full-stack URL shortener built with Nuxt, TypeScript, and Cloudflare Pages, seamlessly integrating with Cloudflare D1 Database.

## Getting Started

First, set up your `.env` file by copying the example:

```bash
cd cf-examples-nuxt
cp .env.example .env
```

Then, run the development server:

Recommended versions:

- node ^20.16.0
- pnpm ^9.7.1

```bash
pnpm install

pnpm run db:generate
pnpm run db:up
pnpm run db:migrate

pnpm run dev

# dev cf preview
pnpm run dev

```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

REST API URL:

- api: `/server`

<!-- ``` bash

npm create cloudflare@latest cf-examples-nuxt -- --framework=nuxt

cf-examples-nuxt

pnpm run db:generate
pnpm run db:migrate:local

pnpm dlx wrangler d1 create prisma-demo-db
pnpm dlx wrangler d1 migrations create prisma-demo-db create_user_table
pnpm dlx prisma migrate diff --from-empty --to-schema-datamodel ./prisma/schema.prisma --script > migrations/0001_create_user_table.sql

pnpm dlx wrangler d1 migrations apply prisma-demo-db --local
pnpm dlx wrangler d1 migrations apply prisma-demo-db --remote

pnpm dlx wrangler d1 execute prisma-demo-db --command "INSERT INTO \"User\" (\"email\", \"name\") VALUES
('wudi@prisma.io', 'wudi (Local)');" --local
pnpm dlx wrangler d1 execute prisma-demo-db --command "INSERT INTO \"User\" (\"email\", \"name\") VALUES
('wudi@prisma.io', 'wudi (Remote)');" --remote

pnpm dlx prisma migrate diff \
  --from-empty \
  --to-schema-datamodel ./prisma/schema.prisma \
  --script \
  --output migrations/0003_create_user_table.sql

pnpm dlx prisma migrate diff \
  --from-local-d1 \
  --to-schema-datamodel ./prisma/schema.prisma \
  --script \
  --output migrations/0003_create_post_table.sql

pnpm dlx prisma generate
``` -->
