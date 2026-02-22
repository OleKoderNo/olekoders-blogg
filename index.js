import { Navbar } from "./assets/js/components/Navbar.js";
import { Footer } from "./assets/js/components/Footer.js";
import { getRepoBase } from "./assets/js/utils/repoBase.js";
import { getAllPost } from "./assets/api/post.js";
import { request } from "./assets/api/request.js";
import { BLOG_NAME } from "./assets/api/config.js";
import { isLoggedIn } from "./assets/api/guard.js";
import { FeaturedCarousel } from "./assets/js/components/FeaturedCarousel.js";
import { sortNewestFirst, splitFeatured } from "./assets/js/utils/posts.js";
import { makeExcerpt } from "./assets/js/utils/text.js";

const base = getRepoBase();
// Landing page init

window.addEventListener("DOMContentLoaded", async () => {
	// Mount navbar
	document.getElementById("site-nav").append(Navbar());

	// Mount footer
	document.getElementById("site-footer").append(Footer());

	// Run OleWind again so hover effects works in navbar
	window.applyOleWind();

	// Fetch all posts for landing page
	const res = await getAllPost();
	const posts = res.data;

	// Sort newest first
	const newestFirst = sortNewestFirst(posts);

	// Featured posts are taken from the newest-first list
	const { featured, rest } = splitFeatured(newestFirst, 3);

	// Initialize featured carousel
	FeaturedCarousel({
		posts: featured,
		base,
		intervalMs: 5000,
		onDelete: deletePostById,
	});

	// Render remaining posts
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
	img.loading = "lazy";
	img.decoding = "async";

	const title = document.createElement("h3");
	title.className = "text-large font-medium my-4 font-playpen";
	title.textContent = post.title || "Untitled";

	const p = document.createElement("p");

	// Excerpt logic is extracted to a util to keep markup readable
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
