import type { transactionListFragment$key } from "@/__generated__/transactionListFragment.graphql";
import { graphql } from "relay-runtime";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "./ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "./ui/table";
import { usePaginationFragment } from "react-relay";
import { MaskedValue } from "./masked";
import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const transactionsFragment = graphql`
  fragment transactionListFragment on User
		@argumentDefinitions(
			after: { type: "String" }
			first: { type: "Int", defaultValue: 10 }
		) 
		@refetchable(queryName: "TransactionPaginationQuery") {
		transactions(after: $after, first: $first) 
			@connection(key: "Transactions_transactions") {
			edges {
				cursor
				node {
					id
					type
					amount
					destination
					timestamp
					source	
				}
			}
		}
  }
`;

interface TransactionListProps extends React.ComponentPropsWithoutRef<"div"> {
	header: (props: { refetch: () => void }) => React.ReactNode;
	fragment?: transactionListFragment$key | null;
}

export function TransactionList({
	header,
	fragment,
	...props
}: TransactionListProps) {
	const { data, loadNext, refetch } =
		usePaginationFragment(transactionsFragment, fragment) ?? {};

	const isEmpty = data?.transactions?.edges?.length === 0;
	const update = () => refetch({ first: 10 });

	return (
		<Card {...props}>
			<CardHeader className="flex flex-row items-center justify-between">
				<div className="grid gap-2">
					<CardTitle>Transactions</CardTitle>
					<CardDescription>
						Recent transactions from your account.
					</CardDescription>
				</div>
				{header({ refetch: update })}
			</CardHeader>
			<CardContent>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>ID</TableHead>
							<TableHead>From</TableHead>
							<TableHead className="">To</TableHead>
							<TableHead className="">Type</TableHead>
							<TableHead className="">Date</TableHead>
							<TableHead className="text-right">Amount</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{isEmpty && <div>Empty</div>}

						{data?.transactions?.edges?.map((edge) => {
							if (edge === null || edge?.node === null) {
								return null;
							}

							const { node } = edge ?? {};
							const isDebit = node?.type === "DEBIT";

							return (
								<TableRow key={edge?.cursor}>
									<TableCell>{node?.id}</TableCell>
									<TableCell>
										<div className="font-medium">{node?.source}</div>
									</TableCell>
									<TableCell className="">{node?.destination}</TableCell>
									<TableCell className="">{node?.type}</TableCell>
									<TableCell className="">{node?.timestamp}</TableCell>
									<TableCell className="text-right">
										<MaskedValue
											value={isDebit ? node?.amount * -1 : node?.amount}
											className={cn(isDebit && "text-red-600")}
										/>
									</TableCell>
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
			</CardContent>
			<CardFooter className="flex justify-end">
				<div className="flex gap-4">
					<Button size="icon" onClick={() => loadNext(10)}>
						<ArrowRight />
					</Button>
				</div>
			</CardFooter>
		</Card>
	);
}
