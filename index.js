// Import reusable site navbar component
import { Navbar } from "./assets/js/components/Navbar.js";
import { Footer } from "./assets/js/components/Footer.js";

// Base path helper
import { getRepoBase } from "./assets/js/utils/repoBase.js";

// Import funtion that fetches all posts form API
import { getAllPost } from "./assets/api/post.js";

// For delete request + blog name
import { request } from "./assets/api/request.js";
import { BLOG_NAME } from "./assets/api/config.js";

// Login check
import { isLoggedIn } from "./assets/api/guard.js";

const base = getRepoBase();

// Landing page init
window.addEventListener("DOMContentLoaded", async () => {
	// Mount navbar
	document.getElementById("site-nav").append(Navbar());

	// Mount footer
	document.getElementById("site-footer").append(Footer());

	// Run OleWind again so hover effects works in navbar
	window.applyOleWind();

	// Fetch posts
	const res = await getAllPost();
	const posts = res.data;

	// Sort newest first
	const newestFirst = [...posts].sort((a, b) => new Date(b.created) - new Date(a.created));

	// Feature first 3 posts
	const featured = newestFirst.slice(0, 3);
	const featuredIds = new Set(featured.map((p) => p.id));

	// Remaining posts
	const rest = newestFirst.filter((p) => !featuredIds.has(p.id));

	setupFeaturedCarousel(featured);
	renderPostsGrid(rest);

	// Apply ow="" for everything injected
	window.applyOleWind();
});

// Delete helper (only works if logged in)
async function deletePostById(id) {
	const ok = confirm("Are you sure you want to delete this post?");
	if (!ok) return false;

	await request(`/blog/posts/${BLOG_NAME}/${id}`, { method: "DELETE" });
	return true;
}

// Featured carousel
function setupFeaturedCarousel(posts) {
	const stage = document.getElementById("featured-carousel");
	const titleEl = document.getElementById("featured-title");
	const prev = document.getElementById("featured-prev");
	const next = document.getElementById("featured-next");

	// Container for buttons under featured title
	let actionsEl = document.getElementById("featured-actions");
	if (!actionsEl) {
		actionsEl = document.createElement("div");
		actionsEl.id = "featured-actions";
		actionsEl.className = "flex justify-center gap-4 my-4";

		// Put it right under the title
		titleEl.insertAdjacentElement("afterend", actionsEl);
	}

	let i = 0;

	function render() {
		const post = posts[i];

		// Image area
		stage.innerHTML = "";
		const link = document.createElement("a");
		link.href = `${base}post/index.html?id=${encodeURIComponent(post.id)}`;
		link.className = "block";

		const img = document.createElement("img");
		img.src = post.media.url;
		img.alt = post.media.alt || post.title;
		img.className = "w-full h-full object-cover object-center";
		img.style.maxHeight = "inherit";

		link.append(img);
		stage.append(link);

		// Title
		titleEl.textContent = post.title;

		// Buttons under the featured title
		actionsEl.innerHTML = "";

		const readMore = document.createElement("a");
		readMore.className = "bg-olive no-underline text-white rounded-md px-6 py-2";
		readMore.href = `${base}post/index.html?id=${encodeURIComponent(post.id)}`;
		readMore.textContent = "Read more";

		actionsEl.append(readMore);

		// Only show edit/delete when logged in
		if (isLoggedIn()) {
			const edit = document.createElement("a");
			edit.className = "bg-dusty-blue no-underline text-white rounded-md px-6 py-2";
			edit.href = `${base}edit-post/index.html?id=${encodeURIComponent(post.id)}`;
			edit.textContent = "Edit post";

			const del = document.createElement("button");
			del.type = "button";
			del.className = "bg-charcoal text-white rounded-md px-6 py-2 cursor-pointer border";
			del.textContent = "Delete";

			del.addEventListener("click", async () => {
				try {
					const deleted = await deletePostById(post.id);
					if (!deleted) return;

					// Remove from carousel list and re-render
					posts.splice(i, 1);
					if (posts.length === 0) {
						stage.innerHTML = "";
						titleEl.textContent = "";
						actionsEl.innerHTML = "";
						prev.classList.add("hidden");
						next.classList.add("hidden");
						return;
					}
					i = i % posts.length;
					render();
				} catch (err) {
					alert(err.message);
				}
			});

			actionsEl.append(edit, del);
		}
	}

	prev.addEventListener("click", () => {
		i = (i - 1 + posts.length) % posts.length;
		render();
	});

	next.addEventListener("click", () => {
		i = (i + 1) % posts.length;
		render();
	});

	render();
}

// Post grid
function renderPostsGrid(posts) {
	const root = document.getElementById("posts-grid");
	root.innerHTML = "";

	posts.forEach((post) => {
		root.append(createPostCard(post, posts));
	});
}

// Single post card
function createPostCard(post, allPosts) {
	const article = document.createElement("article");
	article.className = "border rounded-lg";
	article.setAttribute("ow", "md:w-full md:max-w-sm");

	const img = document.createElement("img");
	img.src = post.media.url;
	img.alt = post.media.alt || post.title;
	img.className = "w-full border rounded-md";

	const title = document.createElement("h3");
	title.className = "text-large font-medium my-4";
	title.textContent = post.title || "Untitled";

	const p = document.createElement("p");
	p.textContent = makeExcerpt(post.body, 90);

	const btnWrap = document.createElement("div");
	btnWrap.className = "flex justify-center gap-4 my-6";

	const read = document.createElement("a");
	read.className = "bg-olive no-underline text-white rounded-md px-6 py-2";
	read.href = `${base}post/index.html?id=${encodeURIComponent(post.id)}`;
	read.textContent = "Read more";

	btnWrap.append(read);

	// Only show edit/delete when logged in
	if (isLoggedIn()) {
		const edit = document.createElement("a");
		edit.className = "bg-dusty-blue no-underline text-white rounded-md px-6 py-2";
		edit.href = `${base}edit-post/index.html?id=${encodeURIComponent(post.id)}`;
		edit.textContent = "Edit post";

		const del = document.createElement("button");
		del.type = "button";
		del.className = "bg-charcoal text-white rounded-md px-6 py-2 cursor-pointer border";
		del.textContent = "Delete";

		del.addEventListener("click", async () => {
			try {
				const deleted = await deletePostById(post.id);
				if (!deleted) return;

				// Remove from grid list and re-render grid
				const idx = allPosts.findIndex((p) => p.id === post.id);
				if (idx !== -1) allPosts.splice(idx, 1);
				renderPostsGrid(allPosts);

				window.applyOleWind();
			} catch (err) {
				alert(err.message);
			}
		});

		btnWrap.append(edit, del);
	}

	article.append(img, title, p, btnWrap);
	return article;
}

// Shorten text
function makeExcerpt(text = "", max = 90) {
	const s = String(text).trim();
	if (s.length <= max) return s;
	return s.slice(0, max).trim() + "...";
}
