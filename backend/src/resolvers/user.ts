import { toGlobalId } from "graphql-relay";
import * as v from "valibot";

import { getUserTransactionList } from "./transaction";
import type { AppContext } from "../config/context";
import { UserModel } from "../models/user";
import * as ledger from "../services/ledger";

export class User {
	_id: string;
	id: string;
	name: string;

	constructor({ id, name }: InstanceType<typeof UserModel>) {
		this._id = id;
		this.id = toGlobalId(this.__typename, id);
		this.name = name;
	}

	get __typename() {
		return "User";
	}

	static async get(id: string) {
		const user = await UserModel.findById(id);
		if (!user) throw new Error("User not found");
		return new User(user);
	}

	async balance() {
		return {
			amount: await ledger.getUserBalance(this._id),
		};
	}

	async transactions(args: unknown) {
		const transactions = await getUserTransactionList(this._id, args);
		return transactions;
	}
}

async function getUser(args: unknown, ctx: AppContext) {
	const sessionUser = ctx.get("user");
	if (!sessionUser?.id) throw new Error("Unauthorized");

	const user = await UserModel.findById(sessionUser.id);
	if (!user) throw new Error("User not found");

	return new User(user);
}

async function isUserAvailable(args: unknown) {
	const { name } = v.parse(
		v.object({ name: v.pipe(v.string(), v.nonEmpty()) }),
		args,
	);

	const user = await UserModel.findOne({ name });
	if (user?.id) return false;

	return true;
}

export const userResolver = { user: getUser, userAvailable: isUserAvailable };
