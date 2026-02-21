// Returns correct basepath
export function getRepoBase() {
	const { hostname, pathname } = window.location;

	// Local development
	if (hostname === "localhost" || hostname === "127.0.0.1") {
		return "/";
	}

	// GitHub Pages repo deployment
	const parts = pathname.split("/").filter(Boolean);
	const repo = parts[0];

	return repo ? `/${repo}/` : "/";
}
