import { Chip, Typography } from "@mui/material";
import { getRatingColor } from "../../utils/getRatingColor";
import React from "react";

const HeaderText = ({ tags, minRating, maxRating, divisions }) => (
	<Typography variant="h5" color="text.secondary" sx={{ lineHeight: "1.25", my: 2 }}>
		Showing problems
		{/* Tags */}
		{tags && tags.length > 0 && (
			<>
				&nbsp;with tags&nbsp;
				{tags.map((tag, index) => (
					<React.Fragment key={`page-tag-${tag}`}>
						<Chip variant="outlined" label={tag} sx={{ m: 0.5 }} />
					</React.Fragment>
				))}
			</>
		)}
		{/* Rating Range */}
		{minRating && maxRating && (
			<>
				&nbsp;with rating between&nbsp;
				<Chip
					sx={{ backgroundColor: getRatingColor(minRating), m: 0.5 }}
					label={minRating}
				/>
				&nbsp; and &nbsp;
				<Chip
					sx={{ backgroundColor: getRatingColor(maxRating), m: 0.5 }}
					label={maxRating}
				/>
			</>
		)}
		{/* Divisions */}
		{divisions && Object.keys(divisions).length > 0 && (
			<>
				&nbsp; from divisions&nbsp;
				{Object.entries(divisions).map(([division, indexes]) =>
					indexes.map((index, idx) => (
						<React.Fragment key={`division-${division}${index}`}>
							<Chip
								variant="outlined"
								label={`${division}${index}`}
								sx={{ m: 0.5 }}
							/>
						</React.Fragment>
					))
				)}
			</>
		)}
	</Typography>
);

export default HeaderText;
