import { Navbar } from "../../assets/js/components/Navbar.js";
import { getById } from "../../assets/api/post.js";

function getPostIdFromUrl() {
	return new URLSearchParams(window.location.search).get("id");
}

window.addEventListener("DOMContentLoaded", async () => {
	// Navbar
	document.getElementById("site-nav").append(Navbar());
	window.applyOleWind?.();

	// Fetch post
	const id = getPostIdFromUrl();
	const res = await getById(id);
	const post = res.data;

	// Render content
	document.getElementById("post-title").textContent = post.title;

	const img = document.getElementById("post-image");
	img.src = post.media.url;
	img.alt = post.media.alt || post.title;

	document.getElementById("post-body").textContent = post.body;
	document.getElementById("post-author").textContent =
		`Author: ${post.author?.name || post.author}`;

	window.applyOleWind?.();
});
