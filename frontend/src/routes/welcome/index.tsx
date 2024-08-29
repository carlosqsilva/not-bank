import type { welcomeQuery } from "@/__generated__/welcomeQuery.graphql";
import { MaskedValue } from "@/components/masked";
import { Button } from "@/components/ui/button";
import { TypographyH1, TypographyP } from "@/components/ui/typography";
import { executeQuery, useLoaderQuery } from "@/config/relay";
import { Link, type LoaderFunction } from "react-router-dom";
import { graphql } from "relay-runtime";
import { MoveRight } from "lucide-react";

const WelcomeQuery = graphql`
	query welcomeQuery {
		user {
			id
			name
			balance {
				amount
			}
		}
	}
`;

export const welcomeLoader: LoaderFunction = async () => {
	return executeQuery(WelcomeQuery);
};

export function WelcomePage() {
	const data = useLoaderQuery<welcomeQuery>(WelcomeQuery);

	const currentBalance = data?.user?.balance?.amount;

	return (
		<>
			<header className="h-44 flex justify-center items-center">
				<TypographyH1 className="text-zinc-700">Not Bank</TypographyH1>
			</header>

			<main className="flex-1 flex justify-center">
				<div className="max-w-2xl flex flex-col items-center gap-8">
					<div className="text-center">
						<TypographyH1>Hey {data.user?.name} 👏</TypographyH1>
						<TypographyH1>Welcome to our app</TypographyH1>
						<TypographyP className="text-xl">
							You received <MaskedValue value={10_000} /> credits, for
							registering on our platform, you can spend these credits or send
							to friends
						</TypographyP>

						{/* in case user visit this page after for a second time */}
						{currentBalance !== 10_000 && (
							<TypographyP>
								Current credits: <MaskedValue value={currentBalance} />{" "}
							</TypographyP>
						)}
					</div>

					<Button asChild size="lg" className="flex gap-4">
						<Link to="/dashboard" replace>
							Go to Dashboard
							<MoveRight />
						</Link>
					</Button>
				</div>
			</main>
		</>
	);
}
