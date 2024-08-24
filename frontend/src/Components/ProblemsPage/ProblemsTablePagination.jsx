import { TablePagination } from "@mui/material";
import React from "react";
import { useProblems } from "../../context/ProblemsPage/ProblemsContext";

function ProblemsTablePagination() {
	const { pagination, handleChangePage, handleChangeRowsPerPage } = useProblems();
	const { page, totalProblemsCount, problemsPerPage } = pagination;

	return (
		<TablePagination
			rowsPerPageOptions={[10, 25, 50]}
			component="div"
			count={totalProblemsCount}
			rowsPerPage={problemsPerPage}
			page={page}
			onPageChange={handleChangePage}
			onRowsPerPageChange={handleChangeRowsPerPage}
		/>
	);
}

export default React.memo(ProblemsTablePagination);
