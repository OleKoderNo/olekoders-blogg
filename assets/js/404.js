import { Navbar } from "./components/Navbar.js";
import { Footer } from "./components/Footer.js";
import { getRepoBase } from "./utils/repoBase.js";

export function handle404() {
	const base = getRepoBase();

	// Mount navbar
	document.getElementById("site-nav")?.append(Navbar());
	// Mount footer
	document.getElementById("site-footer")?.append(Footer());

	const homeLink = document.getElementById("home-link");
	if (homeLink) homeLink.href = base;

	// Apply OleWind after DOM injection
	window.applyOleWind?.();

	const path = window.location.pathname;

	// Only handle /post/<slug>
	const marker = "/post/";
	const idx = path.indexOf(marker);
	if (idx === -1) return;

	// Extract slug from URL
	const slug = path.slice(idx + marker.length).split("/")[0];
	if (!slug) return;

	// Redirect to real post page
	window.location.replace(`${base}post/index.html?slug=${encodeURIComponent(slug)}`);
}

// Explicit call (no run-once style)
handle404();
