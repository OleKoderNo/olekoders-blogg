// Turn a title into a url-friendly slug
export function slugify(s = "") {
	return String(s)
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/(^-|-$)/g, "");
}
