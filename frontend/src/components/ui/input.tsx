import * as React from "react";

import { cn } from "@/lib/utils";
import { Button } from "./button";
import { EyeIcon, EyeOffIcon } from "lucide-react";

export interface InputProps
	extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
	({ className, type, ...props }, ref) => {
		const classes = cn(
			"flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
			className,
		);

		if (type === "password") {
			return (
				<PasswordToggle disabled={props.disabled} className={className}>
					{(type) => (
						<input
							type={type}
							className={cn(classes, "pr-10")}
							ref={ref}
							{...props}
						/>
					)}
				</PasswordToggle>
			);
		}

		return <input type={type} className={classes} ref={ref} {...props} />;
	},
);
Input.displayName = "Input";

interface PasswordToggle {
	children: (type: string) => React.ReactNode;
	disabled?: boolean;
	className?: string;
}

function PasswordToggle({ children, disabled, className }: PasswordToggle) {
	const [visible, setVisible] = React.useState(false);

	return (
		<div className={cn("relative", className)}>
			{children(visible ? "text" : "password")}
			<Button
				size="sm"
				type="button"
				variant="ghost"
				className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
				onClick={() => setVisible((v) => !v)}
				disabled={disabled}
			>
				{visible && !disabled ? (
					<EyeOffIcon className="h-4 w-4" aria-hidden="true" />
				) : (
					<EyeIcon className="h-4 w-4" aria-hidden="true" />
				)}
				<span className="sr-only">
					{visible ? "Hide password" : "Show password"}
				</span>
			</Button>
		</div>
	);
}

export { Input };
