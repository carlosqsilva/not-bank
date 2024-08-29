import { Hono } from "hono";
import { logger } from "hono/logger";
import { serve } from "@hono/node-server";
import { graphqlServer } from "@hono/graphql-server";
import { buildSchema } from "graphql";
import { readFileSync } from "node:fs";
import { setTimeout } from "node:timers/promises";

import { env } from "./config/env";
import { authmiddleware } from "./config/auth";
import {
	closeDatabaseConnection,
	initDatabaseConnection,
	isDatabaseConnected,
} from "./config/database";
import type { AppEnv } from "./config/context";

import { nodeResosolver } from "./resolvers/node";
import { authResolver } from "./resolvers/auth";
import { userResolver } from "./resolvers/user";
import { transactionResolver } from "./resolvers/transaction";
import { checkLedgerConnection } from "./services/ledger";

const schema = buildSchema(
	readFileSync("./schema.graphql", { encoding: "utf8" }),
);

const app = new Hono<AppEnv>();
app.use(logger());
app.use("*", authmiddleware);
app.use(
	"/gql",
	graphqlServer({
		graphiql: true,
		schema: schema,
		rootResolver: () => ({
			...nodeResosolver,
			...authResolver,
			...userResolver,
			...transactionResolver,
		}),
	}),
);

await checkLedgerConnection();
await initDatabaseConnection();

app.get("/_healthcheck", async (c) => {
	const ok = (await checkLedgerConnection()) && isDatabaseConnected();
	return c.json({ ok });
});

const service = serve({
	fetch: app.fetch,
	port: env.PORT,
});

console.log(`Server is running on port ${env.PORT}`);

const shutdown = async () => {
	console.log("Shutting down...");
	await Promise.race([
		Promise.all([service.close(), closeDatabaseConnection()]),
		setTimeout(5000),
	]);
	console.log("Goodbye!");
	process.exit(0);
};

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
