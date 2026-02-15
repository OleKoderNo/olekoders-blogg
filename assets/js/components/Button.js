export function LinkButton({ href, label, variant = "primary", size = "md", extra = "" }) {
	return baseButton("a", { href, label, variant, size, extra });
}

export function SubmitButton({ label, variant = "primary", size = "md", extra = "" }) {
	return baseButton("button", { label, variant, size, extra, type: "submit" });
}

function baseButton(tag, { href, label, variant, size, extra, type }) {
	const base =
		"inline-flex items-center justify-center font-bold cursor-pointer rounded-md text-center no-underline";

	const variants = {
		primary: "bg-olive text-white",
		secondary: "bg-dusty-blue text-white",
		danger: "bg-charcoal text-white",
	};

	const sizes = {
		sm: "px-4 py-2 text-small",
		md: "px-6 py-4 text-base",
	};

	const el = document.createElement(tag);

	if (tag === "a") el.href = href;
	if (tag === "button" && type) el.type = type;

	el.textContent = label;

	el.className = [base, variants[variant] ?? variants.primary, sizes[size] ?? sizes.md, extra].join(
		" ",
	);

	return el;
}
