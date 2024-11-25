import { createContext, useCallback, useContext, useState } from "react";

const FiltersContext = createContext();

export const useFilters = () => useContext(FiltersContext);
export const FiltersProvider = ({ children }) => {
	// State to manage selected problems filters
	const [filters, setFilters] = useState({
		minRating: 800,
		maxRating: 3500,
		tags: [],
		divisions: [],
		codeforcesHandle: "",
		status: "all", // can be "all", "solved", "attempted", or "new"
	});

	// Function to apply problem filters
	const applyFilters = useCallback(
		({ tags, divisions, minRating, maxRating, codeforcesHandle, status }) => {
			setFilters({
				tags,
				minRating,
				maxRating,
				divisions,
				codeforcesHandle,
				status,
			});
		},
		[]
	);

	const value = { filters, applyFilters };
	return <FiltersContext.Provider value={value}>{children}</FiltersContext.Provider>;
};
