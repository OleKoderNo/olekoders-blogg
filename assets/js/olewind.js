// OleWind - CSS that is simplified with inspiration of TailwindCSS

// -------------------------------------
// Breakpoints (min screen width)
// -------------------------------------
const BREAKPOINTS = {
	md: 768,
	lg: 1024,
	xl: 1280,
};

// -------------------------------------
// Class groups used to remove conflicts
// -------------------------------------
const GROUPS = {
	bg: /^bg-/,
	text: /^text-/,
	width: /^w-/,
	maxWidth: /^max-w-/,
	minHeight: /^min-h-/,
	height: /^h-/,
	maxHeight: /^max-h-/,
	overflow: /^overflow-/,
	object: /^object-/,
	z: /^z-/,
	radius: /^rounded-/,
	display: /^(flex|inline-flex|block|inline-block|hidden)$/,
	flexDir: /^flex-(row|col)$/,
	flexWrap: /^flex-(wrap|nowrap)$/,
	justify: /^justify-/,
	items: /^items-/,
	gap: /^gap-/,
	p: /^p-\d+$/,
	px: /^px-\d+$/,
	py: /^py-\d+$/,
	pt: /^pt-\d+$/,
	pr: /^pr-\d+$/,
	pb: /^pb-\d+$/,
	pl: /^pl-\d+$/,
	m: /^m-\d+$/,
	mx: /^mx-\d+$/,
	my: /^my-\d+$/,
	mt: /^mt-\d+$/,
	mr: /^mr-\d+$/,
	mb: /^mb-\d+$/,
	ml: /^ml-\d+$/,
	position: /^(relative|absolute)$/,
	top: /^top-/,
	left: /^left-/,
	right: /^right-/,
	translate: /^translate-/,
};

// -------------------------------------
// Supported state variants
// -------------------------------------
const STATES = new Set(["hover"]);

// -------------------------------------
// Parse ow="md:hover:bg-olive"
// -------------------------------------
function parseOw(value) {
	return (value || "")
		.trim()
		.split(/\s+/)
		.filter(Boolean)
		.map((token) => {
			const parts = token.split(":");
			const cls = parts.pop();
			const prefixes = parts;

			const bp = prefixes.find((p) => p in BREAKPOINTS) || null;
			const state = prefixes.find((p) => STATES.has(p)) || null;

			return { bp, state, cls };
		});
}

// -------------------------------------
// Remove conflicting classes from element
// -------------------------------------
function removeConflictsWithinElement(el, cls) {
	for (const regex of Object.values(GROUPS)) {
		if (!regex.test(cls)) continue;

		for (const c of Array.from(el.classList)) {
			if (regex.test(c)) el.classList.remove(c);
		}
		break;
	}
}

// -------------------------------------
// Remove conflicting classes from a Set
// -------------------------------------
function removeConflictsWithinSet(set, cls) {
	for (const regex of Object.values(GROUPS)) {
		if (!regex.test(cls)) continue;

		for (const c of Array.from(set)) {
			if (regex.test(c)) set.delete(c);
		}
		break;
	}
}

// -------------------------------------
// Helpers to store applied classes
// -------------------------------------
function getAppliedSet(el, key) {
	const raw = el.dataset[`owApplied${key}`] || "";
	return new Set(raw.split(/\s+/).filter(Boolean));
}

function setAppliedSet(el, key, set) {
	el.dataset[`owApplied${key}`] = Array.from(set).join(" ");
}

// -------------------------------------
// Apply base (non-hover) classes
// -------------------------------------
function applyBaseOleWind(el, width) {
	if (!el.dataset.owBase) el.dataset.owBase = el.className || "";
	el.className = el.dataset.owBase;

	const rules = parseOw(el.getAttribute("ow"));
	const baseApplied = new Set();

	for (const { bp, state, cls } of rules) {
		if (!cls || state) continue;
		if (bp && width < BREAKPOINTS[bp]) continue;

		removeConflictsWithinElement(el, cls);
		el.classList.add(cls);

		baseApplied.add(cls);
	}

	setAppliedSet(el, "Base", baseApplied);
}

// -------------------------------------
// Apply hover classes
// -------------------------------------
function applyHover(el) {
	const width = window.innerWidth;

	// Always start from base
	applyBaseOleWind(el, width);

	const rules = parseOw(el.getAttribute("ow"));
	const hoverApplied = new Set();

	for (const { bp, state, cls } of rules) {
		if (state !== "hover") continue;
		if (bp && width < BREAKPOINTS[bp]) continue;

		removeConflictsWithinElement(el, cls);
		removeConflictsWithinSet(hoverApplied, cls);

		el.classList.add(cls);
		hoverApplied.add(cls);
	}

	setAppliedSet(el, "Hover", hoverApplied);
}

// -------------------------------------
// Remove hover classes
// -------------------------------------
function clearHover(el) {
	const hover = getAppliedSet(el, "Hover");

	for (const cls of hover) {
		el.classList.remove(cls);
	}

	setAppliedSet(el, "Hover", new Set());

	applyBaseOleWind(el, window.innerWidth);
}

// -------------------------------------
// Bind hover listeners once
// -------------------------------------
function ensureHover(el) {
	if (el.dataset.owHoverBound === "1") return;
	el.dataset.owHoverBound = "1";

	el.addEventListener("mouseenter", () => applyHover(el));
	el.addEventListener("mouseleave", () => clearHover(el));
}

// -------------------------------------
// Main runner
// -------------------------------------
function applyOleWind() {
	const width = window.innerWidth;

	document.querySelectorAll("[ow]").forEach((el) => {
		applyBaseOleWind(el, width);
		ensureHover(el);
	});
}

// -------------------------------------
// Run on load
// -------------------------------------
window.addEventListener("DOMContentLoaded", applyOleWind);

// -------------------------------------
// Re-apply on resize (debounced)
// -------------------------------------
let t;
window.addEventListener("resize", () => {
	clearTimeout(t);
	t = setTimeout(() => {
		const width = window.innerWidth;

		document.querySelectorAll("[ow]").forEach((el) => {
			el.matches(":hover") ? applyHover(el) : applyBaseOleWind(el, width);
		});
	}, 50);
});
