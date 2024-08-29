import { valibotResolver } from "@hookform/resolvers/valibot";
import { useForm } from "react-hook-form";
import * as v from "valibot";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

const formSchema = v.object({
	name: v.pipe(
		v.string(),
		v.minLength(4, "Needs to be at least 4 characters"),
		v.maxLength(16, "Needs to be no more then 16 characters"),
		v.custom(
			(v) => /[a-zA-Z0-9]/.test(v as string),
			"Name contain invalid characters",
		),
	),
	password: v.pipe(
		v.string(),
		v.minLength(8, "Needs to be at least 8 characters"),
	),
});

interface AuthFormProps
	extends Omit<React.ComponentPropsWithoutRef<"form">, "onSubmit"> {
	onSubmit: (input: v.InferInput<typeof formSchema>) => void | Promise<void>;
	disabled?: boolean;
}

export function AuthForm({ onSubmit, disabled }: AuthFormProps) {
	const form = useForm<v.InferInput<typeof formSchema>>({
		resolver: valibotResolver(formSchema),
		defaultValues: {
			name: "",
			password: "",
		},
	});

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
				<FormField
					name="name"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Username</FormLabel>
							<FormControl>
								<Input placeholder="Username" className="bg-white" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					name="password"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Password</FormLabel>
							<FormControl>
								<Input
									type="password"
									placeholder="Password"
									className="bg-white"
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<div>
					<Button className="w-full mt-5" type="submit" disabled={disabled}>
						Continuar
					</Button>
				</div>
			</form>
		</Form>
	);
}
