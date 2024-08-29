import type { signupMutation } from "@/__generated__/signupMutation.graphql";
import { AuthForm } from "@/components/authForm";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { executeMutation } from "@/config/relay";
import {
	type ActionFunction,
	Link,
	replace,
	useSubmit,
} from "react-router-dom";
import { graphql } from "relay-runtime";

const SignupMutation = graphql`
	mutation signupMutation($input: AuthInput) {
		signup(input: $input) {
			id
		}
	}
`;

export const signupAction: ActionFunction = async ({ request }) => {
	const response = await executeMutation<signupMutation>(SignupMutation, {
		input: await request.json(),
	});
	if (response) return replace("/welcome");
	return null;
};

export function SignupPage() {
	const submit = useSubmit();

	return (
		<Card className="min-w-96 flex-none">
			<CardHeader>
				<CardTitle className="text-4xl text-center">Create Account</CardTitle>
			</CardHeader>

			<CardContent>
				<AuthForm
					onSubmit={(input) => {
						submit(input, { method: "POST", encType: "application/json" });
					}}
				/>
			</CardContent>

			<CardFooter className="text-sm justify-center gap-2">
				<div>Already have an account?</div>
				<Link to="/" className="text-zinc-700 underline">
					Sign in
				</Link>
			</CardFooter>
		</Card>
	);
}
