import { api } from "./api";
import {
	formatTransaction,
	paginatedResultSchema,
	resultSchema,
	transactionSchema,
	transactionsSchema,
} from "./validation";
import * as v from "valibot";

export async function getTransaction(userId: string, txId: string) {
	const response = await api.get(`transactions/${txId}`).json();
	const { data } = v.parse(resultSchema(transactionSchema), response);
	return formatTransaction(data, userId);
}

interface transactionListOptions {
	userId: string;
	pageSize?: number;
	after?: string;
}

export async function getTransactionList({
	userId,
	...options
}: transactionListOptions) {
	const response = await api
		.get("transactions", {
			searchParams: { account: `user:${userId}`, ...options },
		})
		.json();

	const { cursor } = v.parse(
		paginatedResultSchema(transactionsSchema),
		response,
	);

	const { hasMore, data, previous } = cursor;
	const [firstItem] = data;
	const lastItem = data?.at(-1);

	return {
		pageInfo: {
			hasNextPage: hasMore,
			hasPreviousPage: !!previous,
			startCursor: String(firstItem.txid),
			endCursor: String(lastItem?.txid),
		},
		edges: data.map((tx) => formatTransaction(tx, userId)),
	};
}
