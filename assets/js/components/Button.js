// Link styled as a button with a element. Used for navigation actions
export function LinkButton({ href, label, variant = "primary", size = "md", extra = "" }) {
	return baseButton("a", { href, label, variant, size, extra });
}

// Button element used for submissions
export function SubmitButton({ label, variant = "primary", size = "md", extra = "" }) {
	return baseButton("button", { label, variant, size, extra, type: "submit" });
}
// Shared stylings for buttons made with a element and button element
function baseButton(tag, { href, label, variant, size, extra, type, icon }) {
	// Base button style
	const base =
		"inline-flex items-center justify-center gap-2 font-bold cursor-pointer border border-charcoal rounded-md text-center no-underline";

	// Color variants
	const variants = {
		primary: "bg-olive text-white",
		secondary: "bg-dusty-blue text-white",
		danger: "bg-charcoal text-white",
	};

	// Size variants
	const sizes = {
		sm: "px-4 py-2 text-small",
		md: "px-6 py-4 text-base",
	};

	// Create the element
	const el = document.createElement(tag);

	// Apply element attributes
	if (tag === "a") el.href = href;
	if (tag === "button" && type) el.type = type;

	// Optional icon
	if (icon) el.append(icon);

	// Button label
	el.append(label);

	// Combine all classes
	el.className = [base, variants[variant] ?? variants.primary, sizes[size] ?? sizes.md, extra].join(
		" ",
	);

	return el;
}
