import { login, createApiKey } from "../../assets/api/user.js";
import { saveAuthSession } from "../../assets/api/session.js";
import { getRepoBase } from "../../assets/js/utils/repoBase.js";

// Validate Noroff student email
function isNoroffStudentEmail(email) {
	return String(email).trim().toLowerCase().endsWith("@stud.noroff.no");
}

window.addEventListener("DOMContentLoaded", () => {
	// Base path for redirects after login
	const base = getRepoBase();

	// Cache form elements
	const form = document.getElementById("login-form");
	const emailEl = document.getElementById("email");
	const passwordEl = document.getElementById("password");

	// Handle login submit
	form.addEventListener("submit", async (e) => {
		e.preventDefault();

		// Read input values
		const email = emailEl.value.trim(); // trim() removes whitespace in case of accidental space presses
		const password = passwordEl.value;

		// Enforce Noroff student email
		if (!isNoroffStudentEmail(email)) {
			alert("Email must end with @stud.noroff.no");
			return;
		}

		// Perform login request
		try {
			const loginRes = await login({ email, password });
			const { accessToken } = loginRes.data;

			// Store access token
			localStorage.setItem("accessToken", accessToken);

			// Create API key for Noroff API
			const keyRes = await createApiKey();
			const apiKey = keyRes.data.key;

			// Persist full auth session
			saveAuthSession({ accessToken }, apiKey);

			// Redirect to landing page after successful login
			window.location.assign(`${base}index.html`);
		} catch (err) {
			// Show API or network error
			alert(err.message);
		}
	});
});
