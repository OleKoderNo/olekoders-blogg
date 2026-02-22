// Read a query param from current URL
export function getQueryParam(name) {
	return new URLSearchParams(window.location.search).get(name);
}

// Read slug from path (/post/<slug>)
export function getSlugFromPath({ marker = "/post/" } = {}) {
	const path = window.location.pathname;
	const idx = path.indexOf(marker);
	if (idx === -1) return null;

	const after = path.slice(idx + marker.length);
	const seg = after.split("/")[0];

	// Ignore /post/index.html and only accept real slugs
	if (!seg || seg.includes(".html")) return null;
	return seg;
}

// Update browser url to pretty slug without reloading
export function setPrettyPostPath({ base, slug }) {
	if (!slug) return;
	history.replaceState({}, "", `${base}post/${encodeURIComponent(slug)}`);
}
