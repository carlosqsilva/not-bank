import * as v from "valibot";
import { hash, verify } from "@node-rs/argon2";

import { User } from "./user";
import { UserModel } from "../models/user";
import { lucia } from "../config/auth";
import type { AppContext } from "../config/context";
import * as ledger from "../services/ledger";

const signupSchema = v.object({
	input: v.object({
		name: v.pipe(
			v.string(),
			v.minLength(4, "Needs to be at least 4 characters"),
			v.maxLength(16, "Needs to be no more then 16 characters"),
			v.custom(
				(v) => /[a-zA-Z0-9]/.test(v as string),
				"Name contain invalid characters",
			),
		),
		password: v.pipe(
			v.string(),
			v.minLength(8, "Password must have 8 or more characters"),
		),
	}),
});

async function signup(args: unknown, ctx: AppContext) {
	const {
		input: { password, name },
	} = v.parse(signupSchema, args);

	const existingUser = await UserModel.findOne({ name });
	if (existingUser) {
		throw new Error("User already register");
	}

	const passwordHash = await hash(password, {
		memoryCost: 19456,
		timeCost: 2,
		outputLen: 32,
		parallelism: 1,
	});

	const user = new UserModel({
		password: passwordHash,
		name,
	});

	const session = await lucia.createSession(user._id, {});
	await user.save();
	ctx.header("Set-Cookie", lucia.createSessionCookie(session.id).serialize(), {
		append: true,
	});

	await ledger.createTransaction({
		destination: `user:${user.id}`,
		source: "world",
		amount: 10_000, // 100
	});

	return new User(user);
}

async function signin(args: unknown, ctx: AppContext) {
	const {
		input: { password, name },
	} = v.parse(signupSchema, args);

	const user = await UserModel.findOne({ name });
	if (!user) throw new Error("Wrong username or password");

	const validPassword = await verify(user.password, password, {
		memoryCost: 19456,
		timeCost: 2,
		outputLen: 32,
		parallelism: 1,
	});

	if (!validPassword) throw new Error("Wrong username or password");

	const session = await lucia.createSession(user._id, {});
	ctx.header("Set-Cookie", lucia.createSessionCookie(session.id).serialize(), {
		append: true,
	});

	return new User(user);
}

async function logout(args: unknown, ctx: AppContext) {
	const session = ctx.get("session");
	if (!session) return false;

	await lucia.invalidateSession(session.id);
	ctx.header("Set-Cookie", lucia.createBlankSessionCookie().serialize());
	return true;
}

export const authResolver = { signup, signin, logout };
