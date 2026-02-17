// Import reusable link buttons
import { LinkButton } from "./Button.js";

//Calculate relative path to site root
function getBasePath() {
	const parts = window.location.pathname.split("/").filter(Boolean);

	const pagesIndex = parts.indexOf("pages");
	const afterPages = pagesIndex === -1 ? parts.length - 1 : parts.length - pagesIndex - 1;

	const depth = Math.max(0, afterPages - 1);

	return depth === 0 ? "./" : "../".repeat(depth);
}

// Navbar component
export function Navbar() {
	const base = getBasePath();

	// Nav wrapper
	const nav = document.createElement("header");
	nav.className = "w-full border";

	// layout container
	const inner = document.createElement("div");
	inner.className = "max-w-page mx-auto px-4 py-4 flex justify-between items-center";

	// Branding
	const brand = document.createElement("a");
	brand.href = `${base}index.html`;

	// Static class
	brand.className = "text-large font-bold text-charcoal";

	// OleWind classes
	brand.setAttribute("ow", "hover:underline");
	brand.textContent = "OleKoder's Blogg";

	// Right side navigation
	const actions = document.createElement("div");
	actions.className = "flex gap-4 items-center";

	//Regular navigation links
	const homeLink = document.createElement("a");
	homeLink.href = `${base}index.html`;
	homeLink.textContent = "Home";
	homeLink.className = "text-charcoal no-underline";
	homeLink.setAttribute("ow", "hover:underline");

	const randomLink = document.createElement("a");
	randomLink.href = `${base}index.html`;
	randomLink.textContent = "Random post";
	randomLink.className = "text-charcoal no-underline";
	randomLink.setAttribute("ow", "hover:underline");

	// Authenitcation buttons
	const loginBtn = LinkButton({
		href: `${base}pages/login/index.html`,
		label: "Login",
		variant: "primary",
		size: "sm",
	});

	const signupBtn = LinkButton({
		href: `${base}pages/login/index.html#signup`,
		label: "Sign up",
		variant: "secondary",
		size: "sm",
	});

	// Assemble navbar
	actions.append(homeLink, randomLink, loginBtn, signupBtn);
	inner.append(brand, actions);
	nav.append(inner);

	return nav;
}
