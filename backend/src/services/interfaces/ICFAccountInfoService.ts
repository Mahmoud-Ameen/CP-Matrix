/**
 * Interface representing the Codeforces account information service.
 */
export interface ICFAccountInfoService {
	/**
	 * Sets the last processed submission ID for a given Codeforces user.
	 *
	 * @param handle - The Codeforces account handle.
	 * @param lastProcessedSubmissionIndex - The ID of the last processed submission.
	 * @returns A promise that resolves when the update is complete.
	 * @throws An error if the update fails.
	 */
	setLastProcessedSubmissionId(handle: string, lastProcessedSubmissionIndex: number): Promise<void>

	/**
	 * Retrieves the last processed submission ID for a given Codeforces user.
	 *
	 * @param handle - The Codeforces account handle.
	 * @returns A promise that resolves to the last processed submission ID.
	 * @throws An error if the retrieval fails.
	 */
	getLastProcessedSubmissionId(handle: string): Promise<number>
}
