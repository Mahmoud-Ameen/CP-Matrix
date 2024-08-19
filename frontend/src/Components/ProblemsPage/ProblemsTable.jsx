// React Imports
import React, { useState } from "react";

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
} from "@mui/material";

import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { getRatingColor } from "../../utils/getRatingColor";

const ProblemsTable = ({ problems, totalProblems, page, setPage, rowsPerPage, setRowsPerPage }) => {
	// State to manage which columns to show and which to hide
	const [visibleColumns, setVisibleColumns] = useState({
		name: true,
		tags: true,
		rating: true,
		division: true,
	});

	// Function to toggle a column's visibility
	const toggleColumn = (column) => {
		setVisibleColumns((prev) => ({
			...prev,
			[column]: !prev[column],
		}));
	};

	// Change current pagination page
	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	// Change number of problems shown per page
	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	return (
		<Paper>
			<TableContainer>
				<Table sx={{ borderCollapse: "separate", borderSpacing: 0, borderColor: "red" }}>
					{/* -----------<<<< Table Header >>>>----------- */}
					<TableHead>
						<TableRow>
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
							<TableRow key={problem.contestId + problem.index}>
								{/* -----------<<<< Problem Name >>>>----------- */}
								<TableCell
									sx={{
										borderBottom: "1px solid",
										borderColor: "background.light",
									}}>
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
								<TableCell
									sx={{
										borderBottom: "1px solid",
										borderColor: "background.light",
									}}>
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
								<TableCell
									sx={{
										borderBottom: "1px solid",
										borderColor: "background.light",
									}}>
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
								<TableCell
									sx={{
										borderBottom: "1px solid",
										borderColor: "background.light",
									}}>
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
			<TablePagination
				rowsPerPageOptions={[10, 25, 50]}
				component="div"
				count={totalProblems}
				rowsPerPage={rowsPerPage}
				page={page}
				onPageChange={handleChangePage}
				onRowsPerPageChange={handleChangeRowsPerPage}
			/>
		</Paper>
	);
};

export default ProblemsTable;
