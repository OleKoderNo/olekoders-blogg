export function makeExcerpt(text = "", max = 90) {
	const s = String(text).trim();
	if (s.length <= max) return s;
	return s.slice(0, max).trim() + "...";
}
