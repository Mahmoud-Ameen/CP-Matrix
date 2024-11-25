import React, { createContext, useCallback, useContext, useEffect, useState, useMemo } from "react";
import { fetchFilteredProblems } from "../../../services/problemsService";
import { useFilters } from "./FiltersContext";

const ProblemsContext = createContext({
	problems: [],
	selectedProblemsIds: [],
	pagination: {
		page: 0,
		totalProblemsCount: 0,
		problemsPerPage: 25,
	},
	isLoading: false,
	error: null,
});

export const ProblemsProvider = React.memo(({ children }) => {
	const [problemsState, setProblemsState] = useState({
		problems: [],
		totalCount: 0,
	});
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);
	const [selectedProblemsIds, setSelectedProblemsIds] = useState([]);

	const { filters } = useFilters();
	const [pagination, setPagination] = useState({
		page: 0,
		totalProblemsCount: 0,
		problemsPerPage: 25,
	});

	const loadProblems = useCallback(
		async ({ page, problemsPerPage }) => {
			setIsLoading(true);
			setError(null);

			try {
				const data = await fetchFilteredProblems(page + 1, problemsPerPage, filters);
				setProblemsState({
					problems: data.problems,
					totalCount: data.totalProblems,
				});

				setPagination((prev) => ({
					...prev,
					page,
					totalProblemsCount: data.totalProblems,
					problemsPerPage,
				}));
			} catch (error) {
				console.error("Error loading problems:", error);
				setError(error.message || "Failed to load problems");
			} finally {
				setIsLoading(false);
			}
		},
		[filters]
	);

	// Initial load and filter changes
	useEffect(() => {
		loadProblems({
			page: pagination.page,
			problemsPerPage: pagination.problemsPerPage,
		});
	}, [filters, loadProblems]); // Re-fetch when filters change

	const paginationActions = useMemo(
		() => ({
			handleChangePage: (_, newPage) => loadProblems({ ...pagination, page: newPage }),
			handleChangeRowsPerPage: (event) =>
				loadProblems({
					page: 0,
					problemsPerPage: parseInt(event.target.value, 10),
				}),
		}),
		[pagination, loadProblems]
	);

	const value = useMemo(
		() => ({
			...problemsState,
			selectedProblemsIds,
			setSelectedProblemsIds,
			pagination,
			isLoading,
			error,
			...paginationActions,
		}),
		[problemsState, selectedProblemsIds, pagination, paginationActions, isLoading, error]
	);

	return <ProblemsContext.Provider value={value}>{children}</ProblemsContext.Provider>;
});

export const useProblems = () => useContext(ProblemsContext);
