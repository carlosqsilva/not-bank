import * as v from "valibot";
import { api } from "./api";
import { env } from "../../config/env";
import { balanceSchema, resultSchema } from "./validation";

export async function getUserBalance(userId: string) {
	const response = await api
		.get("aggregate/balances", { searchParams: { address: `user:${userId}` } })
		.json();

	const { data } = v.parse(resultSchema(balanceSchema), response);

	return data[env.LEDGER_ASSET];
}
