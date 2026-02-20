// Import reusable link buttons
import { LinkButton } from "./Button.js";
import { isLoggedIn } from "/assets/api/guard.js";

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

	// Check user state
	const loggedIn = isLoggedIn();
	const profileName = localStorage.getItem("profileName") || "User";

	// Nav wrapper
	const nav = document.createElement("header");
	nav.className = "w-full border-b";

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

	// Display if logged in (desktop)
	const loggedInText = document.createElement("span");
	loggedInText.className = "text-small font-medium text-charcoal";
	loggedInText.textContent = `Logged into: ${profileName}`;

	// Create post button (desktop) - only used when logged in
	const createPostBtn = LinkButton({
		href: `${base}create-post/index.html`,
		label: "Create post",
		variant: "primary", // olive
		size: "sm",
	});

	// Create post button (mobile) - only used when logged in
	const createPostBtnMobile = LinkButton({
		href: `${base}create-post/index.html`,
		label: "Create post",
		variant: "primary", // olive
		size: "md",
		extra: "px-5 py-3 max-w-sm",
	});

	// Logout button (desktop)
	const logoutBtn = LinkButton({
		href: "#",
		label: "Logout",
		variant: "danger",
		size: "sm",
	});

	// Logout button (mobile)
	const logoutBtnMobile = LinkButton({
		href: "#",
		label: "Logout",
		variant: "danger",
		size: "md",
		extra: "px-5 py-3 max-w-sm",
	});

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

	//Logout logic
	function doLogout(e) {
		e.preventDefault();
		localStorage.removeItem("accessToken");
		localStorage.removeItem("apiKey");
		localStorage.removeItem("profileName");
		localStorage.removeItem("profileEmail");
		window.location.href = `${base}index.html`;
	}

	// Bind logout clicks
	logoutBtn.addEventListener("click", doLogout);
	logoutBtnMobile.addEventListener("click", doLogout);

	// Desktop navbar (always show links)
	actions.append(homeLink.cloneNode(true), randomLink.cloneNode(true));

	// Mobile dropdown layout (always show links)
	const mobileStack = document.createElement("div");
	mobileStack.className = "flex flex-col gap-4 items-center";
	mobileStack.append(homeLink, randomLink);

	// If logged in: show name + create post + logout, else show login/signup
	if (loggedIn) {
		// Desktop: ... Logged into: X | Create post | Logout
		actions.append(loggedInText, createPostBtn, logoutBtn);

		// Mobile: stacked
		const mobileLoggedInText = loggedInText.cloneNode(true);
		mobileStack.append(mobileLoggedInText, createPostBtnMobile, logoutBtnMobile);
	} else {
		actions.append(loginBtn, signupBtn);
		mobileStack.append(loginBtnMobile, signupBtnMobile);
	}

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
