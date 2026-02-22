import { Navbar } from "../assets/js/components/Navbar.js";
import { Footer } from "../assets/js/components/Footer.js";
import { getRepoBase } from "../assets/js/utils/repoBase.js";
import { ShareButton } from "../assets/js/components/ShareButton.js";
import { slugify } from "../assets/js/utils/slug.js";
import { getQueryParam, getSlugFromPath, setPrettyPostPath } from "../assets/js/utils/url.js";
import { findPost } from "../assets/js/utils/findPost.js";

// Base path
const base = getRepoBase();

window.addEventListener("DOMContentLoaded", async () => {
	// Navbar
	document.getElementById("site-nav").append(Navbar());

	// Footer
	document.getElementById("site-footer").append(Footer());

	// Apply OleWind for injected components
	window.applyOleWind?.();

	// Read post id from query
	const id = getQueryParam("id");

	// Read slug from query
	const slug = getQueryParam("slug") || getSlugFromPath();

	// Fetch post using either id or slug
	const post = await findPost({ id, slug });

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

	// Post body and author
	document.getElementById("post-body").textContent = post.body;
	document.getElementById("post-author").textContent =
		`Author: ${post.author?.name || post.author}`;

	// Update URL to /post/<slug>
	const prettySlug = slugify(post.title);
	setPrettyPostPath({ base, slug: prettySlug });

	// Mount share button
	const shareButton = document.getElementById("share-root");
	if (shareButton) {
		shareButton.innerHTML = "";
		shareButton.append(ShareButton({ title: post.title }));
	}

	// Apply OleWind after rendering
	window.applyOleWind?.();
});
