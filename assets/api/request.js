// request.js
import { API_BASE_URL } from "./config.js";
import { getAccessToken, getApiKey } from "./auth.js";

export async function request(path, options = {}) {
	const url = `${API_BASE_URL}${path}`;

	const headers = new Headers(options.headers || {});
	headers.set("Content-Type", "application/json");

	const token = getAccessToken();
	const apiKey = getApiKey();

	if (token) headers.set("Authorization", `Bearer ${token}`);
	if (apiKey) headers.set("X-Noroff-API-Key", apiKey);

	const response = await fetch(url, { ...options, headers });

	let data = null;
	try {
		data = await response.json();
	} catch {}

	if (!response.ok) {
		console.error("Request failed:", response.status, url, data);
		throw new Error(data?.errors?.[0]?.message || `${response.status} ${response.statusText}`);
	}

	return data;
}
