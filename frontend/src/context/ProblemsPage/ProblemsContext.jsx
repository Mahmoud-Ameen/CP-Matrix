import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { fetchFilteredProblems } from "../../services/problemsService";
import { useFilters } from "./FiltersContext";

const ProblemsContext = createContext({
	problems: [],
	selectedProblemsIds: [],
	pagination: {
		page: 0,
		totalProblemsCount: 0,
		problemsPerPage: 10,
	},
	setPagination: () => {},
});

export const ProblemsProvider = React.memo(({ children }) => {
	const [problems, setProblems] = useState([]);
	const [selectedProblemsIds, setSelectedProblemsIds] = useState([]);

	const { filters } = useFilters();
	const [pagination, setPagination] = useState({
		page: 0,
		totalProblemsCount: 0,
		problemsPerPage: 10,
	});
	const loadProblems = async ({ page, problemsPerPage }) => {
		try {
			// Adding one to page because it expects one-based page
			const data = await fetchFilteredProblems(page + 1, problemsPerPage, filters);

			setProblems(data.problems);

			setPagination((pagination) => ({
				...pagination,
				page,
				problemsPerPage,
				totalProblemsCount: data.totalProblems,
			}));
		} catch (error) {
			console.error("Error loading problems:", error);
		}
	};

	useEffect(() => {
		loadProblems({ ...pagination, page: 0 });
	}, [filters]);

	// Change current pagination page
	const handleChangePage = useCallback((event, newPage) => {
		loadProblems({ ...pagination, page: newPage });
	});

	// Change number of problems shown per page
	const handleChangeRowsPerPage = useCallback((event) => {
		loadProblems({ ...pagination, page: 0, problemsPerPage: event.target.value });
	});

	const value = {
		problems,
		selectedProblemsIds,
		setSelectedProblemsIds,

		pagination,
		setPagination,

		handleChangePage,
		handleChangeRowsPerPage,
	};

	return <ProblemsContext.Provider value={value}>{children}</ProblemsContext.Provider>;
});

export const useProblems = () => useContext(ProblemsContext);
