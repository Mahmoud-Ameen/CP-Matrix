import axios from 'axios'
import userProblemStatusRepository from '../repositories/userProblemStatus.repository.js'
import { IUserProblemStatus, ProblemStatus } from '../types/shared.js'
import cfAccountInfoService from './cfAccountInfo.service.js'
import { IUserProblemStatusService } from './interfaces/IUserProblemStatusService.js'

interface CFSubmission {
	id: number
	contestId: number
	problem: { contestId: number; index: string }
	verdict: string
	creationTimeSeconds: number
}

/**
 * Synchronizes the problem statuses of a user with the Codeforces API.
 *
 * This method fetches new submissions since the last processed submission
 * and updates the user's problem statuses in the database.
 *
 * @param handle - The Codeforces account handle of the user.
 * @returns A promise that resolves when the synchronization is complete.
 * @throws An error if the synchronization fails.
 */
const syncUserProblemsStatus = async (handle: string) => {
	try {
		// [1] get user's processed submission index from db
		const lastProcessdSubmissionId = await cfAccountInfoService.getLastProcessedSubmissionId(handle)

		// [2] fetch user's submissions after last processed submission index from CF API

		const res = await axios.get(`https://codeforces.com/api/user.status?handle=${handle}`)

		const newUserSubmissions: CFSubmission[] = res.data.result.filter(
			(sub: CFSubmission) => sub.id > lastProcessdSubmissionId
		)
		if (newUserSubmissions.length === 0) return

		// [3] Process new submissions
		const previouslyUnsolvedProblems = new Set(await userProblemStatusRepository.getUserUnsolvedProblemsIds(handle))

		let newProblemStatusMap: Map<string, ProblemStatus.SOLVED | ProblemStatus.ATTEMPTED> = new Map()
		let newlySolvedProblems: string[] = [] // list of problems that were unsolved in db but solved now
		newUserSubmissions.forEach((sub) => {
			const problemId = `${sub.contestId}${sub.problem.index}`
			const verdict = sub.verdict
			const newStatus = verdict === 'OK' ? ProblemStatus.SOLVED : ProblemStatus.ATTEMPTED

			if (!previouslyUnsolvedProblems.has(problemId)) {
				if (newProblemStatusMap.get(problemId) !== ProblemStatus.SOLVED)
					newProblemStatusMap.set(problemId, newStatus)
			} else if (verdict === 'OK') newlySolvedProblems.push(problemId)
		})

		// [4] Update db
		const newUserProblemsStatus: IUserProblemStatus[] = []
		newProblemStatusMap.forEach((status, problemId) => {
			newUserProblemsStatus.push({
				codeforcesHandle: handle,
				problemId,
				status: status as ProblemStatus.SOLVED | ProblemStatus.ATTEMPTED,
			})
		})

		const lastSubmissionId = res.data.result[0].id

		await userProblemStatusRepository.insertUserProblemsStatus(newUserProblemsStatus)
		await userProblemStatusRepository.updateProblemsAsSolved(newlySolvedProblems, handle)
		await cfAccountInfoService.setLastProcessedSubmissionId(handle, lastSubmissionId)
	} catch (error) {
		console.error(`Failed to sync problem statuses for ${handle}:`, error)
		throw new Error('Error syncing user problem statuses.')
	}
}
/**
 * Retrieves the problem statuses of a given user.
 *
 * @param handle - The Codeforces account handle.
 * @returns A promise that resolves to the user's problem statuses.
 * @throws An error if the retrieval fails.
 */
const getUserProblemsStatus = async (handle: string) => {
	try {
		return await userProblemStatusRepository.getUserProblemsStatus(handle)
	} catch (error) {
		console.error(`Failed to retrieve problem statuses for ${handle}:`, error)
		throw new Error('Error retrieving user problem statuses.')
	}
}
/**
 * Retrieves the solved problems of a given user.
 *
 * @param handle - The Codeforces account handle.
 * @returns A promise that resolves to the user's solved problem IDs.
 * @throws An error if the retrieval fails.
 */
const getUserSolvedProblems = async (handle: string) => {
	try {
		return await userProblemStatusRepository.getUserSolvedProblemsIds(handle)
	} catch (error) {
		console.error(`Failed to retrieve solved problems for ${handle}:`, error)
		throw new Error('Error retrieving user solved problems.')
	}
}

/**
 * Retrieves the unsolved problems of a given user.
 *
 * @param handle - The Codeforces account handle.
 * @returns A promise that resolves to the user's unsolved problem IDs.
 * @throws An error if the retrieval fails.
 */
const getUserUnsolvedProblems = async (handle: string): Promise<string[]> => {
	try {
		return await userProblemStatusRepository.getUserUnsolvedProblemsIds(handle)
	} catch (error) {
		console.error(`Failed to retrieve unsolved problems for ${handle}:`, error)
		throw new Error('Error retrieving user unsolved problems.')
	}
}

const userProblemStatusService: IUserProblemStatusService = {
	syncUserProblemsStatus,
	getUserProblemsStatus,
	getUserSolvedProblems,
	getUserUnsolvedProblems,
}
export default userProblemStatusService
