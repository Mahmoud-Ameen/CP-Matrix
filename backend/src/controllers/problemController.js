import Contest from "../models/contest.js";
import Problem from "../models/problem.js";

/*
	req.query:
		divisions?: JSON string representing an object where keys are division names and values are arrays of problem indexes
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
			divisions = null,
			tags = "[]",
			minRating = null,
			maxRating = null,
			page = 1,
			limit = 20,
		} = req.query;

		limit = Number(limit);
		page = Number(page);

		// Array to hold conditions for mongoDB query
		const queryConditions = [];

		// If specified divisions (e.g., div2A, div3B, ...)
		if (divisions) {
			const parsedDivisions = JSON.parse(divisions);
			const divisionConditions = await generateDivisionsQuery(parsedDivisions);

			// add conditions to query
			queryConditions.push(divisionConditions);
		}

		// If specified tags (e.g., math, geometry, ...)
		const parsedTags = JSON.parse(tags);
		if (Array.isArray(parsedTags) && parsedTags.length > 0) {
			const tagsConditions = await generateTAgsQuery(parsedTags);
			console.log(parsedTags);

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
			.select(["contestId", "index", "name", "tags", "rating", "division", "-_id"])
			.sort({ contestId: -1 })
			.skip((page - 1) * limit)
			.limit(limit);

		// Send Problems as JSON response
		res.json({
			totalPages: Math.ceil(totalProblemsCount / limit),
			totalProblems: totalProblemsCount,
			problems: problems,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Failed to fetch problems" });
	}
};

export const getTags = async (req, res) => {
	// Note that tags are basically static and rarely changes
	// so using a static array in the memory would save time
	// by avoiding database queries

	// If that changes in the future, a different approach would be needed
	const tags = [
		"2-sat",
		"binary search",
		"bitmasks",
		"brute force",
		"chinese remainder theorem",
		"constructive algorithms",
		"data structures",
		"dfs and similar",
		"divide and conquer",
		"dp",
		"dsu",
		"expression parsing",
		"fft",
		"flows",
		"games",
		"geometry",
		"graph matchings",
		"graphs",
		"greedy",
		"hashing",
		"implementation",
		"interactive",
		"math",
		"matrices",
		"meet-in-the-middle",
		"number theory",
		"probabilities",
		"schedules",
		"shortest paths",
		"sortings",
		"string suffix structures",
		"strings",
		"ternary search",
		"trees",
		"two pointers",
	];

	res.json(tags);
};

/**
 * Helper function to create query conditions based on specified difficulties
 * parsedDivisions: object where keys are division names and values are arrays of problem indexes
 */
const generateDivisionsQuery = async (parsedDivisions) => {
	if (!parsedDivisions) return {};

	const divisionsQuery = [];

	for (const division in parsedDivisions) {
		const indexes = parsedDivisions[division];
		// Subtasks of a problem are considered part of the same problem
		// e.g. Div2C1 and Div2C2 are considered Div2C
		indexes.forEach((index) => indexes.push(index + "1", index + "2"));

		const contestsIds = await Contest.find({ division }).distinct("id").exec();
		divisionsQuery.push({
			contestId: { $in: contestsIds },
			index: { $in: indexes },
		});
	}

	// combine division queries using or operator
	// i.e. we want problems that belong to any of the specified divisions
	if (divisionsQuery.length > 0) return { $or: divisionsQuery };

	return {};
};

/**
 * Helper function to create query conditions based on tags
 * parsedTags: array of problem tags e.g. ["math","geometry"]
 */
const generateTAgsQuery = async (parsedTags) => {
	if (!Array.isArray(parsedTags) || parsedTags.length == 0) return {};

	let combinedCondition = [];
	parsedTags.forEach((tag) => {
		const tagExistCondition = { tags: tag }; // checks if [tags] include [tag]
		combinedCondition.push(tagExistCondition);
	});

	return combinedCondition.length > 0 ? { $or: combinedCondition } : {};
};
