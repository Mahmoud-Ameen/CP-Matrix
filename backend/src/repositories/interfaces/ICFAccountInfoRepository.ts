/**
 * Interface representing the operations related to processing submission IDs for Codeforces users.
 */
export interface ICFAccountInfoRepository {
	/**
	 * Updates the last processed submission ID for a given Codeforces user in the database.
	 * If the user does not exist, a new entry will be created.
	 *
	 * @param codeforcesHandle - The Codeforces account handle of the user.
	 * @param lastProcessedSubmissionId - The ID of the last processed submission.
	 * @returns A promise that resolves when the update or creation is complete.
	 */
	updateLastProcessedSubmissionId(codeforcesHandle: string, lastProcessedSubmissionId: number): Promise<void>

	/**
	 * Retrieves the last processed submission ID for a given Codeforces user from the database.
	 *
	 * @param codeforcesHandle - The Codeforces account handle of the user.
	 * @returns A promise that resolves to the last processed submission ID or 0 if no record exists.
	 */
	getLastProcessedSubmissionId(codeforcesHandle: string): Promise<number>
}
