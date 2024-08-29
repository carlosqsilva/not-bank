import ky from "ky";
import { env } from "../../config/env";

export const api = ky.extend({
	prefixUrl: `${env.LEDGER_URL}/${env.LEDGER_NAME}`,
});

export async function checkLedgerConnection() {
	const response = await ky.get(`${env.LEDGER_URL}/_info`).json();
	if (response) {
		console.log("Successfully connected to Ledger");
		return true;
	}
	throw new Error("Failed to connect to ledger service");
}
