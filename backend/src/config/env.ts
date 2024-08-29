import * as v from "valibot";

const envSchema = v.object({
	PORT: v.optional(v.number(), 3000),
	LEDGER_URL: v.optional(v.string()),
	LEDGER_NAME: v.string(),
	LEDGER_ASSET: v.optional(v.string(), "USD/2"),
	DATABASE_URL: v.pipe(
		v.string("[DATABASE_URL] was not provided"),
		v.url("[DATABASE_URL] must be a valid url"),
	),
});

export const env = v.parse(envSchema, process.env);
