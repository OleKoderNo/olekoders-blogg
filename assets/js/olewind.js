// OleWind - CSS that is simplified with inspiration of TailwindCSS

// Media queries for OleWind
const BREAKPOINTS = {
	md: 768,
	lg: 1024,
	xl: 1280,
};

const GROUPS = {
	bg: /^bg-/,
	text: /^text-/,
	width: /^w-/,
	maxWidth: /^max-w-/,
	minHeight: /^min-h-/,
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

function parseOw(value) {
	return (value || "")
		.trim()
		.split(/\s+/)
		.filter(Boolean)
		.map((token) => {
			const [bp, cls] = token.includes(":") ? token.split(":") : [null, token];
			return { bp, cls };
		});
}

function removeConflicts(el, cls) {
	//removes existing classes in the same group from the element
	for (const regex of Object.values(GROUPS)) {
		if (!regex.test(cls)) continue;

		const existing = Array.from(el.classList);
		for (const c of existing) {
			if (regex.test(c)) el.classList.remove(c);
		}
		break;
	}
}

function classStringToSet(str) {
	return new Set((str || "").split(/\s+/).filter(Boolean));
}

function setToClassString(set) {
	return Array.from(set).join(" ");
}

function applyOleWind() {
	const width = window.innerWidth;

	document.querySelectorAll("[ow]").forEach((el) => {
		const prev = el.dataset.owApplied;

		if (!el.dataset.owBase) {
			el.dataset.owBase = el.className || "";
		}

		const baseSet = classStringToSet(el.dataset.owBase);
		el.className = setToClassString(baseSet);

		const rules = parseOw(el.getAttribute("ow"));

		for (const { bp, cls } of rules) {
			if (!cls) continue;

			if (bp) {
				const min = BREAKPOINTS[bp];
				if (min === null) continue;
				if (width < min) continue;
			}

			removeConflicts(el, cls);

			el.classList.add(cls);
		}
	});
}

// Run on load
window.addEventListener("DOMContentLoaded", applyOleWind);

// Debounce for optimizing
let t;
window.addEventListener("resize", () => {
	clearTimeout(t);
	t = setTimeout(applyOleWind, 50);
});
