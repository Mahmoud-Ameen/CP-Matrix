import { IUserProblemStatus } from '../../types/shared'

/**
 * IUserProblemStatusRepository interface defines the contract for the User Problem Status repository.
 * This repository handles operations related to user-specific problem statuses in the database.
 */
export interface IUserProblemStatusRepository {
	/**
	 * Retrieves the problem statuses for a specific user based on their Codeforces handle.
	 *
	 * @param codeforcesHandle - The Codeforces handle of the user whose problem statuses are being queried.
	 * @returns A promise that resolves to an array of IUserProblemStatus objects representing the user's problem statuses.
	 */
	getUserProblemsStatus(codeforcesHandle: string): Promise<IUserProblemStatus[]>

	/**
	 * Retrieves the problem statuses for a specific user and returns them as a map,
	 * where the keys are problem IDs and the values are the respective status of each problem.
	 *
	 * @param codeforcesHandle - The Codeforces handle of the user whose problem statuses are being queried.
	 * @returns A promise that resolves to a Map where each key is a problemId and the value is the status of that problem.
	 */
	getUserProblemsStatusMap(codeforcesHandle: string): Promise<Map<string, string>>

	/**
	 * Inserts an array of user problem statuses into the database.
	 *
	 * @param userProblemsStatuses - An array of IUserProblemStatus objects to be inserted.
	 * @returns A promise that resolves when the insertion operation is complete.
	 */
	insertUserProblemsStatus(userProblemsStatuses: IUserProblemStatus[]): Promise<void>

	/**
	 * Retrieves the IDs of attempted-but-unsolved problems for a specific user based on their Codeforces handle.
	 *
	 * @param codeforcesHandle - The Codeforces handle of the user whose unsolved problem IDs are being queried.
	 * @returns A promise that resolves to an array of strings representing the IDs of the user's unsolved problems.
	 */
	getUserUnsolvedProblemsIds(codeforcesHandle: string): Promise<string[]>

	/**
	 * Updates the status of specified problems as solved for a specific user.
	 *
	 * @param problemIds - An array of problem IDs to be marked as solved.
	 * @param codeforcesHandle - The Codeforces handle of the user for whom the problems are being updated.
	 * @returns A promise that resolves when the update operation is complete.
	 */
	updateProblemsAsSolved(problemIds: string[], codeforcesHandle: string): Promise<void>

	/**
	 * Retrieves the IDs of solved problems for a specific user based on their Codeforces handle.
	 *
	 * @param codeforcesHandle - The Codeforces handle of the user whose solved problem IDs are being queried.
	 * @returns A promise that resolves to an array of strings representing the IDs of the user's solved problems.
	 */
	getUserSolvedProblemsIds(codeforcesHandle: string): Promise<string[]>
}
