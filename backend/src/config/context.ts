import type { Context, Env } from "hono";
import type { User, Session } from "lucia";

export interface AppEnv extends Env {
	Variables: {
		user: User | null;
		session: Session | null;
	};
}

export interface AppContext extends Context<AppEnv> {}
