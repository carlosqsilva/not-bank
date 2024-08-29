import type { AppContext } from "../config/context";
import { fromGlobalId } from "graphql-relay";
import { User } from "./user";
import * as v from "valibot";
import { Transaction } from "./transaction/getTransaction";

const nodeInputSchema = v.object({
	id: v.string(),
});

async function node(args: unknown, ctx: AppContext) {
	const { id } = v.parse(nodeInputSchema, args);
	const { type, id: typeId } = fromGlobalId(id);

	switch (type) {
		case "User": {
			const node = await User.get(typeId);
			return node;
		}
		case "Transaction": {
			const sessionUser = ctx.get("user");
			if (!sessionUser?.id) throw new Error("Unauthorized");
			const node = await Transaction.get(id, sessionUser?.id.toString());
			return node;
		}

		default:
			break;
	}

	throw new Error(`Unknown type: ${type}`);
}

export const nodeResosolver = {
	node,
};
