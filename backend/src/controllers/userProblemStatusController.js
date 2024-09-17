import CFAccountInfo from "../models/CFAccountInfo.js";
import UserProblemStatus from "../models/userProblemStatus.js";
import axios from "axios";

/**
 *  Fetch all user's submissions, process and save user's problem statuses
 * @param {String} handle - codeforces account handle
 *
 */
export const generateUserProblemsStatus = async (handle) => {
	try {
		// Fetch the last processed submission index for the user
		const userSubmissionInfo = await CFAccountInfo.findOne({ codeforcesHandle: handle });

		let lastProcessedSubmissionIndex = 0; // Default to fetching all submissions if no record is found
		if (userSubmissionInfo) {
			lastProcessedSubmissionIndex = userSubmissionInfo.lastProcessedSubmissionIndex;
		}

		// Fetch submissions from Codeforces API
		const fetchSubmissions = async (handle, from) => {
			try {
				const response = await axios.get(
					`https://codeforces.com/api/user.status?handle=${handle}&from=${from}`
				);
				if (response.data.status !== "OK") {
					throw new Error("Failed to fetch data from Codeforces API");
				}
				return response.data.result;
			} catch (error) {
				console.error(`Error fetching submissions: ${error.message}`);
				throw error;
			}
		};

		const submissions = await fetchSubmissions(handle, lastProcessedSubmissionIndex + 1);

		// Create a map to store the problems' status
		const problemsStatusMap = new Map();
		const problemIds = submissions.map(
			(submission) => `${submission.problem.contestId}${submission.problem.index}`
		);

		// Fetch existing problem statuses in bulk
		const existingStatuses = await UserProblemStatus.find({
			codeforcesHandle: handle,
			problemId: { $in: problemIds },
		}).lean();

		// Create a map of existing statuses
		const existingStatusMap = new Map(existingStatuses.map((s) => [s.problemId, s]));

		// Process submissions to determine the status of each problem
		submissions.forEach((submission) => {
			const problemId = `${submission.problem.contestId}${submission.problem.index}`;
			const verdict = submission.verdict;
			const submissionTime = new Date(submission.creationTimeSeconds * 1000);

			if (!problemsStatusMap.has(problemId)) {
				problemsStatusMap.set(problemId, {
					codeforcesHandle: handle,
					problemId,
					status: verdict === "OK" ? "solved" : "attempted",
					lastAttemptTime: submissionTime,
				});
			} else {
				const problemStatus = problemsStatusMap.get(problemId);

				// Update the status to "solved" if the current submission is "OK"
				if (verdict === "OK") {
					problemStatus.status = "solved";
				}

				// Update last attempt time to the latest submission time
				if (submissionTime > problemStatus.lastAttemptTime) {
					problemStatus.lastAttemptTime = submissionTime;
				}
			}
		});

		// Convert the problemsStatusMap to an array of values
		const problemsStatusList = Array.from(problemsStatusMap.values());

		// Prepare bulk operations
		const bulkOperations = [];
		const batchSize = 1000; // Adjust based on performance testing

		for (let i = 0; i < problemsStatusList.length; i += batchSize) {
			const batch = problemsStatusList.slice(i, i + batchSize);

			batch.forEach((problemStatus) => {
				const existingStatus = existingStatusMap.get(problemStatus.problemId);

				if (problemStatus.status === "attempted") {
					// Skip updating if the problem is already marked as solved
					if (existingStatus && existingStatus.status === "solved") return;

					bulkOperations.push({
						updateOne: {
							filter: {
								codeforcesHandle: problemStatus.codeforcesHandle,
								problemId: problemStatus.problemId,
							},
							update: {
								$set: {
									status: problemStatus.status,
									lastAttemptTime: problemStatus.lastAttemptTime,
								},
							},
							upsert: true,
						},
					});
				} else {
					// Update or insert problem status for "solved" problems
					bulkOperations.push({
						updateOne: {
							filter: {
								codeforcesHandle: problemStatus.codeforcesHandle,
								problemId: problemStatus.problemId,
							},
							update: {
								$set: {
									status: problemStatus.status,
									lastAttemptTime: problemStatus.lastAttemptTime,
								},
								$setOnInsert: {
									codeforcesHandle: problemStatus.codeforcesHandle,
									problemId: problemStatus.problemId,
								},
							},
							upsert: true,
						},
					});
				}
			});

			// Execute batch of bulk write operations
			if (bulkOperations.length > 0) {
				await UserProblemStatus.bulkWrite(bulkOperations);
				bulkOperations.length = 0; // Clear bulk operations array
			}
		}

		// Update the last processed submission index
		await CFAccountInfo.updateOne(
			{ codeforcesHandle: handle },
			{
				$set: {
					lastProcessedSubmissionIndex: lastProcessedSubmissionIndex + submissions.length,
				},
			},
			{ upsert: true }
		);

		console.log(`User problem statuses updated for handle: ${handle}`);
	} catch (error) {
		console.error(`Error generating user problem status for handle ${handle}:`, error.message);
	}
};

export const mark2 = async (problems, handle) => {
	try {
		let lastProcessedSubmissionIndex = 0; // Default to fetching all submissions if no record is found

		// Fetch submissions from Codeforces API
		const fetchSubmissions = async (handle, from) => {
			try {
				const response = await axios.get(
					`https://codeforces.com/api/user.status?handle=${handle}&from=${from}`
				);
				if (response.data.status !== "OK") {
					throw new Error("Failed to fetch data from Codeforces API");
				}
				return response.data.result;
			} catch (error) {
				console.error(`Error fetching submissions: ${error.message}`);
				throw error;
			}
		};

		const submissions = await fetchSubmissions(handle, lastProcessedSubmissionIndex + 1);

		// Create a map to store the problems' status
		const problemsStatusMap = new Map();

		// Process submissions to determine the status of each problem
		submissions.forEach((submission) => {
			const problemId = `${submission.problem.contestId}${submission.problem.index}`;
			const verdict = submission.verdict;
			if (!problemsStatusMap.has(problemId)) {
				problemsStatusMap.set(problemId, verdict === "OK" ? "solved" : "attempted");
			} else {
				if (verdict === "OK") {
					problemsStatusMap.set(problemId, "solved");
				}
			}
		});

		return problems.map((doc) => {
			// Clone the document to avoid mutating the original
			const updatedDoc = { ...(doc.toObject ? doc.toObject() : doc) };

			// Add the new field
			updatedDoc["status"] = problemsStatusMap.has(doc.problemId)
				? problemsStatusMap.get(doc.problemId)
				: "new";

			return updatedDoc;
		});
	} catch (error) {
		console.error(`Error generating user problem status for handle ${handle}:`, error.message);
	}
};

/**
 * Mark problems with their status (solved, attempted, or new) and update the database.
 * @param {Array} problems - Array of problem objects to be processed.
 * @param {String} handle - Codeforces account handle.
 */
export const markProblemsWithStatus = async (problems, handle) => {
	try {
		await generateUserProblemsStatus(handle);
		// Fetch existing problem statuses for the handle
		const existingStatuses = await UserProblemStatus.find({ codeforcesHandle: handle });

		// Create a map of existing problem statuses for quick lookup
		const existingStatusMap = new Map();
		existingStatuses.forEach((status) => {
			existingStatusMap.set(status.problemId, status.status);
		});

		return problems.map((doc) => {
			// Clone the document to avoid mutating the original
			const updatedDoc = { ...(doc.toObject ? doc.toObject() : doc) };

			// Add the new field
			updatedDoc["status"] = existingStatusMap.has(doc.problemId)
				? existingStatusMap.get(doc.problemId)
				: "new";

			return updatedDoc;
		});
	} catch (error) {
		console.error(`Error marking problems with status for handle ${handle}:`, error.message);
		throw error;
	}
};
