import axios from "axios";
import { connectToDatabase, disconnectFromDatabase } from "../src/config/db.js";
import Problem from "../src/models/problem.js";
import Contest from "../src/models/contest.js";

const fetchAndPopulateProblems = async () => {
	try {
		// Fetch data from Codeforces API
		const response = await axios.get("https://codeforces.com/api/problemset.problems");
		const problems = response.data.result.problems;

		// Extract unique contests
		const contestsIds = [...new Set(problems.map((prob) => prob.contestId))];
		const contests = await Contest.find({ id: { $in: contestsIds } }).select([
			"id",
			"division",
		]);

		// Create a mapping of contestId to contest division
		const divisions = new Map();
		contests.forEach(({ id, division }) => divisions.set(id, division));

		// Create updatedProblems with division field added and with unique tags
		const updatedProblems = problems.map((problem) => {
			return {
				...problem,
				division: divisions.get(problem.contestId) || null,
				tags: [...new Set(problem.tags)],
			};
		});

		// Insert problems to database
		await Problem.insertMany(updatedProblems);

		console.log("Problems data populated successfully.");
	} catch (error) {
		console.error("Error populating problems data:", error);
	}
};

const fetchAndPopulateContests = async () => {
	try {
		// Fetch contests data
		const response = await axios.get("https://codeforces.com/api/contest.list?gym=false");
		const contests = response.data.result.filter((contest) => contest.phase == "FINISHED");

		// Transform and insert data
		const transformedContests = contests.map((contest) => {
			let division = "";
			if (contest.name.includes("Div. 2")) division = "div2";
			else if (contest.name.includes("Div. 1")) division = "div1";
			else if (contest.name.includes("Div. 3")) division = "div3";
			else if (contest.name.includes("Div. 4")) division = "div4";
			else division = "other";
			return {
				id: contest.id,
				name: contest.name,
				type: contest.type,
				division: division,
			};
		});

		// insert data into MongoDB
		await Contest.insertMany(transformedContests, { ordered: false });

		console.log("Contests data populated successfully.");
	} catch (error) {
		console.error("Error populating contests data:", error);
	}
};

await connectToDatabase();

await fetchAndPopulateContests();
await fetchAndPopulateProblems();

disconnectFromDatabase();
