import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import relay from "vite-plugin-relay";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react(), relay],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
	server: {
		proxy: {
			"/gql": {
				target: "http://localhost:3000",
				changeOrigin: true,
			},
		},
	},
});
