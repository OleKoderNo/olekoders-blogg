import { SubmitButton } from "/assets/js/components/Button.js";

const mount = document.querySelector("#login-button");
const form = document.querySelector("#login-form");

mount.innerHTML = ""; // ensure clean mount (safe)
mount.appendChild(
	SubmitButton({
		label: "Log in",
		variant: "primary",
		size: "md",
		extra: "w-full max-w-sm",
	}),
);

form.addEventListener("submit", (e) => {
	e.preventDefault();
	alert("✅ Login submitted!");
});
