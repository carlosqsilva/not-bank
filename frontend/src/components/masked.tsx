import { defined, numberFormat } from "@/lib/utils";
import { Input, type InputProps } from "./ui/input";
import { forwardRef } from "react";

export const moneyMask = (value: string | number) => {
	let strValue = typeof value === "number" ? value.toFixed(2) : String(value);
	strValue = strValue.replace(/\D/g, "") || "0";
	return numberFormat.format(Number.parseFloat(strValue) / 100);
};

interface MaskedValueProps extends React.ComponentPropsWithoutRef<"span"> {
	value: number | undefined | null;
}

export function MaskedValue({ value, ...props }: MaskedValueProps) {
	if (!defined(value)) return null;

	const masked = moneyMask(value / 100);

	return <span {...props}>{masked}</span>;
}

interface MoneyMaskProps extends InputProps {}

export const InputCurrency = forwardRef<HTMLInputElement, MoneyMaskProps>(
	({ onChange, ...props }, ref) => {
		return (
			<Input
				ref={ref}
				{...props}
				onChange={(e) => {
					const value = moneyMask(e.target.value);
					e.target.value = value;
					onChange?.(e);
				}}
			/>
		);
	},
);
