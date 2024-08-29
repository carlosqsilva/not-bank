import * as v from "valibot";
import * as ledger from "../../services/ledger";
import { UserModel } from "../../models/user";
import type { AppContext } from "../../config/context";
import { toGlobalId } from "graphql-relay";

const transactioListFilter = v.pipe(
	v.object({
		first: v.optional(v.number()),
		after: v.nullish(v.string()),
	}),
	v.transform(({ first, after }) => ({
		...(first && { pageSize: first }),
		...(after && { after }),
	})),
);

export async function getUserTransactionList(
	userId: string,
	filterInput: unknown,
) {
	const filter = v.parse(transactioListFilter, filterInput);
	const transactions = await ledger.getTransactionList({ userId, ...filter });

	const userIds = new Set<string>();
	for (const edge of transactions.edges) {
		if (edge.node.destination.startsWith("user:")) {
			userIds.add(edge.node.destination.slice(5));
		}
		if (edge.node.source.startsWith("user:")) {
			userIds.add(edge.node.source.slice(5));
		}
	}

	const users = await UserModel.find({ _id: { $in: [...userIds] } });
	const usersMap: Record<string, string> = {};
	for (const user of users) {
		usersMap[user.id] = user.name;
	}

	for (const edge of transactions.edges) {
		if (edge.node.destination.startsWith("user:")) {
			const id = edge.node.destination.slice(5);
			if (usersMap[id]) {
				edge.node.destination = usersMap[id];
			}
		}

		if (edge.node.source.startsWith("user:")) {
			const id = edge.node.source.slice(5);
			if (usersMap[id]) {
				edge.node.source = usersMap[id];
			}
		}
	}

	return transactions;
}

export async function getUserTransaction(userId: string, txId: string) {
	const { node } = await ledger.getTransaction(userId, txId);

	const userIds = [node.destination, node.source]
		.filter((it) => it.startsWith("user:"))
		.map((it) => it.slice(5));

	// cant access a transaction that dont belong to this user
	if (!userIds.find((id) => id === userId)) {
		throw new Error("Unknow error");
	}

	const users = await UserModel.find({ _id: { $in: userIds } });
	const usersMap: Record<string, string> = {};
	for (const user of users) {
		usersMap[user.id] = user.name;
	}

	if (node.destination.startsWith("user:")) {
		const id = node.destination.slice(5);
		node.destination = usersMap[id];
	}

	if (node.source.startsWith("user:")) {
		const id = node.source.slice(5);
		node.source = usersMap[id];
	}

	return node;
}

const transactionFilter = v.object({
	id: v.string(),
});

export async function transaction(args: unknown, ctx: AppContext) {
	const sessionUser = ctx.get("user");
	if (!sessionUser?.id) throw new Error("Unauthorized");

	const { id } = v.parse(transactionFilter, args);
	const userId = sessionUser.id.toString();
	const transaction = getUserTransaction(userId, id);

	return transaction;
}

export class Transaction {
	id: string;
	amount: number;
	asset: string;
	destination: string;
	source: string;
	type: string;
	timestamp: string;

	constructor(tx: Awaited<ReturnType<typeof transaction>>) {
		this.id = toGlobalId(this.__typename, tx.id);
		this.amount = tx.amount;
		this.asset = tx.asset;
		this.destination = tx.destination;
		this.source = tx.source;
		this.type = tx.type;
		this.timestamp = tx.timestamp;
	}

	get __typename() {
		return "Transaction";
	}

	static async get(txId: string, userId: string) {
		const tx = await getUserTransaction(userId, txId);
		return new Transaction(tx);
	}
}
