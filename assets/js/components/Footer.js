export function Footer() {
	function getRepoBase() {
		const host = window.location.hostname;
		if (host === "127.0.0.1" || host === "localhost") return "/";

		const parts = window.location.pathname.split("/").filter(Boolean);
		const repo = parts[0] || "";
		return `/${repo}/`;
	}

	const base = getRepoBase();
	const year = new Date().getFullYear();

	// Footer wrapper
	const footer = document.createElement("footer");
	footer.className = "border-t bg-off-white";

	// Inner container
	const inner = document.createElement("div");
	inner.className = "max-w-page mx-auto px-4 py-6 flex flex-col gap-4";
	inner.setAttribute("ow", "md:flex-row md:justify-between md:items-center");

	// Brand link
	const brand = document.createElement("a");
	brand.href = `${base}index.html`;
	brand.textContent = "OleKoder's Blogg";
	brand.className = "text-large font-bold text-charcoal no-underline";
	brand.setAttribute("ow", "hover:underline");

	// Links container
	const nav = document.createElement("div");
	nav.className = "flex flex-col gap-2";
	nav.setAttribute("ow", "md:flex-row md:items-center md:gap-6");

	// Terms link
	const terms = document.createElement("a");
	terms.href = `${base}terms/index.html`;
	terms.textContent = "Terms of Service";
	terms.className = "text-charcoal no-underline";
	terms.setAttribute("ow", "hover:underline");

	// Contact email
	const contact = document.createElement("a");
	contact.href = "mailto:ohfb96@gmail.com";
	contact.textContent = "Contact";
	contact.className = "text-charcoal no-underline";
	contact.setAttribute("ow", "hover:underline");

	// Donald Ducks adress for safety reasons
	const address = document.createElement("a");
	address.href = `${base}index.html`;
	address.textContent = "1313 Quack Street, Duckburg";
	address.className = "text-charcoal no-underline";
	address.setAttribute("ow", "hover:underline");

	nav.append(terms, contact, address);

	// Copyright
	const copy = document.createElement("p");
	copy.className = "text-small text-charcoal";
	copy.textContent = `© ${year} OleKoder's Blogg. All rights reserved.`;

	// Assemble
	inner.append(brand, nav, copy);
	footer.append(inner);

	return footer;
}
