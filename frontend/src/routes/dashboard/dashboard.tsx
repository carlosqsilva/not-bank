import type { dashboardQuery } from "@/__generated__/dashboardQuery.graphql";
import { Link, type LoaderFunction } from "react-router-dom";
import { MaskedValue } from "@/components/masked";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { executeQuery, useLoaderQuery } from "@/config/relay";
import { ArrowUpRight, DollarSign, Plus } from "lucide-react";
import { graphql } from "relay-runtime";
import { Button } from "@/components/ui/button";
import { TransactionList } from "@/components/transactionList";
import { TransactionDialog } from "@/components/transactionDialog";

const DashboardQuery = graphql`
  query dashboardQuery {
    user {
      id
      name
      balance {
        amount
      }
			...transactionListFragment
    }
  }
`;

export const dashboardLoader: LoaderFunction = async () => {
	return executeQuery<dashboardQuery>(DashboardQuery);
};

export function DashboardPage() {
	const data = useLoaderQuery<dashboardQuery>(DashboardQuery);

	return (
		<div className="grid grid-cols-2 gap-8">
			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">Current Balance</CardTitle>
					<DollarSign className="h-4 w-4 text-muted-foreground" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">
						<MaskedValue value={data.user?.balance?.amount} />
					</div>
				</CardContent>
			</Card>

			<TransactionList
				fragment={data.user}
				className="col-span-2"
				header={({ refetch }) => (
					<div className="flex gap-4">
						<TransactionDialog
							onSuccess={refetch}
							trigger={
								<Button asChild size="sm" className="gap-1">
									<div>
										<span>New Transaction</span>
										<Plus className="h-4 w-4" />
									</div>
								</Button>
							}
						/>
						<Button asChild size="sm" className="gap-1">
							<Link to="/dashboard/transactions">
								View All
								<ArrowUpRight className="h-4 w-4" />
							</Link>
						</Button>
					</div>
				)}
			/>
		</div>
	);
}
