import { Footer } from "@/components/footer";
import { TypographyH1 } from "@/components/ui/typography";
import { checkSession } from "@/config/loader";
import { type LoaderFunction, Outlet, redirect } from "react-router-dom";

export const rootLoader: LoaderFunction = async () => {
	const hasSession = await checkSession();
	if (hasSession) return redirect("/dashboard");

	return null;
};

export function HomePage() {
	return (
		<>
			<header className="h-44 flex justify-center items-center">
				<TypographyH1 className="text-zinc-700">Not Bank</TypographyH1>
			</header>

			<main className="flex-1 flex justify-center">
				<div>
					<Outlet />
				</div>
			</main>

			<Footer />
		</>
	);
}
