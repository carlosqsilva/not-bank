import { Suspense } from "react";
import type { dashboardLayoutQuery } from "@/__generated__/dashboardLayoutQuery.graphql";
import type { dashboardMutation } from "@/__generated__/dashboardMutation.graphql";
import {
	NavLink,
	Outlet,
	useNavigate,
	type LoaderFunction,
} from "react-router-dom";
import { executeQuery, useLoaderQuery } from "@/config/relay";
import { graphql } from "relay-runtime";
import { cn } from "@/lib/utils";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { CircleUser } from "lucide-react";
import { useMutation } from "@/hooks/useMutation";
import { Footer } from "@/components/footer";

const DashboardQuery = graphql`
  query dashboardLayoutQuery {
    user {
      id
      name
    }
  }
`;

const LogoutMutation = graphql`
  mutation dashboardMutation {
    logout
  }
`;

export const dashboardLayoutLoader: LoaderFunction = async () => {
	return executeQuery<dashboardLayoutQuery>(DashboardQuery);
};

const navlinks = [
	{ url: "/dashboard", title: "Dashboard" },
	{ url: "/dashboard/transactions", title: "Transactions" },
];

export function DashboardLayout() {
	const data = useLoaderQuery<dashboardLayoutQuery>(DashboardQuery);

	const navigate = useNavigate();
	const [execute] = useMutation<dashboardMutation>(LogoutMutation);

	return (
		<>
			<header className="border-b py-4 bg-background">
				<div className="container mx-auto flex items-center justify-between">
					<nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
						<span className="flex-none text-3xl font-extrabold tracking-tight mr-18 select-none">
							Not Bank
						</span>

						{navlinks.map((link) => (
							<NavLink
								end
								key={link.url}
								to={link.url}
								className={({ isActive }) =>
									cn(
										"text-muted-foreground transition-colors hover:text-foreground",
										isActive && "text-foreground",
									)
								}
							>
								{link.title}
							</NavLink>
						))}
					</nav>

					<div className="flex items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
						<DropdownMenu>
							<span className="text-foreground text-xl">{data.user?.name}</span>
							<DropdownMenuTrigger asChild>
								<Button
									variant="secondary"
									size="icon"
									className="rounded-full"
								>
									<CircleUser className="h-5 w-5" />
									<span className="sr-only">Toggle user menu</span>
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								<DropdownMenuLabel>My Account</DropdownMenuLabel>
								<DropdownMenuSeparator />
								<DropdownMenuItem disabled>Settings</DropdownMenuItem>
								<DropdownMenuItem disabled>Support</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DropdownMenuItem
									onClick={() => {
										execute({}, () => {
											navigate("/", { replace: true });
										});
									}}
								>
									Logout
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</div>
			</header>

			<main className="container mx-auto mt-10 flex-1">
				<Suspense fallback={<div>Loading...</div>}>
					<Outlet />
				</Suspense>
			</main>

			<Footer />
		</>
	);
}
