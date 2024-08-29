import "./index.css";

import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { RelayEnvironmentProvider } from "react-relay";
import { Toaster } from "@/components/ui/sonner";

import { relayEnvironment } from "./config/relay";
import { HomePage, rootLoader } from "./routes/homepage";
import { welcomeLoader, WelcomePage } from "./routes/welcome";
import { signinAction, SigninPage } from "./routes/homepage/signin";
import { signupAction, SignupPage } from "./routes/homepage/signup";
import { DashboardLayout, dashboardLayoutLoader } from "./routes/dashboard";
import { dashboardLoader, DashboardPage } from "./routes/dashboard/dashboard";

const router = createBrowserRouter([
	{
		path: "/",
		loader: rootLoader,
		element: <HomePage />,
		children: [
			{
				index: true,
				action: signinAction,
				element: <SigninPage />,
			},
			{
				path: "/signup",
				action: signupAction,
				element: <SignupPage />,
			},
		],
	},
	{
		path: "/welcome",
		loader: welcomeLoader,
		element: <WelcomePage />,
	},
	{
		path: "/dashboard",
		loader: dashboardLayoutLoader,
		element: (
			<Suspense>
				<DashboardLayout />
			</Suspense>
		),
		children: [
			{
				index: true,
				loader: dashboardLoader,
				element: <DashboardPage />,
			},
			{
				path: "/dashboard/transactions",
				element: <span>Too lazy to implement</span>,
			},
		],
	},
]);

createRoot(document.getElementById("root") as HTMLElement).render(
	<StrictMode>
		<RelayEnvironmentProvider environment={relayEnvironment}>
			<RouterProvider router={router} />
			<Toaster />
		</RelayEnvironmentProvider>
	</StrictMode>,
);
