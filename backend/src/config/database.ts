import mongoose from "mongoose";
import { env } from "./env";

export function initDatabaseConnection() {
	return new Promise<void>((resolve, reject) => {
		mongoose.connection.on("error", reject);

		mongoose.connection.once("open", () => {
			console.log("Successfully connected to MongoDB");
			resolve();
		});

		mongoose.connect(env.DATABASE_URL, {
			connectTimeoutMS: 10_000,
		});
	});
}

export function isDatabaseConnected() {
	return mongoose.connection.readyState === mongoose.ConnectionStates.connected;
}

export async function closeDatabaseConnection() {
	await mongoose.connection.close();
}

export default mongoose;
