// React imports
import React, { useEffect, useState } from "react";

// Material UI imports
import {
	Drawer,
	Accordion,
	AccordionSummary,
	AccordionDetails,
	Typography,
	Slider,
	TextField,
	Button,
	Box,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

// App imports
import MultiSelect from "../common/MultiSelect";
import { fetchTags } from "../../services/problemsService";
import { useFilters } from "../../context/ProblemsPage/FiltersContext";

const FiltersSidebar = ({ open, onClose }) => {
	const { filters, applyFilters } = useFilters();

	// State to store selected filters
	const [selectedTags, setSelectedTags] = useState(filters.tags);
	const [minRating, setMinRating] = useState(800);
	const [maxRating, setMaxRating] = useState(3500);
	const [selectedDivisions, setSelectedDivisions] = useState([]);

	// State to store the available tags fetched from the server
	const [tags, setTags] = useState([]);

	// Fetch available tags when the component is mounted
	useEffect(() => {
		try {
			async function loadTags() {
				const data = await fetchTags();
				setTags(data);
			}
			loadTags();
		} catch (error) {
			console.error(error);
		}
	}, []);

	// Hardcoded list of divisions with problems indexes
	const divisions = [
		"div1:A",
		"div1:B",
		"div1:C",
		"div1:D",
		"div1:E",
		"div1:F",

		"div2:A",
		"div2:B",
		"div2:C",
		"div2:D",
		"div2:E",
		"div2:F",

		"div3:A",
		"div3:B",
		"div3:C",
		"div3:D",
		"div3:E",
		"div3:F",
		"div3:G",
		"div3:H",

		"div4:A",
		"div4:B",
		"div4:C",
		"div4:D",
		"div4:E",
		"div4:F",
		"div4:G",
		"div4:H",
	];

	// Handle changes in selected tags
	const handleTagChange = (event) => {
		const value = event.target.value;

		setSelectedTags(typeof value === "string" ? value.split(",") : value);
	};

	// Handle changes in selected divisions
	const handleDivisionsChange = (event) => {
		const value = event.target.value;
		setSelectedDivisions(typeof value === "string" ? value.split(",") : value);
	};

	// Handle reseting filters
	const handleReset = () => {
		setSelectedTags([]);
		setMinRating(800);
		setMaxRating(3500);
		setSelectedDivisions([]);

		applyFilters({
			tags: [],
			divisions: [],
			minRating: 800,
			maxRating: 3500,
		});
		onClose();
	};

	// Handle applying filters
	const handleApplyFilters = () => {
		applyFilters({
			tags: selectedTags,
			divisions: selectedDivisions,
			minRating,
			maxRating,
		});
		onClose();
	};
	return (
		<Drawer anchor="left" open={open} onClose={onClose}>
			<Box sx={{ width: 350, padding: 4 }}>
				<Typography variant="h6">Filters</Typography>

				{/* Tags Filter */}
				<Accordion sx={{ borderBottom: "1px solid", borderColor: "background.default" }}>
					<AccordionSummary expandIcon={<ExpandMoreIcon color="secondary" />}>
						<Typography>Tags</Typography>
					</AccordionSummary>
					<AccordionDetails>
						<MultiSelect
							label="Select Tags"
							value={selectedTags}
							options={tags}
							onChange={handleTagChange}
						/>
					</AccordionDetails>
				</Accordion>

				{/* Rating Filter */}
				<Accordion sx={{ borderBottom: "1px solid", borderColor: "background.default" }}>
					<AccordionSummary expandIcon={<ExpandMoreIcon color="secondary" />}>
						<Typography>Rating</Typography>
					</AccordionSummary>
					<AccordionDetails>
						<Slider
							value={[minRating, maxRating]}
							onChange={(e, newValue) => {
								setMinRating(newValue[0]);
								setMaxRating(newValue[1]);
							}}
							valueLabelDisplay="auto"
							min={800}
							max={3500}
							step={100}
						/>
						<div style={{ display: "flex", justifyContent: "space-between" }}>
							<TextField
								label="Min"
								type="number"
								value={minRating}
								onChange={(e) => setMinRating(Number(e.target.value))}
								style={{ width: "45%" }}
							/>
							<TextField
								label="Max"
								type="number"
								value={maxRating}
								onChange={(e) => setMaxRating(Number(e.target.value))}
								style={{ width: "45%" }}
							/>
						</div>
					</AccordionDetails>
				</Accordion>

				{/* Divisions Filter */}
				<Accordion sx={{ borderBottom: "1px solid", borderColor: "background.default" }}>
					<AccordionSummary expandIcon={<ExpandMoreIcon color="secondary" />}>
						<Typography>Divisions</Typography>
					</AccordionSummary>
					<AccordionDetails>
						<MultiSelect
							label="Select Divisions"
							value={selectedDivisions}
							options={divisions}
							onChange={handleDivisionsChange}
						/>
					</AccordionDetails>
				</Accordion>

				{/* Buttons Container */}
				<Box sx={{ my: 2, display: "flex", gap: 1 }}>
					<Button variant="contained" color="secondary" onClick={handleApplyFilters}>
						Apply
					</Button>
					<Button variant="outlined" color="secondary" onClick={handleReset}>
						Reset
					</Button>
				</Box>
			</Box>
		</Drawer>
	);
};
export default React.memo(FiltersSidebar);
