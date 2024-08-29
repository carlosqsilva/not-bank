import database from "./database";
import { Lucia } from "lucia";
import { MongodbAdapter } from "@lucia-auth/adapter-mongodb";
import { createMiddleware } from "hono/factory";
import type { AppEnv } from "./context";

const adapter = new MongodbAdapter(
	database.connection.collection("sessions"),
	database.connection.collection("users"),
);

export const lucia = new Lucia(adapter, {});

declare module "lucia" {
	interface Register {
		Lucia: typeof lucia;
		UserId: database.Types.ObjectId;
	}
}

export const authmiddleware = createMiddleware<AppEnv>(async (ctx, next) => {
	const sessionId = lucia.readSessionCookie(ctx.req.header("Cookie") ?? "");
	if (!sessionId) {
		ctx.set("user", null);
		ctx.set("session", null);
		return next();
	}

	const { session, user } = await lucia.validateSession(sessionId);
	if (session?.fresh) {
		ctx.header(
			"Set-Cookie",
			lucia.createSessionCookie(session.id).serialize(),
			{
				append: true,
			},
		);
	}
	if (!session) {
		ctx.header("Set-Cookie", lucia.createBlankSessionCookie().serialize(), {
			append: true,
		});
	}

	ctx.set("session", session);
	ctx.set("user", user);
	return next();
});
