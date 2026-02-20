import { request } from "../assets/api/request.js";
import { BLOG_NAME } from "../assets/api/config.js";
import { requireAuth } from "../assets/api/guard.js";
import { getById } from "../assets/api/post.js";

// Redirect if not logged in
if (!requireAuth()) {
	throw new Error("User not authenticated");
}

// Get id from URL
function getIdFromUrl() {
	return new URLSearchParams(window.location.search).get("id");
}

// DOM references
const form = document.getElementById("edit-post-form");
const titleEl = document.getElementById("title");
const bodyEl = document.getElementById("body");
const mediaUrlEl = document.getElementById("mediaUrl");
const mediaAltEl = document.getElementById("mediaAlt");
const latEl = document.getElementById("latitude");
const lngEl = document.getElementById("longitude");
const errorEl = document.getElementById("form-error");
const deleteBtn = document.getElementById("delete-btn");

// Show error
function showError(message) {
	errorEl.textContent = message;
	errorEl.classList.remove("hidden");
}

// Clear error
function clearError() {
	errorEl.textContent = "";
	errorEl.classList.add("hidden");
}

const id = getIdFromUrl();
if (!id) showError("Missing post id in URL");

// Load current post and fill inputs
window.addEventListener("DOMContentLoaded", async () => {
	if (!id) return;

	try {
		const res = await getById(id);
		const post = res.data;

		titleEl.value = post.title || "";
		bodyEl.value = post.body || "";
		mediaUrlEl.value = post.media?.url || "";
		mediaAltEl.value = post.media?.alt || "";
	} catch (err) {
		showError(err.message);
	}
});

// Save changes
form.addEventListener("submit", async (e) => {
	e.preventDefault();
	clearError();

	const title = titleEl.value.trim();
	const body = bodyEl.value.trim();
	const mediaUrl = mediaUrlEl.value.trim();
	const mediaAlt = mediaAltEl.value.trim();

	if (!title) return showError("Title is required.");
	if (!body) return showError("Text is required.");
	if (!mediaUrl) return showError("Image URL is required.");

	const payload = {
		title,
		body,
		media: {
			url: mediaUrl,
			alt: mediaAlt || title,
		},
	};

	try {
		const res = await request(`/blog/posts/${BLOG_NAME}/${id}`, {
			method: "PUT",
			body: JSON.stringify(payload),
		});

		const updated = res.data;
		window.location.href = `/post/index.html?id=${updated.id}`;
	} catch (err) {
		showError(err.message);
	}
});

// Delete post
deleteBtn.addEventListener("click", async () => {
	clearError();

	const ok = confirm("Are you sure you want to delete this post?");
	if (!ok) return;

	try {
		await request(`/blog/posts/${BLOG_NAME}/${id}`, { method: "DELETE" });
		window.location.href = "/index.html";
	} catch (err) {
		showError(err.message);
	}
});
