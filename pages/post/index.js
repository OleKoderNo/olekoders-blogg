// Import navbar
import { Navbar } from "../../assets/js/components/Navbar.js";

// Import API
import { getById } from "../../assets/api/post.js";

// Get post id from URL
function getPostIdFromUrl() {
	return new URLSearchParams(window.location.search).get("id");
}

// Build Google Maps embed URL (no API key required)
function buildGoogleMapsEmbed(lat, lng) {
	return `https://www.google.com/maps?q=${lat},${lng}&z=14&output=embed`;
}

window.addEventListener("DOMContentLoaded", async () => {
	// Mount navbar
	document.getElementById("site-nav").append(Navbar());
	window.applyOleWind?.();

	// Fetch post
	const id = getPostIdFromUrl();
	if (!id) return;

	const res = await getById(id);
	const post = res.data;

	// Render title
	document.getElementById("post-title").textContent = post.title;

	// Render image
	const img = document.getElementById("post-image");
	img.src = post.media.url;
	img.alt = post.media.alt || post.title;

	// Render body + author
	document.getElementById("post-body").textContent = post.body;
	document.getElementById("post-author").textContent =
		`Author: ${post.author?.name || post.author}`;

	// Render map ONLY if latitude & longitude exist
	const lat = post.location?.lat;
	const lng = post.location?.lng;

	if (typeof lat === "number" && typeof lng === "number") {
		const mapWrap = document.getElementById("map-wrap");
		const map = document.getElementById("post-map");

		map.src = buildGoogleMapsEmbed(lat, lng);
		mapWrap.classList.remove("hidden");
	}

	window.applyOleWind?.();
});
