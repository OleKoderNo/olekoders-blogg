import { getById, getAllPost } from "../../api/post.js";
import { slugify } from "./slug.js";

export async function findPost({ id, slug }) {
	if (id) {
		const res = await getById(id);
		return res.data ?? null;
	}

	if (slug) {
		const res = await getAllPost();
		const posts = res.data || [];
		return posts.find((p) => slugify(p.title) === slug) || null;
	}

	return null;
}
