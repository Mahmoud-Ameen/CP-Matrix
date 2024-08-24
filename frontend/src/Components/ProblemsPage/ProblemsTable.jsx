// React Imports
import React, { useCallback, useEffect, useState } from "react";

// Material UI imports
import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	Chip,
	TablePagination,
	Link,
	IconButton,
	Checkbox,
} from "@mui/material";

import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";

import { getRatingColor } from "../../utils/getRatingColor";

import { useProblems } from "../../context/ProblemsPage/ProblemsContext";
import ProblemsTablePagination from "./ProblemsTablePagination";

const ProblemsTable = () => {
	// State to manage which columns to show and which to hide
	const [visibleColumns, setVisibleColumns] = useState({
		name: true,
		tags: true,
		rating: true,
		division: true,
	});

	const { problems, selectedProblemsIds, setSelectedProblemsIds, loadProblems } = useProblems();

	// Function to toggle a column's visibility
	const toggleColumn = useCallback((column) => {
		setVisibleColumns((prev) => ({
			...prev,
			[column]: !prev[column],
		}));
	});

	// Handle selecting/deselecting a problem
	const handleSelectProblem = useCallback((problem) => {
		if (selectedProblemsIds.includes(problem.problemId))
			setSelectedProblemsIds(selectedProblemsIds.filter((p) => p !== problem.problemId));
		else setSelectedProblemsIds([...selectedProblemsIds, problem.problemId]);
	});

	// Handle "Select All" checkbox
	const handleSelectAll = useCallback((event) => {
		if (event.target.checked) {
			const allProblemsIdsOnPage = problems.map((problem) => problem.problemId);
			setSelectedProblemsIds([
				...selectedProblemsIds,
				...allProblemsIdsOnPage.filter((id) => !selectedProblemsIds.includes(id)),
			]);
		} else {
			const allProblemsIdsOnPage = problems.map((problem) => problem.problemId);
			setSelectedProblemsIds(
				selectedProblemsIds.filter((id) => !allProblemsIdsOnPage.includes(id))
			);
		}
	});

	// Check if all problems are selected
	const isAllSelected =
		problems.length > 0 &&
		problems.every((problem) => selectedProblemsIds.includes(problem.problemId));

	return (
		<Paper>
			<TableContainer>
				<Table sx={{ borderCollapse: "separate", borderSpacing: 0, borderColor: "red" }}>
					{/* -----------<<<< Table Header >>>>----------- */}
					<TableHead>
						<TableRow>
							{/* Select All Checkbox */}
							<TableCell
								padding="checkbox"
								sx={{
									borderBottom: "2px solid",
									borderTop: "2px solid",
									borderColor: "primary.main",
								}}>
								<Checkbox
									indeterminate={selectedProblemsIds.length > 0 && !isAllSelected}
									checked={isAllSelected}
									onChange={handleSelectAll}
								/>
							</TableCell>

							<TableCell
								sx={{
									borderBottom: "2px solid",
									borderTop: "2px solid",
									borderColor: "primary.main",
								}}>
								Name
							</TableCell>

							<TableCell
								sx={{
									borderBottom: "2px solid",
									borderTop: "2px solid",
									borderColor: "primary.main",
								}}>
								Tags
								<IconButton
									size="small"
									onClick={() => toggleColumn("tags")}
									sx={{ color: "text.secondary", mx: 2 }}>
									{visibleColumns.tags ? (
										<VisibilityOffIcon />
									) : (
										<VisibilityIcon />
									)}
								</IconButton>
							</TableCell>

							<TableCell
								sx={{
									borderBottom: "2px solid",
									borderTop: "2px solid",
									borderColor: "primary.main",
									minWidth: 150,
								}}>
								Rating
								<IconButton
									size="small"
									onClick={() => toggleColumn("rating")}
									sx={{ color: "text.secondary", mx: 2 }}>
									{visibleColumns.rating ? (
										<VisibilityOffIcon />
									) : (
										<VisibilityIcon />
									)}
								</IconButton>
							</TableCell>

							<TableCell
								sx={{
									borderBottom: "2px solid",
									borderTop: "2px solid",
									borderColor: "primary.main",
									minWidth: 150,
								}}>
								Division
								<IconButton
									size="small"
									onClick={() => toggleColumn("division")}
									sx={{ color: "text.secondary", mx: 2 }}>
									{visibleColumns.division ? (
										<VisibilityOffIcon />
									) : (
										<VisibilityIcon />
									)}
								</IconButton>
							</TableCell>
						</TableRow>
					</TableHead>
					{/* -----------<<<< Table Body >>>>----------- */}
					<TableBody>
						{problems.map((problem) => (
							<TableRow
								sx={{ outline: 0, borderColor: "transpant" }}
								key={problem.contestId + problem.index}>
								{/* -----------<<<< Problem Checkbox >>>>----------- */}
								<TableCell padding="checkbox">
									<Checkbox
										checked={selectedProblemsIds.includes(problem.problemId)}
										onChange={() => handleSelectProblem(problem)}
									/>
								</TableCell>
								{/* -----------<<<< Problem Name >>>>----------- */}
								<TableCell>
									<Link
										href={`https://codeforces.com/contest/${problem.contestId}/problem/${problem.index}`}
										target="_blank"
										underline="hover"
										color="text.primary"
										sx={{ fontSize: "1.1rem" }}>
										{problem.name}
									</Link>
								</TableCell>
								{/* -----------<<<< Problem Tags >>>>----------- */}
								<TableCell sx={{}}>
									{problem.tags.map((tag) => (
										<Chip
											variant="outlined"
											key={problem.contestId + problem.index + tag}
											label={tag}
											color="primary"
											sx={{
												m: 0.5,
												borderColor: visibleColumns.tags
													? "primary"
													: "transparent",
												color: visibleColumns.tags ? "" : "transparent",
												userSelect: "none",
												MozUserSelect: "none",
												WebkitUserSelect: "none",
											}}
										/>
									))}
								</TableCell>
								{/* -----------<<<< Problem Rating >>>>----------- */}
								<TableCell>
									<Chip
										label={problem.rating || "N/A"}
										sx={{
											backgroundColor: !visibleColumns.rating
												? "transparent"
												: getRatingColor(problem.rating),

											color: visibleColumns.rating
												? "text.primary"
												: "transparent",

											userSelect: "none",
											MozUserSelect: "none",
											WebkitUserSelect: "none",
										}}
									/>
								</TableCell>
								{/* -----------<<<< Problem Division >>>>----------- */}
								<TableCell>
									<Chip
										label={
											problem.division
												? problem.division + "" + problem.index
												: "N/A"
										}
										sx={{
											color: visibleColumns.division
												? "text.light"
												: "transparent",
											backgroundColor: visibleColumns.division
												? "background.light"
												: "transparent",
										}}
									/>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
			{/* -----------<<<< Pagination >>>>----------- */}
			<ProblemsTablePagination />
		</Paper>
	);
};

export default React.memo(ProblemsTable);
