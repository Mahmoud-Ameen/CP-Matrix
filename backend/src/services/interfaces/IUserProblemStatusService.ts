import { IUserProblemStatus } from '../../types/shared'

/**
 * Interface representing the user problem status service for Codeforces.
 * This service manages interactions related to the problem-solving progress of users.
 */
export interface IUserProblemStatusService {
	/**
	 * Synchronizes the problem statuses of a user with the latest data from the Codeforces API.
	 * This method fetches new submissions since the last processed submission and updates
	 * the user's problem statuses in the database.
	 *
	 * @param handle - The Codeforces account handle of the user.
	 * @returns A promise that resolves when the synchronization is complete.
	 * @throws An error if the synchronization fails or the handle is invalid.
	 */
	syncUserProblemsStatus(handle: string): Promise<void>

	/**
	 * Retrieves the problem statuses of a user identified by their Codeforces handle.
	 *
	 * @param handle - The Codeforces account handle of the user.
	 * @returns A promise that resolves to an array of `IUserProblemStatus` objects representing
	 * the user's problem statuses.
	 * @throws An error if the retrieval fails or the handle is invalid.
	 */
	getUserProblemsStatus(handle: string): Promise<IUserProblemStatus[]>

	/**
	 * Retrieves the list of solved problems for a given user.
	 *
	 * @param handle - The Codeforces account handle of the user.
	 * @returns A promise that resolves to an array of problem IDs that the user has solved.
	 * @throws An error if the retrieval fails or the handle is invalid.
	 */
	getUserSolvedProblems(handle: string): Promise<string[]>

	/**
	 * Retrieves the list of unsolved problems for a given user.
	 *
	 * @param handle - The Codeforces account handle of the user.
	 * @returns A promise that resolves to an array of problem IDs that the user has not yet solved.
	 * @throws An error if the retrieval fails or the handle is invalid.
	 */
	getUserUnsolvedProblems(handle: string): Promise<string[]>
}
