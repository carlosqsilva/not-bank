import { env } from "../../config/env";
import { api } from "./api";
import * as v from "valibot";
import {
	resultSchema,
	transactionSchema,
	transactionsSchema,
} from "./validation";

export async function createTransaction(
	input: {
		source: "world" | `user:${string}`;
		destination: "world" | `user:${string}`;
		amount: number;
	},
	asset = env.LEDGER_ASSET,
) {
	const postings = [
		{
			asset,
			amount: input.amount,
			destination: input.destination,
			source: input.source,
		},
	];
	const response = await api
		.post("transactions", { json: { postings } })
		.json();

	const {
		data: [transaction],
	} = v.parse(resultSchema(transactionsSchema), response);

	return transaction.txid;
}

export async function revertTransaction(txId: number) {
	const response = await api.post(`transactions/${txId}/revert`).json();
	const {
		data: { txid },
	} = v.parse(resultSchema(transactionSchema), response);

	return txid;
}
