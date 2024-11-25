import axios from "axios";

// Base URL for the API
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Fetches problems from the API with pagination and optional filters.
 *
 * @param {number} page - The current page number (one-based).
 * @param {number} rowsPerPage - The number of problems to fetch per page.
 * @param {object} filters - An object containing filters to apply (e.g., tags, divisions, etc.).
 *
 * @returns {Promise<object>} - A promise that resolves to the fetched data, including problems and pagination info.
 */
export const fetchFilteredProblems = async (page, rowsPerPage, filters) => {
	// Initialize URLSearchParams for query parameters
	const params = new URLSearchParams();

	// Pagination parameters
	params.append("page", page);
	params.append("limit", rowsPerPage);

	// Add filters to the query parameters
	for (const filter in filters) {
		if (Array.isArray(filters[filter])) params.append(filter, filters[filter].join(","));
		else if (filters[filter] !== null) params.append(filter, filters[filter]);
	}

	try {
		// Send GET request to fetch problems with query parameters
		const response = await axios.get(`${API_BASE_URL}/problems`, { params });

		return {
			problems: response.data.data.problems,
			totalProblems: response.data.meta.total,
			currentPage: response.data.meta.page,
			pageSize: response.data.meta.limit,
		};
	} catch (error) {
		if (error.response?.data?.error) {
			throw new Error(error.response.data.error.message);
		}
		throw error;
	}
};

/**
 * Fetches all available problem tags from the API.
 *
 * @returns {Promise<Array<string>>} - A promise that resolves to an array of tags.
 */
export const fetchTags = async () => {
	try {
		// Send GET request to fetch tags
		const response = await axios.get(`${API_BASE_URL}/problems/tags`);
		return response.data.data.tags; // Return the list of tags received from the API
	} catch (error) {
		if (error.response?.data?.error) {
			throw new Error(error.response.data.error.message);
		}
		throw error;
	}
};

/**
 * Synchronizes user's problem status with Codeforces.
 *
 * @param {string} codeforcesHandle - The user's Codeforces handle.
 * @returns {Promise<string>} - A promise that resolves to a success message.
 */
export const syncUserProblems = async (codeforcesHandle) => {
	try {
		const response = await axios.post(`${API_BASE_URL}/userproblemstatus/sync`, null, {
			params: { codeforcesHandle },
		});
		return response.data.data.message;
	} catch (error) {
		if (error.response?.data?.error) {
			throw new Error(error.response.data.error.message);
		}
		throw error;
	}
};
