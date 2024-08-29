import {
	commitMutation,
	Environment,
	Network,
	Observable,
	RecordSource,
	Store,
	type OperationType,
	type GraphQLTaggedNode,
	type MutationParameters,
} from "relay-runtime";
import { loadQuery, usePreloadedQuery, type PreloadedQuery } from "react-relay";
import { toast } from "sonner";
import { useLoaderData } from "react-router-dom";
import { useEffect } from "react";

export function createRelayEnvironment() {
	const network = Network.create((params, variables) => {
		const response = fetch("/gql", {
			method: "POST",
			headers: [["Content-Type", "application/json"]],
			body: JSON.stringify({
				query: params.text,
				variables,
			}),
		});

		return Observable.from(response.then((d) => d.json()));
	});

	const store = new Store(new RecordSource());
	return new Environment({
		store,
		network,
		relayFieldLogger: (e) => console.log(e.fieldPath),
	});
}

export const relayEnvironment = createRelayEnvironment();

export function executeMutation<T extends MutationParameters>(
	mutation: GraphQLTaggedNode,
	variables: T["variables"],
): Promise<T["response"] | null> {
	return new Promise((resolve, reject) => {
		commitMutation(relayEnvironment, {
			mutation,
			variables,
			onError: reject,
			onCompleted: (response, errors) => {
				const [error] = errors ?? [];
				if (error) {
					toast.error(error.message);
					resolve(null);
				}
				if (response) resolve(response);
			},
		});
	});
}

export function executeQuery<T extends OperationType>(
	query: GraphQLTaggedNode,
	variables?: T["variables"],
) {
	return loadQuery(relayEnvironment, query, variables ?? {}, {
		fetchPolicy: "network-only",
	});
}

export function useLoaderQuery<T extends OperationType>(
	query: GraphQLTaggedNode,
) {
	const queryReference = useLoaderData() as PreloadedQuery<T>;
	const data = usePreloadedQuery(query, queryReference);
	useEffect(() => {
		() => queryReference.dispose();
	}, [queryReference]);
	return data;
}
