import "axios";

// Base URL for the API
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
export const syncAccount = async (codeforcesHandle) => {
	try {
		const response = await fetch(
			`${API_BASE_URL}/userproblemstatus/sync?codeforcesHandle=${encodeURIComponent(
				codeforcesHandle
			)}`,
			{
				method: "POST",
			}
		);

		if (!response.ok) {
			throw new Error("Failed to sync with Codeforces");
		}
		return response;
	} catch (err) {
		throw new Error("Failed to sync with Codeforces");
	}
};
