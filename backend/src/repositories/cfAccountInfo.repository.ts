import CFAccountInfo from '../models/CFAccountInfo.model.js'
import { ICFAccountInfoRepository } from './interfaces/ICFAccountInfoRepository.js'

/**
 * Updates the last processed submission ID for a given Codeforces user in db.
 * If the user does not exist, a new entry will be created.
 *
 * @param codeforcesHandle - The Codeforces account handle.
 * @param lastProcessedSubmissionId - The ID of the last processed submission.
 */
const updateLastProcessedSubmissionId = async (codeforcesHandle: string, lastProcessedSubmissionId: number) => {
	const cfAccountInfo = await CFAccountInfo.findOne({ codeforcesHandle })
	if (!cfAccountInfo) {
		await CFAccountInfo.create({ codeforcesHandle, lastProcessedSubmissionId })
	} else {
		cfAccountInfo.lastProcessedSubmissionId = lastProcessedSubmissionId
		await cfAccountInfo.save()
	}
}

/**
 * Retrieves the last processed submission ID for a given Codeforces user from db.
 *
 * @param codeforcesHandle - The Codeforces account handle.
 * @returns The last processed submission ID or 0 if no record exists.
 */
const findLastProcessedSubmissionId = async (codeforcesHandle: string): Promise<number> => {
	const cfAccountInfo = await CFAccountInfo.findOne({ codeforcesHandle })
	if (!cfAccountInfo) {
		return 0
	} else {
		return cfAccountInfo.lastProcessedSubmissionId
	}
}

const cfAccountInfoRepository: ICFAccountInfoRepository = {
	updateLastProcessedSubmissionId,
	getLastProcessedSubmissionId: findLastProcessedSubmissionId,
}
export default cfAccountInfoRepository
