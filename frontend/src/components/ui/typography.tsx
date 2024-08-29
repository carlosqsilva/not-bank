import { cn } from "@/lib/utils";

export function TypographyH1({
	className,
	...props
}: React.ComponentPropsWithoutRef<"h1">) {
	return (
		<h1
			{...props}
			className={cn(
				"scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl",
				className,
			)}
		/>
	);
}

export function TypographyH2({
	className,
	...props
}: React.ComponentPropsWithoutRef<"h2">) {
	return (
		<h2
			{...props}
			className={cn(
				"scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0",
				className,
			)}
		/>
	);
}

export function TypographyP({
	className,
	...props
}: React.ComponentPropsWithoutRef<"p">) {
	return (
		<p
			{...props}
			className={cn("leading-7 [&:not(:first-child)]:mt-6", className)}
		/>
	);
}
