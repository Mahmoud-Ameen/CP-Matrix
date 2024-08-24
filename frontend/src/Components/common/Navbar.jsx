// React Imports
import React, { useState } from "react";

// Material UI Imports
import {
	AppBar,
	Toolbar,
	Button,
	Typography,
	IconButton,
	Drawer,
	List,
	ListItem,
	ListItemText,
	Box,
} from "@mui/material";
import { AccountCircle, Menu as MenuIcon } from "@mui/icons-material";

// App Components and contexts
import GoogleLoginButton from "./GoogleLoginButton";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
	const [drawerOpen, setDrawerOpen] = useState(false);
	const { currentUser, isLoggedIn, logout } = useAuth();

	const toggleDrawer = (open) => (event) => {
		if (event.type === "keydown" && (event.key === "Tab" || event.key === "Shift")) {
			return;
		}
		setDrawerOpen(open);
	};

	return (
		<>
			<AppBar
				position="fixed"
				sx={{
					top: { xs: 0, md: "1.25rem" },
					left: { xs: 0, md: "50%" },
					width: {
						xs: "100%", // Full width on small screens
						md: "80%", // 80% width on small screens and up
					},
					transform: {
						xs: "none", // No transform on small screens
						md: "translateX(-50%)", // Center on larger screens
					},
					background: "#1f1f225c",
					backdropFilter: "blur(10px)", // Glassmorphism effect
					borderRadius: {
						xs: "0px", // No border-radius on small screens
						md: "50px", // Cylindrical shape on larger screens
					},
					boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.3)", // Floating effect
					padding: "2px", // Padding inside the navbar
				}}>
				<Toolbar
					sx={{
						display: "flex",
						justifyContent: {
							xs: "space-between",
							md: "space-between",
						},
						alignItems: "center",
					}}>
					{/* Left Side: Links (Visible on large screens) */}
					<Box sx={{ display: { xs: "none", md: "flex" }, gap: "15px" }}>
						<Button color="inherit" sx={{ color: "#ffffff" }}>
							Problems
						</Button>
						<Button color="inherit" sx={{ color: "#ffffff" }}>
							Sheets
						</Button>
					</Box>

					{/* Hamburger Menu Icon for Small Screens */}
					<IconButton
						edge="start"
						color="inherit"
						aria-label="menu"
						onClick={toggleDrawer(true)}
						sx={{ display: { xs: "block", md: "none" } }} // Show only on small screens
					>
						<MenuIcon />
					</IconButton>

					{/* Center: Logo or Project Name */}
					<Typography
						variant="h6"
						sx={{
							color: "#ffffff",
							fontWeight: "bold",
							textAlign: "center",
							flexGrow: { xs: 1, md: 0 }, // Center-align on small screens
							fontSize: { xs: "16px", md: "24px" }, // Adjust font size for responsiveness
						}}>
						Codeforces Sheets
					</Typography>

					{/* Right Side: Profile and Login */}
					<Box sx={{ display: "flex", gap: "15px" }}>
						{isLoggedIn() && (
							<IconButton
								color="inherit"
								sx={{ color: "#ffffff", fontSize: { xs: "20px", md: "24px" } }}>
								<AccountCircle />
							</IconButton>
						)}
						{isLoggedIn() && (
							<Button
								variant="contained"
								color="secondary"
								sx={{
									borderRadius: "20px",
									padding: { xs: "5px 10px", md: "8px 20px" }, // Adjust padding for responsiveness
									fontSize: { xs: "12px", md: "16px" }, // Adjust font size for responsiveness
								}}
								onClick={logout}>
								Logout
							</Button>
						)}
						{!isLoggedIn() && <GoogleLoginButton />}
					</Box>
				</Toolbar>
			</AppBar>
			{/* Drawer for Small Screens */}
			<Drawer
				anchor="left"
				open={drawerOpen}
				onClose={toggleDrawer(false)}
				sx={{ display: { xs: "block", md: "none" } }} // Show only on small screens
			>
				<Box
					sx={{
						width: 250,
						backgroundColor: "#1f1f22",
						height: "100%",
						paddingTop: "20px",
					}}
					role="presentation"
					onClick={toggleDrawer(false)}
					onKeyDown={toggleDrawer(false)}>
					<List>
						<ListItem button>
							<ListItemText primary="Problems" sx={{ color: "#ffffff" }} />
						</ListItem>
						<ListItem button>
							<ListItemText primary="Sheets" sx={{ color: "#ffffff" }} />
						</ListItem>
					</List>
				</Box>
			</Drawer>
		</>
	);
};

export default React.memo(Navbar);
