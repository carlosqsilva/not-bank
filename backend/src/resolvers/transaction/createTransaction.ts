import type { AppContext } from "../../config/context";
import * as v from "valibot";
import { UserModel } from "../../models/user";
import { verify } from "@node-rs/argon2";
import * as ledger from "../../services/ledger";
import { toGlobalId } from "graphql-relay";

const transactionInput = v.object({
	input: v.object({
		name: v.string(),
		amount: v.pipe(
			v.number(),
			v.minValue(1),
			v.transform((n) => Math.round(n * 100)),
		),
		password: v.string(),
	}),
});

export async function createTransaction(args: unknown, ctx: AppContext) {
	const sessionUser = ctx.get("user");
	if (!sessionUser?.id) throw new Error("Unauthorized");

	const {
		input: { name, amount, password },
	} = v.parse(transactionInput, args);

	const destinationUser = await UserModel.findOne({ name });
	if (!destinationUser) throw new Error("User not found");
	if (destinationUser._id.equals(sessionUser.id))
		throw new Error("Action not allowed");

	const sourceUser = await UserModel.findById(sessionUser.id);
	if (!sourceUser) throw new Error("User not found");
	const validPassword = verify(sourceUser.password, password, {
		memoryCost: 19456,
		timeCost: 2,
		outputLen: 32,
		parallelism: 1,
	});

	if (!validPassword) throw new Error("Password verification failed");

	const balance = await ledger.getUserBalance(sourceUser.id.toString());
	const hasFunds = balance >= amount;
	if (!hasFunds) throw new Error("Not enough funds");

	const txid = await ledger.createTransaction({
		amount,
		source: `user:${sourceUser.id.toString()}`,
		destination: `user:${destinationUser.id}`,
	});

	return { id: toGlobalId("Transaction", txid) };
}
