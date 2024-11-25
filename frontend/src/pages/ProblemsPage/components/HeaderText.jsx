import React from "react";
import { Box, Chip, Typography, useTheme, alpha } from "@mui/material";
import { getRatingColor } from "../../../utils/getRatingColor";
import { useFilters } from "../contexts/FiltersContext";
import FilterAltIcon from "@mui/icons-material/FilterAlt";

const HeaderText = () => {
	const theme = useTheme();
	const {
		filters: { tags, minRating, maxRating, divisions },
	} = useFilters();

	// Check if any filters are active
	const hasActiveFilters = tags?.length > 0 || (minRating && maxRating) || divisions?.length > 0;

	if (!hasActiveFilters) {
		return (
			<Box
				sx={{
					display: "flex",
					alignItems: "center",
					gap: 1,
					my: 2,
					color: "text.secondary",
				}}>
				<FilterAltIcon sx={{ opacity: 0.5 }} />
				<Typography variant="body1">No filters applied</Typography>
			</Box>
		);
	}

	return (
		<Box sx={{ my: 2 }}>
			{/* Active Filters Label */}
			<Box
				sx={{
					display: "flex",
					alignItems: "center",
					gap: 1,
					mb: 1.5,
				}}>
				<FilterAltIcon sx={{ color: theme.palette.primary.main }} />
				<Typography variant="body1" color="text.secondary">
					Active filters:
				</Typography>
			</Box>

			{/* Filter Chips Container */}
			<Box
				sx={{
					display: "flex",
					flexWrap: "wrap",
					gap: 1,
				}}>
				{/* Tags */}
				{tags?.map((tag) => (
					<Chip
						key={`tag-${tag}`}
						label={tag}
						size="small"
						variant="outlined"
						sx={{
							borderRadius: 1.5,
							backgroundColor: alpha(theme.palette.primary.main, 0.08),
							borderColor: alpha(theme.palette.primary.main, 0.2),
							"& .MuiChip-label": {
								px: 1.5,
								fontWeight: 500,
							},
						}}
					/>
				))}

				{/* Rating Range */}
				{minRating && maxRating && (
					<Chip
						label={`${minRating} - ${maxRating}`}
						size="small"
						sx={{
							borderRadius: 1.5,
							background: `linear-gradient(90deg, ${getRatingColor(
								minRating
							)} 0%, ${getRatingColor(maxRating)} 100%)`,
							color: "#fff",
							fontWeight: 600,
							"& .MuiChip-label": {
								px: 1.5,
							},
						}}
					/>
				)}

				{/* Divisions */}
				{divisions?.map((division) => (
					<Chip
						key={`div-${division}`}
						label={`Division ${division}`}
						size="small"
						sx={{
							borderRadius: 1.5,
							backgroundColor: alpha(theme.palette.secondary.main, 0.1),
							color: theme.palette.secondary.main,
							fontWeight: 500,
							"& .MuiChip-label": {
								px: 1.5,
							},
						}}
					/>
				))}
			</Box>
		</Box>
	);
};

export default React.memo(HeaderText);
