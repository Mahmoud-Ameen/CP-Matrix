// React imports
import React, { useState, useEffect, useCallback, memo } from "react";

// Material UI imports
import { Box, Container, Button, Typography, Stack, Chip } from "@mui/material";

// App components imports
import FiltersSidebar from "./components/Sidebar";
import ProblemsTable from "./components/ProblemsTable";
import HeaderText from "./components/HeaderText";
import Navbar from "../../Components/common/Navbar";

import { FiltersProvider } from "./contexts/FiltersContext";
import { ProblemsProvider } from "./contexts/ProblemsContext";

// App services imports
const ProblemsPage = memo(() => {
	// State for managing opening and closing of the sidebar
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);

	const toggleSidebar = useCallback(() => {
		setIsSidebarOpen((prevState) => !prevState);
	}, []);

	return (
		<FiltersProvider>
			<ProblemsProvider>
				<Box sx={{ backgroundColor: "background.default", minHeight: "100vh", pt: 8 }}>
					<Navbar />

					<Box sx={{ py: 5 }}>
						{/* Sidebar component for filtering problems */}
						<FiltersSidebar open={isSidebarOpen} onClose={toggleSidebar} />

						<Container style={{ flex: 1 }}>
							{/*-----<<<<< Page Header >>>>>-----*/}
							<Box
								sx={{
									display: "flex",
									justifyContent: "space-between",
									alignItems: "center",
								}}>
								{/* -----<<<<< Header Text >>>>>----- */}
								<HeaderText />
								{/* Button to toggle sidebar visibility */}
								<Button onClick={toggleSidebar} variant="outlined" sx={{ m: 2 }}>
									Filters
								</Button>
							</Box>
							{/* Problems table */}
							<ProblemsTable />
						</Container>
					</Box>
				</Box>
			</ProblemsProvider>
		</FiltersProvider>
	);
});

export default ProblemsPage;
