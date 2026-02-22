import { SubmitButton } from "./Button.js";

// Share button using the Web Share API
export function ShareButton({ title = "" }) {
	// Create the button using existing button system
	const btn = SubmitButton({
		label: "Share",
		variant: "secondary",
		size: "sm",
	});

	// Create icon
	const icon = document.createElement("img");
	icon.src = "https://cdn.jsdelivr.net/npm/lucide-static/icons/share-2.svg";
	icon.alt = "";
	icon.className = "w-3 h-3";

	// Insert icon before text
	btn.prepend(icon);

	btn.addEventListener("click", async () => {
		const url = window.location.href;

		if (navigator.share) {
			try {
				await navigator.share({
					title: title || document.title,
					url,
				});
				return;
			} catch {
				return;
			}
		}

		try {
			await navigator.clipboard.writeText(url);
			alert("Link copied to clipboard");
		} catch {
			alert("Could not copy link");
		}
	});

	return btn;
}
