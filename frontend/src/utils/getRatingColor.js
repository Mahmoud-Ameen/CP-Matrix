export const getRatingColor = (rating) => {
	if (!rating) return "black";
	if (rating < 1200) return "gray";
	if (rating < 1400) return "green";
	if (rating < 1600) return "#03a89e";
	if (rating < 1900) return "blue";
	if (rating < 2100) return "#a0a";
	if (rating < 2400) return "#ff8c00";
	return "#ff0000";
};
