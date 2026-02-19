export function requireAuth(redirectPath = "/pages/login/index.html") {
	const token = localStorage.getItem("accessToken");
	const apiKey = localStorage.getItem("apiKey");

	// If user is not authenticated, redirect
	if (!token || !apiKey) {
		window.location.href.replace(redirectPath);
		return false;
	}

	return true;
}

export function isLoggedIn() {
	return Boolean(localStorage.getItem("accessToken"));
}
