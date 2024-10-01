import cfAccountInfoRepository from '../repositories/cfAccountInfo.repository.js'
import { ICFAccountInfoService } from './interfaces/ICFAccountInfoService.js'

/**
 * Sets the last processed submission ID for a given Codeforces user.
 *
 * @param handle - The Codeforces account handle.
 * @param lastProcessedSubmissionIndex - The ID of the last processed submission.
 * @returns A promise that resolves when the update is complete.
 * @throws An error if the update fails.
 */
const setLastProcessedSubmissionId = async (handle: string, lastProcessedSubmissionIndex: number): Promise<void> => {
	try {
		await cfAccountInfoRepository.updateLastProcessedSubmissionId(handle, lastProcessedSubmissionIndex)
	} catch (error) {
		console.error(`Failed to update last processed submission ID for ${handle}:`, error)
		throw new Error('Error updating last processed submission ID.')
	}
}

/**
 * Retrieves the last processed submission ID for a given Codeforces user.
 *
 * @param handle - The Codeforces account handle.
 * @returns A promise that resolves to the last processed submission ID.
 * @throws An error if the retrieval fails.
 */
const getLastProcessedSubmissionId = async (handle: string): Promise<number> => {
	try {
		return await cfAccountInfoRepository.getLastProcessedSubmissionId(handle)
	} catch (error) {
		console.error(`Failed to retrieve last processed submission ID for ${handle}:`, error)
		throw new Error('Error retrieving last processed submission ID.')
	}
}

const cfAccountInfoService: ICFAccountInfoService = {
	setLastProcessedSubmissionId,
	getLastProcessedSubmissionId,
}

export default cfAccountInfoService
