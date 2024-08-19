import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

import { ThemeProvider, createTheme } from "@mui/material";
import { green, grey } from "@mui/material/colors";

const theme = createTheme({
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
		ratings: {
			newbie: {
				default: "#777",
				light: "#777",
				dark: "#777",
			},
		},
	},
});

export default theme;

createRoot(document.getElementById("root")).render(
	<StrictMode>
		<ThemeProvider theme={theme}>
			<App />
		</ThemeProvider>
	</StrictMode>
);
