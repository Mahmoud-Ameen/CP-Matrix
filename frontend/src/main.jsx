import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

import { ThemeProvider, createTheme } from "@mui/material";

const emeraldTheme = createTheme({
	palette: {
		primary: {
			main: "#2ECC71", // Emerald Green
			light: "#5AFF9C", // Lighter Emerald
			dark: "#1B8F4D", // Darker Emerald
		},
		secondary: {
			main: "#F4C542", // Bright Gold
			light: "#F7DB75", // Lighter Gold
			dark: "#A38418", // Darker Gold
		},
		background: {
			default: "#1B1F23", // Dark Grey
			light: "#2F3338", // Lighter Grey
			dark: "#0F1215", // Darker Grey
			paper: "#1B1F23", // Paper background
		},
		text: {
			primary: "#E6E6E6", // Light Grey text
			secondary: "#B0B0B0", // Grey text
		},
	},
});

const nestTheme = createTheme({
	palette: {
		mode: "dark",
		primary: {
			main: "#f23551",
			light: "#FF6F6F",
			dark: "#bc233a",
		},
		secondary: {
			main: "#f23551",
			light: "#4B5563",
			dark: "#0F172A",
		},
		background: {
			paper: "#1f1f22", //  Dark Background
			default: "#1b1b1d", //  Darker Gray Paper
		},
		text: {
			primary: "#F3F4F6", //  Light Gray Text
			secondary: "#D1D5DB", //  Medium Gray
		},
	},
});

const theme = nestTheme;

export default theme;

createRoot(document.getElementById("root")).render(
	<ThemeProvider theme={theme}>
		<App />
	</ThemeProvider>
);
