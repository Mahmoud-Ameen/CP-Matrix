// React imports
import React, { useState, useEffect } from "react";

// Material UI imports
import { Box, Container, Button, Typography, Stack, Chip } from "@mui/material";

// App components imports
import Sidebar from "../Components/Sidebar";
import ProblemsTable from "../Components/ProblemsPage/ProblemsTable";
import HeaderText from "../Components/ProblemsPage/HeaderText";

// App services imports
import { fetchProblems } from "../services/problemsService";

const ProblemsPage = () => {
	// State for storing problems, and pagination data
	const [problems, setProblems] = useState([]);
	const [totalProblems, setTotalProblems] = useState(0);
	const [totalPages, setTotalPages] = useState(0);
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);

	// State for storing applied problems' filters
	const [filters, setFilters] = useState({
		minRating: 800,
		maxRating: 3500,
		tags: [],
		divisions: {},
	});

	// State for managing opening and closing of the sidebar
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);

	// Effect hook to fetch problems whenever the page, rows per page, or filters change
	useEffect(() => {
		const loadProblems = async () => {
			try {
				// Adding one to page because it expects one-based page
				const data = await fetchProblems(page + 1, rowsPerPage, filters);

				setProblems(data.problems);
				setTotalPages(data.totalPages);
				setTotalProblems(data.totalProblems);
			} catch (error) {
				console.error("Error loading problems:", error);
			}
		};

		loadProblems();
	}, [page, rowsPerPage, filters]);

	// Function to apply filters from the sidebar
	const applyFilters = ({ tags, divisions, minRating, maxRating }) => {
		// Format divisions into an object with division as keys and indexes as values
		const formattedDivisions = {};
		divisions.forEach((div) => {
			const division = div.slice(0, div.indexOf(":"));
			const index = div.slice(div.indexOf(":" + 1));

			if (!Object.hasOwn(formattedDivisions, division)) formattedDivisions[division] = [];
			formattedDivisions[division].push(index);
		});

		// Set the filters state with the formatted filters
		setFilters({
			tags,
			minRating,
			maxRating,
			divisions: formattedDivisions,
		});
		setPage(0);
	};

	const { tags, minRating, maxRating, divisions } = filters;
	return (
		<Box sx={{ backgroundColor: "background.default", minHeight: "100vh", py: 5 }}>
			{/* Sidebar component for filtering problems */}
			<Sidebar
				open={isSidebarOpen}
				onClose={() => setIsSidebarOpen(false)}
				applyFilters={applyFilters}
			/>

			<Container style={{ flex: 1 }}>
				{/* Page Header */}

				<Box
					sx={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
					}}>
					{/* Header Text */}
					<HeaderText
						tags={tags}
						minRating={minRating}
						maxRating={maxRating}
						divisions={divisions}
					/>

					{/* Button to toggle sidebar visibility */}
					<Button
						onClick={() => setIsSidebarOpen(!isSidebarOpen)}
						variant="outlined"
						sx={{ m: 2 }}>
						Filters
					</Button>
				</Box>

				{/* Problems table */}
				<ProblemsTable
					problems={problems}
					rowsPerPage={rowsPerPage}
					totalProblems={totalProblems}
					page={page}
					setPage={setPage}
					setRowsPerPage={setRowsPerPage}
				/>
			</Container>
		</Box>
	);
};

export default ProblemsPage;
