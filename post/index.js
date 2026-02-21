import { Navbar } from "../assets/js/components/Navbar.js";
import { Footer } from "../assets/js/components/Footer.js";
import { getById, getAllPost } from "../assets/api/post.js";
import { getRepoBase } from "../assets/js/utils/repoBase.js";

// Base path
const base = getRepoBase();

// Turn a title into a url-friendly slug
function slugify(s = "") {
	return String(s)
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/(^-|-$)/g, "");
}

// Read post id from query
function getPostIdFromUrl() {
	return new URLSearchParams(window.location.search).get("id");
}

// Read slug from query
function getSlugFromUrl() {
	return new URLSearchParams(window.location.search).get("slug");
}

// Read slug from path
function getSlugFromPath() {
	const path = window.location.pathname;
	const marker = "/post/";
	const idx = path.indexOf(marker);
	if (idx === -1) return null;

	const after = path.slice(idx + marker.length);
	const seg = after.split("/")[0];

	// Ignore /post/index.html and only accept real slugs
	if (!seg || seg.includes(".html")) return null;
	return seg;
}

// Update browser url to pretty slug without reloading
function setPrettyPath(title) {
	const slug = slugify(title);
	if (!slug) return;

	history.replaceState({}, "", `${base}post/${encodeURIComponent(slug)}`);
}

window.addEventListener("DOMContentLoaded", async () => {
	// Navbar
	document.getElementById("site-nav").append(Navbar());

	// Footer
	document.getElementById("site-footer").append(Footer());

	// Apply OleWind for injected components
	window.applyOleWind?.();

	const id = getPostIdFromUrl();
	const slug = getSlugFromUrl() || getSlugFromPath();

	let post = null;

	// If id exists, fetch one post directly
	if (id) {
		const res = await getById(id);
		post = res.data;
	}
	// If slug exists fetch all posts and match by slugified title
	else if (slug) {
		const res = await getAllPost();
		const posts = res.data || [];
		post = posts.find((p) => slugify(p.title) === slug) || null;
	}

	// If no post error
	if (!post) {
		document.getElementById("post-title").textContent = "Post not found";
		document.getElementById("post-body").textContent = "Could not find that post.";
		return;
	}

	// Title
	document.getElementById("post-title").textContent = post.title;
	document.title = post.title;

	// Featured image
	const img = document.getElementById("post-image");
	img.src = post.media.url;
	img.alt = post.media.alt || post.title;

	// Post body andd  author
	document.getElementById("post-body").textContent = post.body;
	document.getElementById("post-author").textContent =
		`Author: ${post.author?.name || post.author}`;

	setPrettyPath(post.title);

	// Apply OleWind after rendering
	window.applyOleWind?.();
});
