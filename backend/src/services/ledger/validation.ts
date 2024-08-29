import * as v from "valibot";
import { env } from "../../config/env";

const postingsSchema = v.array(
	v.object({
		amount: v.number(),
		asset: v.string(),
		destination: v.string(),
		source: v.string(),
	}),
);
export const balanceSchema = v.object({
	[env.LEDGER_ASSET]: v.optional(v.number(), 0),
});

export const transactionSchema = v.object({
	txid: v.number(),
	timestamp: v.string(),
	postings: postingsSchema,
});

export const transactionsSchema = v.array(transactionSchema);

export function resultSchema<
	T extends v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>,
>(schema: T) {
	return v.object({
		data: schema,
	});
}

export function paginatedResultSchema<
	T extends v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>,
>(schema: T) {
	return v.object({
		cursor: v.object({
			pageSize: v.number(),
			hasMore: v.boolean(),
			previous: v.nullish(v.string()),
			next: v.nullish(v.string()),
			data: schema,
		}),
	});
}

export function formatTransaction(
	tx: v.InferInput<typeof transactionSchema>,
	userId: string,
) {
	const [posting] = tx.postings;

	const type = posting.destination.endsWith(userId) ? "CREDIT" : "DEBIT";

	return {
		cursor: String(tx.txid),
		node: {
			id: tx.txid,
			timestamp: tx.timestamp,
			type,
			...posting,
		},
	};
}
