import React from "react";
import {
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	Checkbox,
	ListItemText,
	OutlinedInput,
	Chip,
	Box,
} from "@mui/material";

// MultiSelect component: A reusable component for rendering a dropdown with multiple selectable options
// Props:
// - label: The label for the select input
// - value: The currently selected options (array of strings)
// - options: The list of options to display in the dropdown
// - onChange: Function to handle changes in the selected options
const MultiSelect = ({ label, value, options, onChange }) => {
	return (
		<FormControl fullWidth>
			{/* InputLabel component for the select input */}
			<InputLabel id={`${label}-label`}>{label}</InputLabel>

			{/* Select component for choosing multiple options */}
			<Select
				labelId={`${label}-label`}
				multiple // Enables multiple selections
				value={value} // Array of currently selected values
				onChange={onChange} // Event handler for when selections change
				input={<OutlinedInput label={label} />}
				// Custom rendering of the selected values
				renderValue={(selected) => (
					<Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
						{selected.map((value) => (
							<Chip key={value} label={value} variant="outlined" color="primary" />
						))}
					</Box>
				)}
				// Customizes the appearance of the dropdown menu
				MenuProps={{
					PaperProps: {
						style: {
							maxHeight: 250, // Maximum height for the options menu
						},
					},
				}}>
				{/* Rendering each option in the dropdown */}
				{options.map((option) => (
					<MenuItem
						key={option} // Unique key for each option
						value={option} // Value of the option
						// Styling for the menu item
						sx={{
							fontSize: "0.875rem",
							padding: "4px",
						}}>
						{/* Checkbox to show if the option is selected */}
						<Checkbox
							checked={value.indexOf(option) > -1} // Checks if the option is selected
							sx={{ p: 1, "& .MuiSvgIcon-root": { fontSize: 20 } }} // Styling for the checkbox
						/>

						{/* Option Text */}
						<ListItemText primary={option} disableTypography={true} />
					</MenuItem>
				))}
			</Select>
		</FormControl>
	);
};

export default MultiSelect;
