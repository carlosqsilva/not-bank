import type { transactionDialogMutation } from "@/__generated__/transactionDialogMutation.graphql";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { graphql } from "relay-runtime";
import { toast } from "sonner";
import * as v from "valibot";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "./ui/dialog";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { UsernameInput } from "./usernameInput";
import { InputCurrency, moneyMask } from "./masked";
import { toNumber } from "@/lib/utils";
import { useMutation } from "@/hooks/useMutation";
import { Button } from "./ui/button";

const TransactionDialogMutation = graphql`
	mutation transactionDialogMutation($input: TransactionInput) {
		createTransaction(input: $input) {
			id
		}
	} 
`;

interface TransactionDialogProps {
	trigger: React.ReactNode;
	onSuccess?: () => void;
}

const formSchema = v.object({
	name: v.string(),
	password: v.string(),
	amount: v.pipe(
		v.union([v.string(), v.number()]),
		v.transform((str) => toNumber(str)),
		v.number(),
	),
});

type FormOutputType = v.InferOutput<typeof formSchema>;
type FormInputType = v.InferInput<typeof formSchema>;

export function TransactionDialog({
	trigger,
	onSuccess,
}: TransactionDialogProps) {
	const [open, setOpen] = useState(false);

	const [execute] = useMutation<transactionDialogMutation>(
		TransactionDialogMutation,
	);
	const form = useForm<FormInputType, undefined, FormOutputType>({
		resolver: valibotResolver(formSchema),
		defaultValues: {
			name: "",
			password: "",
			amount: moneyMask(0),
		},
	});

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger>{trigger}</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Are you absolutely sure?</DialogTitle>
					<DialogDescription>
						This action cannot be undone. This will permanently delete your
						account and remove your data from our servers.
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(async (input) => {
							execute({ input }, () => {
								onSuccess?.();
								toast.success("Transaction created successfuly");
								setOpen(false);
							});
						})}
					>
						<div className="grid gap-4 py-4">
							<FormField
								name="name"
								render={({ field }) => (
									<FormItem className="grid grid-cols-4 items-center gap-4">
										<FormLabel className="text-right">Name</FormLabel>
										<div className="col-span-3">
											<FormControl>
												<UsernameInput placeholder="Name" {...field} />
											</FormControl>
											<FormMessage />
										</div>
									</FormItem>
								)}
							/>

							<FormField
								name="amount"
								render={({ field }) => (
									<FormItem className="grid grid-cols-4 items-center gap-4">
										<FormLabel className="text-right">Amount</FormLabel>
										<div className="col-span-3">
											<FormControl>
												<InputCurrency placeholder="Amount" {...field} />
											</FormControl>
											<FormMessage />
										</div>
									</FormItem>
								)}
							/>

							<FormField
								name="password"
								render={({ field }) => (
									<FormItem className="grid grid-cols-4 items-center gap-4">
										<FormLabel className="text-right">Password</FormLabel>
										<div className="col-span-3">
											<FormControl>
												<Input
													type="password"
													placeholder="Password"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</div>
									</FormItem>
								)}
							/>
						</div>

						<DialogFooter className="mt-4">
							<Button
								variant="outline"
								type="button"
								onClick={() => setOpen(false)}
							>
								Cancel
							</Button>
							<Button type="submit">Continue</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
