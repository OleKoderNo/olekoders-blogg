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
	brand.className = "text-large font-bold text-charcoal no-underline";

	// OleWind classes
	brand.setAttribute("ow", "hover:underline");
	brand.textContent = "OleKoder's Blogg";

	// Mobile menu button (shows on small screens)
	const menuBtn = document.createElement("button");
	menuBtn.type = "button";
	menuBtn.textContent = "Menu";
	menuBtn.className =
		"border border-charcoal rounded-md px-4 py-2 bg-off-white text-charcoal cursor-pointer";
	menuBtn.setAttribute("ow", "md:hidden");

	// Right side navigation (desktop)
	const actions = document.createElement("div");
	actions.className = "flex gap-4 items-center";
	actions.setAttribute("ow", "hidden md:flex");

	// Dropdown container (mobile)
	const mobileMenu = document.createElement("div");
	mobileMenu.className = "px-4 pb-4";
	mobileMenu.classList.add("hidden");
	mobileMenu.setAttribute("ow", "md:hidden");

	// Regular navigation links
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

	// Authenitcation buttons (desktop)
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

	// Authenitcation buttons (mobile)
	const loginBtnMobile = LinkButton({
		href: `${base}pages/login/index.html`,
		label: "Login",
		variant: "primary",
		size: "md",
		extra: "px-5 py-3 max-w-sm",
	});

	const signupBtnMobile = LinkButton({
		href: `${base}pages/login/index.html#signup`,
		label: "Sign up",
		variant: "secondary",
		size: "md",
		extra: "px-5 py-3 max-w-sm",
	});

	// Desktop navbar
	actions.append(homeLink.cloneNode(true), randomLink.cloneNode(true), loginBtn, signupBtn);

	// Mobile dropdown layout
	const mobileStack = document.createElement("div");
	mobileStack.className = "flex flex-col gap-4 items-center";
	mobileStack.append(homeLink, randomLink, loginBtnMobile, signupBtnMobile);
	mobileMenu.append(mobileStack);

	// Toggle dropdown
	let open = false;
	menuBtn.addEventListener("click", () => {
		open = !open;
		mobileMenu.classList.toggle("hidden", !open);
	});

	// Assemble navbar
	inner.append(brand, menuBtn, actions);
	nav.append(inner, mobileMenu);

	return nav;
}
