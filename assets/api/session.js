// request.js reads accessToken + apiKey from localStorage automatically.
export function saveAuthSession({ accessToken }, apiKey) {
	localStorage.setItem("accessToken", accessToken);
	localStorage.setItem("apiKey", apiKey);
}

export function clearAuthSession() {
	localStorage.removeItem("accessToken");
	localStorage.removeItem("apiKey");
}
