import Contest from "../models/contest.js";
import Problem from "../models/problem.js";

/*
	req.query:
		difficulties?: JSON string representing an object where keys are division names and values are arrays of problem indexes
		tags?: JSON string representing an array of tags
		
		minRating?: Int
		maxRating?: Int

		page?: page number for pagination (default: 1)
		limit?: number of problems per page (default: 20)

*/
export const getProblems = async (req, res) => {
	try {
		// extract filters and pagination data from query params
		let {
			difficulties = null,
			tags = [],
			minRating = null,
			maxRating = null,
			page = 1,
			limit = 20,
		} = req.query;

		limit = Number(limit);
		page = Number(page);

		// Array to hold conditions for mongoDB query
		const queryConditions = [];

		// If specified difficulties (e.g., div2A, div3B, ...)
		if (difficulties) {
			const parsedDifficulties = JSON.parse(difficulties);
			const diffConditions = await generateDifficultiesQueryConditions(parsedDifficulties);

			// add conditions to query
			queryConditions.push(diffConditions);
		}

		// If specified tags (e.g., math, geometry, ...)
		if (Array.isArray(tags) && tags.length > 0) {
			const parsedTags = JSON.parse(tags);
			const tagsConditions = await generateTagsQueryConditions(parsedTags);

			// add conditions to query
			queryConditions.push(tagsConditions);
		}

		// If specified rating range conditions
		if (minRating !== null || maxRating !== null) {
			// Make sure to exclude problems with null rating
			const ratingConditions = { $ne: null };

			if (minRating !== null) ratingConditions.$gte = Number(minRating);
			if (maxRating !== null) ratingConditions.$lte = Number(maxRating);

			queryConditions.push({ rating: ratingConditions });
		}

		// combine queries using $and so that every condition (filter) must apply
		const combinedQuery = queryConditions.length > 0 ? { $and: queryConditions } : {};

		// Count total number of problems before pagination
		const totalProblemsCount = await Problem.countDocuments(combinedQuery);

		// Fetch problems from the database
		// Apply the constructed query, sorting by contestId in descending order, and paginating
		const problems = await Problem.find(combinedQuery)
			.select(["contestId", "index", "name", "tags", "rating", "-_id"])
			.sort({ contestId: -1 })
			.skip((page - 1) * limit)
			.limit(limit);

		// Send Problems as JSON response
		res.json({ totalPages: Math.ceil(totalProblemsCount / limit), problems: problems });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Failed to fetch problems" });
	}
};

/**
 * Helper function to create query conditions based on specified difficulties
 * parsedDifficulties: object where keys are division names and values are arrays of problem indexes
 */
const generateDifficultiesQueryConditions = async (parsedDifficulties) => {
	if (!parsedDifficulties) return {};

	const difficultiesQueryConditions = [];

	for (const division in parsedDifficulties) {
		const indexes = parsedDifficulties[division];

		const contestsIds = await Contest.find({ division }).distinct("id").exec();
		difficultiesQueryConditions.push({
			contestId: { $in: contestsIds },
			index: { $in: indexes },
		});
	}

	// combine difficulty queries using or operator
	// i.e. we want problems that are of any of the specified difficulties
	if (difficultiesQueryConditions.length > 0) return { $or: difficultiesQueryConditions };

	return {};
};

/**
 * Helper function to create query conditions based on tags
 * parsedTags: array of problem tags e.g. ["math","geometry"]
 */
const generateTagsQueryConditions = async (parsedTags) => {
	if (!Array.isArray(parsedTags) || parsedTags.length == 0) return {};

	let combinedCondition = [];
	parsedTags.forEach((tag) => {
		const tagExistCondition = { tags: tag }; // checks if [tags] include [tag]
		combinedCondition.push(tagExistCondition);
	});

	return combinedCondition.length > 0 ? { $or: combinedCondition } : {};
};
