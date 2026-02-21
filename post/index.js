import { Navbar } from "../assets/js/components/Navbar.js";
import { Footer } from "../assets/js/components/Footer.js";
import { getById } from "../assets/api/post.js";
import { getRepoBase } from "../assets/js/utils/repoBase.js";

function getPostIdFromUrl() {
	return new URLSearchParams(window.location.search).get("id");
}

window.addEventListener("DOMContentLoaded", async () => {
	const base = getRepoBase();

	// Navbar
	document.getElementById("site-nav").append(Navbar());
	//Footer
	document.getElementById("site-footer").append(Footer());
	window.applyOleWind?.();

	// Fetch post
	const id = getPostIdFromUrl();
	if (!id) {
		// Goes back to landingpage
		window.location.assign(`${base}index.html`);
	}
});
