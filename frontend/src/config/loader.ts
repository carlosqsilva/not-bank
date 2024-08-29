export async function checkSession() {
	try {
		const response = await fetch("/gql", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				query: "query root {\n user {\n id\n }\n}",
			}),
		});

		const {
			errors: [error] = [],
		} = await response.json();

		if (error?.message) return false;

		return true;
	} catch (e) {
		return false;
	}
}
