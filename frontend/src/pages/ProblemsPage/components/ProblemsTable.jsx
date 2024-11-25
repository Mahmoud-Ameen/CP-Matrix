// React Imports
import React, { useCallback, useEffect, useState, memo } from "react";

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
	Link,
	IconButton,
	Checkbox,
	useTheme,
	alpha,
	Box,
	Skeleton,
} from "@mui/material";

import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import NewReleasesIcon from "@mui/icons-material/NewReleases";

import { getRatingColor } from "../../../utils/getRatingColor";

import { useProblems } from "../contexts/ProblemsContext";
import ProblemsTablePagination from "./ProblemsTablePagination";

// Table columns configuration
const TABLE_COLUMNS = [
	{
		id: "name",
		label: "Problem",
		toggleable: false,
	},
	{
		id: "tags",
		label: "Tags",
		toggleable: true,
	},
	{
		id: "rating",
		label: "Rating",
		toggleable: true,
	},
	{
		id: "division",
		label: "Division",
		toggleable: true,
	},
];

// Status styles configuration
const STATUS_STYLES = {
	solved: (theme) => ({
		backgroundColor: alpha(theme.palette.success.main, 0.08),
		"&:hover": {
			backgroundColor: alpha(theme.palette.success.main, 0.12),
		},
	}),
	attempted: (theme) => ({
		backgroundColor: alpha(theme.palette.warning.main, 0.03),
		"&:hover": {
			backgroundColor: alpha(theme.palette.warning.main, 0.06),
		},
	}),
	new: (theme) => ({
		backgroundColor: "transparent",
		transition: "background-color 0.2s ease",
		"&:hover": {
			backgroundColor: theme.palette.action.hover,
		},
	}),
};

// TableSkeleton component
const TableSkeleton = memo(() => {
	return Array.from({ length: 10 }).map((_, index) => (
		<TableRow key={index}>
			<TableCell padding="checkbox" sx={{ pl: 3 }}>
				<Skeleton variant="rectangular" width={20} height={20} />
			</TableCell>
			<TableCell>
				<Skeleton variant="text" width={200} />
			</TableCell>
			<TableCell>
				<Box sx={{ display: "flex", gap: 0.5 }}>
					<Skeleton variant="rectangular" width={60} height={24} />
					<Skeleton variant="rectangular" width={60} height={24} />
				</Box>
			</TableCell>
			<TableCell>
				<Skeleton variant="rectangular" width={60} height={24} />
			</TableCell>
			<TableCell>
				<Skeleton variant="rectangular" width={60} height={24} />
			</TableCell>
		</TableRow>
	));
});

// Get status icon for a problem
const StatusIcon = ({ status, theme }) => {
	if (!status) return null;

	switch (status) {
		case "solved":
			return (
				<CheckCircleIcon
					sx={{ color: theme.palette.success.main, ml: 1 }}
					fontSize="small"
				/>
			);
		case "attempted":
			return <ErrorIcon sx={{ color: theme.palette.warning.main, ml: 1 }} fontSize="small" />;
		default:
			return null;
	}
};

const ProblemsTable = () => {
	const theme = useTheme();

	// State to manage which columns to show and which to hide
	const [visibleColumns, setVisibleColumns] = useState({
		name: true,
		tags: true,
		rating: true,
		division: true,
	});

	const { problems, selectedProblemsIds, setSelectedProblemsIds, isLoading } = useProblems();

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
		<Paper
			elevation={0}
			sx={{
				borderRadius: 3,
				border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
				overflow: "hidden",
			}}>
			<TableContainer sx={{ minHeight: 650 }}>
				<Table>
					{/* Header - Always show header */}
					<TableHead>
						<TableRow>
							<TableCell padding="checkbox" sx={{ pl: 3 }}>
								<Checkbox
									indeterminate={selectedProblemsIds.length > 0 && !isAllSelected}
									checked={isAllSelected}
									onChange={handleSelectAll}
									disabled={isLoading}
									sx={{
										color: theme.palette.primary.main,
										"&.Mui-checked": {
											color: theme.palette.primary.main,
										},
									}}
								/>
							</TableCell>

							{/* Column Headers */}
							{TABLE_COLUMNS.map((column) => (
								<TableCell
									key={column.id}
									sx={{
										fontWeight: 600,
										color: "text.primary",
										fontSize: "0.875rem",
										letterSpacing: "0.01em",
										whiteSpace: "nowrap",
									}}>
									<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
										{column.label}
										{column.toggleable && (
											<IconButton
												size="small"
												onClick={() => toggleColumn(column.id)}
												sx={{
													color: visibleColumns[column.id]
														? "primary.main"
														: "text.secondary",
													"&:hover": {
														backgroundColor: alpha(
															theme.palette.primary.main,
															0.08
														),
													},
												}}>
												{visibleColumns[column.id] ? (
													<VisibilityIcon fontSize="small" />
												) : (
													<VisibilityOffIcon fontSize="small" />
												)}
											</IconButton>
										)}
									</Box>
								</TableCell>
							))}
						</TableRow>
					</TableHead>

					{/* Body */}
					<TableBody>
						{isLoading ? (
							<TableSkeleton />
						) : (
							problems.map((problem) => (
								<TableRow
									key={problem.problemId}
									sx={{
										transition: "all 0.2s ease",
										"&:hover": {
											backgroundColor: alpha(
												theme.palette.primary.main,
												0.04
											),
										},
										...(problem.status && STATUS_STYLES[problem.status](theme)),
									}}>
									{/* Checkbox */}
									<TableCell padding="checkbox" sx={{ pl: 3 }}>
										<Checkbox
											checked={selectedProblemsIds.includes(
												problem.problemId
											)}
											onChange={() => handleSelectProblem(problem)}
											sx={{
												color: theme.palette.primary.main,
												"&.Mui-checked": {
													color: theme.palette.primary.main,
												},
											}}
										/>
									</TableCell>

									{/* Problem Name Cell */}
									<TableCell>
										<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
											<Link
												href={`https://codeforces.com/contest/${problem.contestId}/problem/${problem.index}`}
												target="_blank"
												underline="none"
												sx={{
													color: "text.primary",
													fontWeight: 500,
													"&:hover": {
														color: "primary.main",
													},
												}}>
												{problem.name}
											</Link>
											<StatusIcon status={problem.status} theme={theme} />
										</Box>
									</TableCell>

									{/* Tags Cell */}
									<TableCell>
										<Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
											{problem.tags.map((tag) => (
												<Chip
													key={`${problem.problemId}-${tag}`}
													label={tag}
													size="small"
													variant="outlined"
													sx={{
														borderRadius: 1,
														opacity: visibleColumns.tags ? 1 : 0,
														backgroundColor: alpha(
															theme.palette.primary.main,
															0.04
														),
														borderColor: alpha(
															theme.palette.primary.main,
															0.2
														),
														"& .MuiChip-label": {
															px: 1,
															fontSize: "0.75rem",
														},
													}}
												/>
											))}
										</Box>
									</TableCell>

									{/* Rating Cell */}
									<TableCell>
										<Chip
											label={problem.rating || "N/A"}
											size="small"
											sx={{
												opacity: visibleColumns.rating ? 1 : 0,
												backgroundColor: getRatingColor(problem.rating),
												fontWeight: 600,
												minWidth: 60,
												"& .MuiChip-label": {
													px: 1,
												},
											}}
										/>
									</TableCell>

									{/* Division Cell */}
									<TableCell>
										<Chip
											label={` ${problem.division}${problem.index}`}
											size="small"
											sx={{
												opacity: visibleColumns.division ? 1 : 0,
												backgroundColor: alpha(
													theme.palette.text.secondary,
													0.1
												),
												color: "text.primary",
												fontWeight: 500,
												"& .MuiChip-label": {
													px: 1,
												},
											}}
										/>
									</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</TableContainer>

			<Box
				sx={{
					borderTop: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
					p: 1,
				}}>
				<ProblemsTablePagination />
			</Box>
		</Paper>
	);
};

export default React.memo(ProblemsTable);
