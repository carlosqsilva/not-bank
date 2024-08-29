# Not Bank

Basic single page application (SPA) and API with React, Graphql and Hono.

## Stack

Backend:

- [Hono](https://hono.dev)
- [lucia-auth](https://lucia-auth.com/database/)
- MongoDB

Frontend:

- React
- Relay
- [shadcn/ui](https://ui.shadcn.com/)

Services:

- [Formance ledger](https://www.formance.com/modules/ledger)

## Setup

```sh
# clone repo
git clone git@github.com/carlosqsilva/not-bank.git --depth 1

cd not-bank

# install dependencies
pnpm install

# start database and services
docker compose up -d

# start backend
pnpm run api

# cd ./frontend && pnpm run relay

# start frontend
pnpm run web

# navigate to localhost:5173
```
