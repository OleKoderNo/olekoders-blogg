import { request } from "./request.js";

// Register a new user
export function register({ name, email, password }) {
	return request("/auth/register", {
		method: "POST",
		body: JSON.stringify({ name, email, password }),
	});
}

// Login user
export function login({ email, password }) {
	return request("/auth/login", {
		method: "POST",
		body: JSON.stringify({ email, password }),
	});
}

// Create API key
export function createApiKey(name = "KapteinOle Blog Key") {
	return request("/auth/create-api-key", {
		method: "POST",
		body: JSON.stringify({ name }),
	});
}
