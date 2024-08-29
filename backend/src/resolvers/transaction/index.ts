import { createTransaction } from "./createTransaction";
import {
	getUserTransaction,
	getUserTransactionList,
	transaction,
	Transaction,
} from "./getTransaction";

export const transactionResolver = {
	transaction,
	createTransaction,
};

export { Transaction, getUserTransaction, getUserTransactionList };
