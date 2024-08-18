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
npx wrangler d1 create prisma-demo-db

npx wrangler d1 migrations create prisma-demo-db create_user_table

npx prisma migrate diff --from-empty --to-schema-datamodel ./prisma/schema.prisma --script > migrations/0002_create_user_table.sql

npx wrangler d1 migrations apply prisma-demo-db --local
npx wrangler d1 migrations apply prisma-demo-db --remote

npx wrangler d1 execute prisma-demo-db --command "INSERT INTO \"User\" (\"email\", \"name\") VALUES
('wudi@prisma.io', 'wudi (Local)');" --local
npx wrangler d1 execute prisma-demo-db --command "INSERT INTO \"User\" (\"email\", \"name\") VALUES
('wudi@prisma.io', 'wudi (Remote)');" --remote


npx prisma generate
```
