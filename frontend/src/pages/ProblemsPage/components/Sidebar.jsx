import React, { useEffect, useState, useCallback } from "react";
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
	FormControl,
	InputLabel,
	Select,
	MenuItem,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { SyncButton } from "./SyncButton";
import MultiSelect from "../../../Components/common/MultiSelect";
import { fetchTags } from "../../../services/problemsService";
import { useFilters } from "../contexts/FiltersContext";

const FiltersSidebar = ({ open, onClose }) => {
	const { filters, applyFilters } = useFilters();

	// State to store selected filters
	const [selectedTags, setSelectedTags] = useState(filters.tags);
	const [minRating, setMinRating] = useState(800);
	const [maxRating, setMaxRating] = useState(3500);
	const [selectedDivisions, setSelectedDivisions] = useState([]);
	const [codeforcesHandle, setCodeforcesHandle] = useState(filters.codeforcesHandle);
	const [problemStatus, setProblemStatus] = useState(filters.problemStatus || "all");

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
		"div1A",
		"div1B",
		"div1C",
		"div1D",
		"div1E",
		"div1F",
		"div2A",
		"div2B",
		"div2C",
		"div2D",
		"div2E",
		"div2F",
		"div3A",
		"div3B",
		"div3C",
		"div3D",
		"div3E",
		"div3F",
		"div3G",
		"div3H",
		"div4A",
		"div4B",
		"div4C",
		"div4D",
		"div4E",
		"div4F",
		"div4G",
		"div4H",
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
	const handleReset = useCallback(() => {
		const initialState = {
			selectedTags: [],
			minRating: 800,
			maxRating: 3500,
			selectedDivisions: [],
			codeforcesHandle: "",
			problemStatus: "all",
		};

		setSelectedTags(initialState.selectedTags);
		setMinRating(initialState.minRating);
		setMaxRating(initialState.maxRating);
		setSelectedDivisions(initialState.selectedDivisions);
		setCodeforcesHandle(initialState.codeforcesHandle);
		setProblemStatus(initialState.problemStatus);

		applyFilters({
			tags: initialState.selectedTags,
			divisions: initialState.selectedDivisions,
			minRating: initialState.minRating,
			maxRating: initialState.maxRating,
			codeforcesHandle: initialState.codeforcesHandle,
			status: initialState.problemStatus,
		});
	}, [applyFilters]);

	// Handle applying filters
	const handleApplyFilters = () => {
		applyFilters({
			tags: selectedTags,
			divisions: selectedDivisions,
			minRating,
			maxRating,
			codeforcesHandle,
			status: problemStatus,
		});
		onClose();
	};

	// Handle successful sync
	const handleSyncSuccess = () => {
		// Re-apply filters to refresh the problem list with updated status
		handleApplyFilters();
	};

	// Memoize handlers
	const handleRatingChange = useCallback((_, [min, max]) => {
		setMinRating(min);
		setMaxRating(max);
	}, []);

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
							onChange={handleRatingChange}
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

				{/* Problem Status Filter */}
				<Accordion sx={{ borderBottom: "1px solid", borderColor: "background.default" }}>
					<AccordionSummary expandIcon={<ExpandMoreIcon color="secondary" />}>
						<Typography>Problem Status</Typography>
					</AccordionSummary>
					<AccordionDetails>
						<TextField
							fullWidth
							label="Codeforces Handle"
							value={codeforcesHandle}
							onChange={(e) => setCodeforcesHandle(e.target.value)}
							sx={{ mb: 2 }}
						/>

						{/* Sync Button */}
						<Box sx={{ mb: 2 }}>
							<SyncButton
								codeforcesHandle={codeforcesHandle}
								onSync={handleSyncSuccess}
								disabled={!codeforcesHandle}
							/>
						</Box>

						<FormControl fullWidth>
							<InputLabel>Status</InputLabel>
							<Select
								value={problemStatus}
								label="Status"
								onChange={(e) => setProblemStatus(e.target.value)}>
								<MenuItem value="all">All Problems</MenuItem>
								<MenuItem value="solved">Solved</MenuItem>
								<MenuItem value="attempted">Attempted</MenuItem>
								<MenuItem value="new">New</MenuItem>
							</Select>
						</FormControl>
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
