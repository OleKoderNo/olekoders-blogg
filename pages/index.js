// Import reusable site navbar component
import { Navbar } from "../assets/js/components/Navbar.js";

// Import funtion that fetches all posts form API
import { getAllPost } from "../assets/api/post.js";

// Landing page init
window.addEventListener("DOMContentLoaded", async () => {
	// Mount navbar
	document.getElementById("site-nav").append(Navbar());

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

	window.applyOleWind();
});

// Featured carosel
function setupFeaturedCarousel(posts) {
	const stage = document.getElementById("featured-carousel");
	const titleEl = document.getElementById("featured-title");
	const prev = document.getElementById("featured-prev");
	const next = document.getElementById("featured-next");

	let i = 0;

	function render() {
		const post = posts[i];

		stage.innerHTML = "";

		const link = document.createElement("a");
		link.href = `./post/index.html?id=${post.id}`;
		link.className = "block";

		const img = document.createElement("img");
		img.src = post.media.url;
		img.alt = post.media.alt || post.title;
		img.className = "w-full h-full object-cover object-center";
		img.style.maxHeight = "inherit";

		link.append(img);
		stage.append(link);

		titleEl.textContent = post.title;
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
		root.append(createPostCard(post));
	});
}

// Single post card
function createPostCard(post) {
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
	btnWrap.className = "flex justify-center my-6";

	const link = document.createElement("a");
	link.className = "bg-olive no-underline text-white rounded-md px-6 py-2";
	link.href = `./post/index.html?id=${post.id}`;
	link.textContent = "Read more";

	btnWrap.append(link);
	article.append(img, title, p, btnWrap);

	return article;
}

// Shorten text
function makeExcerpt(text = "", max = 90) {
	const s = String(text).trim();
	if (s.length <= max) return s;
	return s.slice(0, max).trim() + "...";
}
