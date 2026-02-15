import { LinkButton } from "./components/Button.js";

function mount(id, btn) {
	const el = document.getElementById(id);
	if (!el) return;
	el.innerHTML = "";
	el.appendChild(btn);
}

// Featured button (centered)
mount(
	"featured-btn",
	LinkButton({
		href: "#featured",
		label: "Read featured",
		variant: "primary",
		size: "md",
	}),
);

// Card buttons
mount(
	"post-btn-1",
	LinkButton({
		href: "#post-1",
		label: "Read more",
		variant: "secondary",
		size: "sm",
	}),
);

mount(
	"post-btn-2",
	LinkButton({
		href: "#post-2",
		label: "Read more",
		variant: "secondary",
		size: "sm",
	}),
);

mount(
	"post-btn-3",
	LinkButton({
		href: "#post-3",
		label: "Read more",
		variant: "secondary",
		size: "sm",
	}),
);
