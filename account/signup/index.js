import { register, login, createApiKey } from "../../assets/api/user.js";
import { saveAuthSession } from "../../assets/api/session.js";
import { getRepoBase } from "../../assets/js/utils/repoBase.js";

// validate if its student noroff email
function isNoroffStudentEmail(email) {
	return String(email).trim().toLowerCase().endsWith("@stud.noroff.no");
}

window.addEventListener("DOMContentLoaded", () => {
	// Base path for redirect after successful signup
	const base = getRepoBase();

	// Cache form elements
	const form = document.getElementById("signup-form");
	const nameEl = document.getElementById("name");
	const emailEl = document.getElementById("email");
	const pw1El = document.getElementById("password");
	const pw2El = document.getElementById("password2");

	// Handle signup submit
	form.addEventListener("submit", async (e) => {
		e.preventDefault();

		// Read input values
		const name = nameEl.value.trim();
		const email = emailEl.value.trim();
		const password = pw1El.value;
		const password2 = pw2El.value;

		// Validation
		if (!name) {
			alert("Please enter your name");
			return;
		}

		// Gives alert if it's not noroff student email
		if (!isNoroffStudentEmail(email)) {
			alert("Email must end with @stud.noroff.no");
			return;
		}

		// alerts if the password is not at least 8 characters long
		if (password.length < 8) {
			alert("Password must be at least 8 characters");
			return;
		}

		// alerts if password dont match
		if (password !== password2) {
			alert("Passwords do not match");
			return;
		}

		try {
			// Register user
			await register({ name, email, password });

			// Login after register
			const loginRes = await login({ email, password });
			const { accessToken } = loginRes.data;

			// Store token
			localStorage.setItem("accessToken", accessToken);

			// Create API key
			const keyRes = await createApiKey();
			const apiKey = keyRes.data.key;

			// Save session
			saveAuthSession({ accessToken }, apiKey);

			// Redirect to landing page
			window.location.href = `${base}index.html`;
		} catch (err) {
			alert(err.message);
		}
	});
});
