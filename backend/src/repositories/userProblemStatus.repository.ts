import userProblemStatusModel from '../models/userProblemStatus.model.js'
import { IUserProblemStatus, ProblemStatus } from '../types/shared.js'
import { IUserProblemStatusRepository } from './interfaces/IUserProblemStatusRepository.js'

/**
 * Fetches problems statuses of a given codeforces handle
 * @param codeforcesHandle codeforces account handle
 * @returns array of UserProblemStatus
 * @throws error on internal errors
 */
const findUserProblemsStatus = async (codeforcesHandle: string): Promise<IUserProblemStatus[]> => {
	try {
		const data = await userProblemStatusModel
			.find({ codeforcesHandle })
			.select(['problemId', 'codeforcesHandle', 'status'])
			.lean()
		return data
	} catch (error) {
		throw new Error('Error fetching data from database')
	}
}
const getUserProblemsStatusMap = async (codeforcesHandle: string): Promise<Map<string, string>> => {
	try {
		const data = await findUserProblemsStatus(codeforcesHandle)
		const map = new Map()
		data.forEach(({ problemId, status }) => map.set(problemId, status))
		return map
	} catch (error) {
		throw new Error('Error fetching data from database')
	}
}
/**
 * Gets ids of attempted-but-not-solved problems by a codeforces user
 * @param codeforcesHandle
 * @returns List of unsolved problem ids
 * @remarks This function retreives problems from database. For up-to-date data, consider calling syncUserProblemsStatus first.
 */
const findUserUnsolvedProblemIds = async (codeforcesHandle: string): Promise<string[]> => {
	try {
		const data = await userProblemStatusModel
			.find({ codeforcesHandle, status: ProblemStatus.ATTEMPTED })
			.select(['problemId'])
			.lean()

		return data.map((problem) => problem.problemId)
	} catch (error) {
		throw new Error('Error fetching data from database')
	}
}
/**
 * Gets ids of problems solved by a codeforces user
 * @param codeforcesHandle
 * @returns List of solved problem ids
 * @remarks This function retreives problems from database. For up-to-date data, consider calling syncUserProblemsStatus first.
 */
const findUserSolvedProblemIds = async (codeforcesHandle: string): Promise<string[]> => {
	try {
		const data = await userProblemStatusModel
			.find({ codeforcesHandle, status: ProblemStatus.SOLVED })
			.select(['problemId'])
			.lean()
		return data.map((problem) => problem.problemId)
	} catch (error) {
		throw new Error('Error fetching data from database')
	}
}
/**
 * Inserts problem statuses to the database
 */
const insertUserProblemStatuses = async (userProblemsStatuses: IUserProblemStatus[]): Promise<void> => {
	try {
		console.log(`inserting ${userProblemsStatuses.length} docs`)
		await userProblemStatusModel.insertMany(userProblemsStatuses, { ordered: false })
	} catch (error: any) {
		if (error.code === 11000) {
			console.log('data already exists')
		} else {
			console.error(error)
			throw new Error('Error inserting data')
		}
	}
}
/**
 * Updates status of problems that exist in the databse as solved
 */
const updateProblemsAsSolved = async (problemIds: string[], codeforcesHandle: string) => {
	try {
		await userProblemStatusModel.updateMany(
			{ codeforcesHandle, problemId: { $in: problemIds } },
			{ status: ProblemStatus.SOLVED }
		)
	} catch (error) {
		throw new Error('Error updating data')
	}
}

const userProblemStatusRepository: IUserProblemStatusRepository = {
	getUserProblemsStatus: findUserProblemsStatus,
	getUserProblemsStatusMap,
	insertUserProblemsStatus: insertUserProblemStatuses,
	getUserUnsolvedProblemsIds: findUserUnsolvedProblemIds,
	updateProblemsAsSolved,
	getUserSolvedProblemsIds: findUserSolvedProblemIds,
}

export default userProblemStatusRepository
