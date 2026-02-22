import { LinkButton } from "./Button.js";
import { isLoggedIn } from "../../api/guard.js";
import { getAllPost } from "../../api/post.js";
import { getRepoBase } from "../utils/repoBase.js";

export function Navbar() {
	const base = getRepoBase();

	const loggedIn = isLoggedIn();
	const profileName = localStorage.getItem("profileName") || "User";

	const nav = document.createElement("header");
	nav.className = "w-full border-b bg-off-white";

	const inner = document.createElement("div");
	inner.className = "max-w-page mx-auto px-4 py-4 flex justify-between items-center";

	const brand = document.createElement("a");
	brand.href = base;
	brand.className = "text-large font-bold text-charcoal no-underline";
	brand.setAttribute("ow", "hover:underline");
	brand.textContent = "OleKoder's Blogg";

	const menuBtn = document.createElement("button");
	menuBtn.type = "button";
	menuBtn.textContent = "Menu";
	menuBtn.className =
		"border border-charcoal rounded-md px-4 py-2 bg-off-white text-charcoal cursor-pointer";
	menuBtn.setAttribute("ow", "md:hidden");

	const actions = document.createElement("div");
	actions.className = "flex gap-4 items-center";
	actions.setAttribute("ow", "hidden md:flex");

	const mobileMenu = document.createElement("div");
	mobileMenu.className = "px-4 pb-4 hidden md-hidden";

	const homeLink = document.createElement("a");
	homeLink.href = base;
	homeLink.textContent = "Home";
	homeLink.className = "text-charcoal no-underline";
	homeLink.setAttribute("ow", "hover:underline");

	const randomLink = document.createElement("a");
	randomLink.href = "#";
	randomLink.textContent = "Random post";
	randomLink.className = "text-charcoal no-underline";
	randomLink.setAttribute("ow", "hover:underline");

	const loggedInText = document.createElement("span");
	loggedInText.className = "text-small font-medium text-charcoal";
	loggedInText.textContent = `Logged into: ${profileName}`;

	const createPostBtn = LinkButton({
		href: `${base}create-post/`,
		label: "Create post",
		variant: "primary",
		size: "sm",
	});

	const createPostBtnMobile = LinkButton({
		href: `${base}create-post/`,
		label: "Create post",
		variant: "primary",
		size: "md",
		extra: "px-5 py-3 max-w-sm",
	});

	const logoutBtn = LinkButton({
		href: "#",
		label: "Logout",
		variant: "danger",
		size: "sm",
	});

	const logoutBtnMobile = LinkButton({
		href: "#",
		label: "Logout",
		variant: "danger",
		size: "md",
		extra: "px-5 py-3 max-w-sm",
	});

	const loginBtn = LinkButton({
		href: `${base}account/login/`,
		label: "Login",
		variant: "primary",
		size: "sm",
	});

	const signupBtn = LinkButton({
		href: `${base}account/signup/`,
		label: "Sign up",
		variant: "secondary",
		size: "sm",
	});

	const loginBtnMobile = LinkButton({
		href: `${base}account/login/`,
		label: "Login",
		variant: "primary",
		size: "md",
		extra: "px-5 py-3 max-w-sm",
	});

	const signupBtnMobile = LinkButton({
		href: `${base}account/signup/`,
		label: "Sign up",
		variant: "secondary",
		size: "md",
		extra: "px-5 py-3 max-w-sm",
	});

	let open = false;

	function doLogout(e) {
		e.preventDefault();
		localStorage.removeItem("accessToken");
		localStorage.removeItem("apiKey");
		localStorage.removeItem("profileName");
		localStorage.removeItem("profileEmail");
		window.location.href = base;
	}

	async function goToRandomPost(e) {
		e.preventDefault();

		const el = e.currentTarget;
		const originalText = el.textContent;

		el.textContent = "Loading...";
		el.style.pointerEvents = "none";

		try {
			const res = await getAllPost();
			const posts = res?.data ?? [];

			if (!Array.isArray(posts) || posts.length === 0) {
				throw new Error("No posts found");
			}

			const random = posts[Math.floor(Math.random() * posts.length)];
			const id = random?.id;

			if (!id) throw new Error("Post missing id");

			window.location.href = `${base}post/?id=${encodeURIComponent(id)}`;
		} catch (err) {
			console.error(err);
			alert("Could not load a random post. Try again.");
			el.textContent = originalText;
			el.style.pointerEvents = "";
		}
	}

	randomLink.addEventListener("click", goToRandomPost);
	logoutBtn.addEventListener("click", doLogout);
	logoutBtnMobile.addEventListener("click", doLogout);

	const homeLinkDesktop = homeLink.cloneNode(true);

	const randomLinkDesktop = randomLink.cloneNode(true);
	randomLinkDesktop.href = "#";
	randomLinkDesktop.addEventListener("click", goToRandomPost);

	actions.append(homeLinkDesktop, randomLinkDesktop);

	const mobileStack = document.createElement("div");
	mobileStack.className = "flex flex-col gap-4 items-center";
	mobileStack.append(homeLink, randomLink);

	if (loggedIn) {
		actions.append(loggedInText, createPostBtn, logoutBtn);
		const mobileLoggedInText = loggedInText.cloneNode(true);
		mobileStack.append(mobileLoggedInText, createPostBtnMobile, logoutBtnMobile);
	} else {
		actions.append(loginBtn, signupBtn);
		mobileStack.append(loginBtnMobile, signupBtnMobile);
	}

	mobileMenu.append(mobileStack);

	menuBtn.addEventListener("click", () => {
		open = !open;
		mobileMenu.classList.toggle("hidden", !open);
	});

	inner.append(brand, menuBtn, actions);
	nav.append(inner, mobileMenu);

	return nav;
}
