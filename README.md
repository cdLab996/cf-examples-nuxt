# cf-examples-nuxt

Using Nuxt, Cloudflare Pages, Cloudflare D1 Database Demo


``` bash

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
```
