import {
	type GraphQLTaggedNode,
	useMutation as useMutationBase,
} from "react-relay";
import type { MutationParameters } from "relay-runtime";
import { toast } from "sonner";

export function useMutation<T extends MutationParameters>(
	mutation: GraphQLTaggedNode,
) {
	const [commit, inFlight] = useMutationBase<T>(mutation);
	const execute = (
		variables: T["variables"],
		onSuccess?: (data: T["response"]) => void,
	) => {
		commit({
			variables,
			onCompleted: (response, errors) => {
				const [error] = errors ?? [];
				if (error) toast.error(error.message);
				else if (response) onSuccess?.(response);
			},
		});
	};

	return [execute, inFlight] as const;
}
