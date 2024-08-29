import type { signinMutation } from "@/__generated__/signinMutation.graphql";
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
	Link,
	replace,
	useSubmit,
	type ActionFunction,
} from "react-router-dom";
import { graphql } from "relay-runtime";

const SigninMutation = graphql`
  mutation signinMutation($input: AuthInput) {
    signin(input: $input) {
      id
      name
      balance {
        amount
      }
    }
  }
`;

export const signinAction: ActionFunction = async ({ request }) => {
	const response = await executeMutation<signinMutation>(SigninMutation, {
		input: await request.json(),
	});
	if (response) return replace("/dashboard");
	return null;
};

export function SigninPage() {
	const submit = useSubmit();

	return (
		<Card className="min-w-96 flex-none">
			<CardHeader>
				<CardTitle className="text-4xl text-center">Login</CardTitle>
			</CardHeader>

			<CardContent>
				<AuthForm
					onSubmit={(input) => {
						submit(input, { method: "POST", encType: "application/json" });
					}}
				/>
			</CardContent>

			<CardFooter className="text-sm justify-center gap-2">
				<div>Don't have an account?</div>
				<Link to="/signup" className="text-zinc-700 underline">
					Sign up
				</Link>
			</CardFooter>
		</Card>
	);
}
