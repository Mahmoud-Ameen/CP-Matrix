import axios from "axios";
import { connectToDatabase, disconnectFromDatabase } from "../src/config/db.js";
import Problem from "../src/models/problem.js";
import Contest from "../src/models/contest.js";

const fetchAndPopulateProblems = async () => {
	try {
		// Fetch data from Codeforces API
		const response = await axios.get("https://codeforces.com/api/problemset.problems");
		const problems = response.data.result.problems;

		// Insert data
		await Problem.insertMany(problems);

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
			if (contest.name.includes("Div. 1")) division = "div1";
			else if (contest.name.includes("Div. 2")) division = "div2";
			else if (contest.name.includes("Div. 3")) division = "div3";
			else if (contest.name.includes("Div. 4")) division = "div4";
			else if (contest.name.includes("Div. 1 + Div. 2")) division = "div1+2";

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
