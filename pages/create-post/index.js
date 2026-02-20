import { request } from "/assets/api/request.js";
import { BLOG_NAME } from "/assets/api/config.js";
import { requireAuth } from "/assets/api/guard.js";

// Redirect immediately if user is not logged in
if (!requireAuth()) {
	throw new Error("User not authenticated");
}

// DOM references
const form = document.getElementById("create-post-form");
const titleEl = document.getElementById("title");
const bodyEl = document.getElementById("body");
const mediaUrlEl = document.getElementById("mediaUrl");
const mediaAltEl = document.getElementById("mediaAlt");
const latEl = document.getElementById("latitude");
const lngEl = document.getElementById("longitude");
const errorEl = document.getElementById("form-error");

// Show form error
function showError(message) {
	errorEl.textContent = message;
	errorEl.style.display = "block";
}

// Clear form error
function clearError() {
	errorEl.textContent = "";
	errorEl.style.display = "none";
}

// Handle submit
form.addEventListener("submit", async (e) => {
	e.preventDefault();
	clearError();

	const title = titleEl.value.trim();
	const body = bodyEl.value.trim();
	const mediaUrl = mediaUrlEl.value.trim();
	const mediaAlt = mediaAltEl.value.trim();

	// Optional lat/lng
	const lat = latEl.value ? Number(latEl.value) : null;
	const lng = lngEl.value ? Number(lngEl.value) : null;

	// Basic validation
	if (!title) return showError("Title is required.");
	if (!body) return showError("Text is required.");
	if (!mediaUrl) return showError("Image URL is required.");

	// If one of lat/lng is filled, require both
	if ((latEl.value && !lngEl.value) || (!latEl.value && lngEl.value)) {
		return showError("Please fill both Latitude and Longitude.");
	}

	const payload = {
		title,
		body,
		media: {
			url: mediaUrl,
			alt: mediaAlt || title,
		},
		// Only include location if both values exist
		...(lat !== null &&
			lng !== null && {
				location: {
					lat,
					lng,
				},
			}),
	};

	try {
		// Create post
		const res = await request(`/blog/posts/${BLOG_NAME}`, {
			method: "POST",
			body: JSON.stringify(payload),
		});

		// Redirect to new post
		const newPost = res.data;
		window.location.href = `/pages/post/index.html?id=${newPost.id}`;
	} catch (err) {
		showError(err.message);
	}
});
