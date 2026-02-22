import { login, createApiKey } from "../../assets/api/user.js";
import { saveAuthSession } from "../../assets/api/session.js";
import { getRepoBase } from "../../assets/js/utils/repoBase.js";

function isNoroffStudentEmail(email) {
	return String(email).trim().toLowerCase().endsWith("@stud.noroff.no");
}

window.addEventListener("DOMContentLoaded", () => {
	const base = getRepoBase();

	const form = document.getElementById("login-form");
	const emailEl = document.getElementById("email");
	const passwordEl = document.getElementById("password");

	form.addEventListener("submit", async (e) => {
		e.preventDefault();

		const email = emailEl.value.trim();
		const password = passwordEl.value;

		if (!isNoroffStudentEmail(email)) {
			alert("Email must end with @stud.noroff.no");
			return;
		}

		try {
			const loginRes = await login({ email, password });
			const { accessToken } = loginRes.data;

			localStorage.setItem("accessToken", accessToken);

			const keyRes = await createApiKey();
			const apiKey = keyRes.data.key;

			saveAuthSession({ accessToken }, apiKey);

			window.location.assign(`${base}index.html`);
		} catch (err) {
			alert(err.message);
		}
	});
});
