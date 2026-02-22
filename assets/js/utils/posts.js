// Sort newest first
export function sortNewestFirst(posts = []) {
	return [...posts].sort((a, b) => new Date(b.created) - new Date(a.created));
}

// Split list into featured + rest
export function splitFeatured(posts = [], n = 3) {
	const featured = posts.slice(0, n);
	const ids = new Set(featured.map((p) => p.id));
	const rest = posts.filter((p) => !ids.has(p.id));
	return { featured, rest };
}
