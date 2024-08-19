import axios from "axios";

// Base URL for the API
const API_BASE_URL = "http://localhost:3000/api";

/**
 * Fetches problems from the API with pagination and optional filters.
 *
 * @param {number} page - The current page number (one-based).
 * @param {number} rowsPerPage - The number of problems to fetch per page.
 * @param {object} filters - An object containing filters to apply (e.g., tags, divisions, etc.).
 *
 * @returns {Promise<object>} - A promise that resolves to the fetched data, including problems, total page count
 * 	and total problem count.
 */
export const fetchProblems = async (page, rowsPerPage, filters) => {
	// Initialize URLSearchParams for query parameters
	const params = new URLSearchParams();

	// Pagination parameters
	params.append("page", page);
	params.append("limit", rowsPerPage);

	// Add filters to the query parameters
	for (const filter in filters)
		if (Object.prototype.hasOwnProperty.call(filters, filter))
			params.append(filter, JSON.stringify(filters[filter]));

	try {
		// Send GET request to fetch problems with query parameters
		const response = await axios.get(`${API_BASE_URL}/problems`, { params });
		return response.data;
	} catch (error) {
		console.error("Error fetching problems:", error);
		throw error; // Re-throw error to handle it further up the chain
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
		const res = await axios.get(`${API_BASE_URL}/problems/tags`);
		return res.data; // Return the list of tags received from the API
	} catch (error) {
		console.error("Error fetching tags:", error); // Log error in case of failure
	}
};
