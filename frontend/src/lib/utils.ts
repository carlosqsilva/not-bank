import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function defined<T>(item: T): item is Exclude<T, null | undefined> {
	return item !== undefined && item !== null;
}

const DEFAULT_LOCALE = "pt-BR";

export const numberFormat = new Intl.NumberFormat(DEFAULT_LOCALE, {
	style: "currency",
	currency: "USD",
	currencyDisplay: "narrowSymbol",
	minimumFractionDigits: 2,
});

export function parseLocaleNumber(num: string, locale = DEFAULT_LOCALE) {
	const value = num.replace(/[^-0-9,.]/g, "");
	const thousandSeparator = Intl.NumberFormat(locale)
		.format(11111)
		.replace(/\p{Number}/gu, "");
	const decimalSeparator = Intl.NumberFormat(locale)
		.format(1.1)
		.replace(/\p{Number}/gu, "");

	return Number.parseFloat(
		value
			.replace(new RegExp(`\\${thousandSeparator}`, "g"), "")
			.replace(new RegExp(`\\${decimalSeparator}`), "."),
	);
}

export function toNumber(str?: string | number | null, defaultNum = 0): number {
	try {
		if (!defined(str)) return defaultNum;
		if (typeof str === "number") return str;
		let value = Number(str?.trim());
		if (!Number.isNaN(value)) return value;
		value = parseLocaleNumber(str);
		return value;
	} catch {
		return defaultNum;
	}
}
