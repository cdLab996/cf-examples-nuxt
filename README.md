# Nuxt 3 Minimal Starter

Look at the [Nuxt 3 documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install the dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm run dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm run build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm run preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

``` bash
npm create cloudflare@latest my-nuxt-app -- --framework=nuxt

npm create cloudflare@latest cf-examples-next -- --framework=nuxt

npm create cloudflare@latest cf-examples-next -- --framework=next

cf-examples-next

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
