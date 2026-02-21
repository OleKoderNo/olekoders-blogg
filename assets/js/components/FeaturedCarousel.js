import { isLoggedIn } from "../../api/guard.js";

// Featured carousel
export function FeaturedCarousel({
	posts,
	base,
	stageId = "featured-carousel",
	titleId = "featured-title",
	prevId = "featured-prev",
	nextId = "featured-next",
	dotsId = "featured-dots",
	actionsId = "featured-actions",
	intervalMs = 5000,
	onDelete,
}) {
	// Main DOM hooks
	const stage = document.getElementById(stageId);
	const titleEl = document.getElementById(titleId);
	const prev = document.getElementById(prevId);
	const next = document.getElementById(nextId);
	const dotsEl = document.getElementById(dotsId);

	// Buttons
	let actionsEl = document.getElementById(actionsId);
	if (!actionsEl) {
		actionsEl = document.createElement("div");
		actionsEl.id = actionsId;
		actionsEl.className = "flex justify-center gap-4 my-4";
		titleEl.insertAdjacentElement("afterend", actionsEl);
	}

	// Current slide index
	let i = 0;

	// Auto-rotate timer refrence
	let timer = null;

	// Preload all images
	const preload = posts.map((p) => {
		const img = new Image();
		img.src = p?.media?.url || "";
		return img;
	});

	// Set active dot
	function setActiveDot() {
		if (!dotsEl) return;
		Array.from(dotsEl.children).forEach((btn, idx) => {
			// Active dot
			btn.classList.remove("bg-cloud");
			// Normal dot
			btn.classList.add("bg-gray");
			btn.setAttribute("aria-current", "false");
			// Changes active dot based on index
			if (idx === i) {
				btn.classList.remove("bg-gray");
				btn.classList.add("bg-cloud");
				btn.setAttribute("aria-current", "true");
			}
		});
	}

	// Build dots
	function renderDots() {
		if (!dotsEl) return;
		dotsEl.innerHTML = "";

		posts.forEach((_, idx) => {
			const b = document.createElement("button");
			b.type = "button";
			b.className = "w-3 h-3 rounded-full border border-cloud bg-gray cursor-pointer";
			b.setAttribute("aria-label", `Go to slide ${idx + 1}`);
			b.addEventListener("click", () => {
				i = idx;
				render();
				restartTimer();
			});
			dotsEl.append(b);
		});

		setActiveDot();
	}

	// Build slide
	function buildSlide(post) {
		const link = document.createElement("a");
		link.href = `${base}post/index.html?id=${encodeURIComponent(post.id)}`;
		link.className = "block w-full h-full";

		const img = document.createElement("img");
		img.src = post.media.url;
		img.alt = post.media.alt || post.title;
		img.className = "w-full h-full object-cover object-center";
		img.loading = "eager";
		img.decoding = "async";

		link.append(img);
		return link;
	}

	// Render buttons
	function renderActions(post) {
		actionsEl.innerHTML = "";

		const readMore = document.createElement("a");
		readMore.className = "bg-olive no-underline text-white rounded-md px-6 py-2";
		readMore.href = `${base}post/index.html?id=${encodeURIComponent(post.id)}`;
		readMore.textContent = "Read more";
		actionsEl.append(readMore);

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
					if (!onDelete) return;
					const ok = await onDelete(post.id);
					if (!ok) return;

					posts.splice(i, 1);

					if (posts.length === 0) {
						stage.innerHTML = "";
						titleEl.textContent = "";
						actionsEl.innerHTML = "";
						if (dotsEl) dotsEl.innerHTML = "";
						prev.classList.add("hidden");
						next.classList.add("hidden");
						stopTimer();
						return;
					}

					i = i % posts.length;
					renderDots();
					render();
					window.applyOleWind();
				} catch (err) {
					alert(err.message);
				}
			});

			actionsEl.append(edit, del);
		}
	}

	// Render slide, title, actions and dot state
	function render() {
		if (!posts.length) return;
		const post = posts[i];

		stage.innerHTML = "";
		stage.append(buildSlide(post));

		titleEl.textContent = post.title || "";
		renderActions(post);

		setActiveDot();
		window.applyOleWind();
	}

	// Go to next slide
	function nextSlide() {
		if (!posts.length) return;
		i = (i + 1) % posts.length;
		render();
	}

	// Go to previous slide
	function prevSlide() {
		if (!posts.length) return;
		i = (i - 1 + posts.length) % posts.length;
		render();
	}

	// Stop auto-rotation
	function stopTimer() {
		if (timer) clearInterval(timer);
		timer = null;
	}

	// Start auto rotation
	function startTimer() {
		stopTimer();
		if (posts.length <= 1) return;
		timer = setInterval(nextSlide, intervalMs);
	}

	// Restart rotation after manual navigation
	function restartTimer() {
		startTimer();
	}

	// Arrow navigation
	prev.addEventListener("click", () => {
		prevSlide();
		restartTimer();
	});

	next.addEventListener("click", () => {
		nextSlide();
		restartTimer();
	});

	// Pause on hover, starts when no longer hovering
	stage.addEventListener("mouseenter", stopTimer);
	stage.addEventListener("mouseleave", startTimer);

	renderDots();
	render();

	Promise.all(
		preload.map(
			(img) =>
				new Promise((resolve) => {
					if (img.complete) return resolve(true);
					img.onload = () => resolve(true);
					img.onerror = () => resolve(false);
				}),
		),
	).finally(() => startTimer());

	return {
		next: nextSlide,
		prev: prevSlide,
		stop: stopTimer,
		start: startTimer,
	};
}
