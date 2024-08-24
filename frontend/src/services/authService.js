import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const login = async (token) => {
	try {
		const res = await axios.post(
			`${API_BASE_URL}/users/login`,
			{},
			{
				headers: { Authorization: `Bearer ${token}` },
			}
		);
		return res;
	} catch (error) {
		console.error("error logging in", error);
		throw error;
	}
};
