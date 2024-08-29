import { graphql } from "relay-runtime";
import { Input, type InputProps } from "./ui/input";
import { cn, defined } from "@/lib/utils";
import {
	type PreloadedQuery,
	usePreloadedQuery,
	useQueryLoader,
} from "react-relay";
import type { usernameInputQuery } from "@/__generated__/usernameInputQuery.graphql";
import { UserRoundCheck, UserRoundXIcon } from "lucide-react";
import debounce from "debounce";
import { forwardRef, useCallback, useEffect } from "react";

const UsernameInputQuery = graphql`
  query usernameInputQuery($name: String!) {
    isUserVailable: userAvailable(name: $name)
  }
`;

interface UsernameInputProps extends InputProps {}

export const UsernameInput = forwardRef<HTMLInputElement, UsernameInputProps>(
	({ onChange, className, ...props }, ref) => {
		const [queryReference, loadQuery, disposeQuery] =
			useQueryLoader<usernameInputQuery>(UsernameInputQuery);

		const debouncedQuery = useCallback(
			debounce((name: string) => loadQuery({ name }), 700),
			[],
		);

		const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
			debouncedQuery(e.target.value);
			onChange?.(e);
		};

		useEffect(() => {
			return () => disposeQuery();
		}, [disposeQuery]);

		return (
			<div className={cn("relative", className)}>
				<Input ref={ref} {...props} onChange={handleChange} className="pr-10" />
				{defined(queryReference) && (
					<div className="absolute right-0 top-0 h-full px-3 py-2 flex items-center justify-center">
						<AvailabilityIcon queryReference={queryReference} />
					</div>
				)}
			</div>
		);
	},
);

interface AvailabilityIconProps {
	queryReference: PreloadedQuery<usernameInputQuery>;
}

function AvailabilityIcon({ queryReference }: AvailabilityIconProps) {
	const data = usePreloadedQuery<usernameInputQuery>(
		UsernameInputQuery,
		queryReference,
	);

	if (defined(data?.isUserVailable) && !data?.isUserVailable) {
		return <UserRoundCheck className="text-green-500 stroke-2" />;
	}

	if (defined(data?.isUserVailable)) {
		return <UserRoundXIcon className="text-red-500 stroke-2" />;
	}

	return null;
}
