import { createContext, useCallback, useContext, useState } from "react";

const FiltersContext = createContext();

export const useFilters = () => useContext(FiltersContext);
export const FiltersProvider = ({ children }) => {
	// State to manage selected problems filters
	const [filters, setFilters] = useState({
		minRating: 800,
		maxRating: 3500,
		tags: [],
		divisions: {},
	});

	// Function to apply filters from the sidebar
	// accepts divisions in the form of ["div<X>:<Index>"]
	// for example ["div4:A","div1:C", ...]
	const applyFilters = useCallback(({ tags, divisions, minRating, maxRating }) => {
		const formattedDivisions = {};
		divisions.forEach((div) => {
			const division = div.slice(0, div.indexOf(":"));
			const index = div.slice(div.indexOf(":" + 1));

			if (!Object.hasOwn(formattedDivisions, division)) formattedDivisions[division] = [];
			formattedDivisions[division].push(index);
		});

		setFilters({
			tags,
			minRating,
			maxRating,
			divisions: formattedDivisions,
		});
	}, []);

	const value = { filters, applyFilters };
	return <FiltersContext.Provider value={value}>{children}</FiltersContext.Provider>;
};
