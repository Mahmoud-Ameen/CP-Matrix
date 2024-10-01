// repositories
import problemRepository from '../repositories/problem.repository.js'
import userProblemStatusRepository from '../repositories/userProblemStatus.repository.js'

// interfaces and types
import { IProblem, IProblemFilters, ProblemStatus } from '../types/shared.js'
import { IProblemService } from './interfaces/IProblemService.js'

/**
 * Retrieves filtered problems from the repository and annotates them
 * with user-specific problem statuses if a Codeforces handle is provided.
 *
 * @param filters - An object containing filtering options for problems.
 * @param page - The page number for pagination.
 * @param rowsPerPage - The maximum number of problems to return per page.
 * @returns A promise that resolves to an object containing the total problem count and the list of problems.
 */
const getFilteredProblems = async (
	filters: IProblemFilters,
	page: number,
	rowsPerPage: number
): Promise<{ count: number; problems: IProblem[] }> => {
	try {
		// Fetch problems from the database
		const data = await problemRepository.getFilteredProblems(filters, page, rowsPerPage)

		if (!filters.codeforcesHandle || data.problems.length === 0) {
			return data
		}

		// Fetch user problem statuses if handle is provided
		const problemsStatusMap = await userProblemStatusRepository.getUserProblemsStatusMap(filters.codeforcesHandle)

		// Annotate problems with their respective status
		data.problems.forEach((problem) => {
			problem.status = problemsStatusMap.get(problem.problemId) || ProblemStatus.NEW
		})

		return data
	} catch (error: any) {
		console.error(`Failed to get filtered problems: ${error.message}`)
		throw new Error('Error occurred while retrieving filtered problems.')
	}
}

/**
 * Retrieves all available problem tags.
 *
 * @returns A promise that resolves to an array of strings representing all unique problem tags.
 */
const getProblemsTags = async (): Promise<string[]> => {
	try {
		return await problemRepository.getProblemsTags()
	} catch (error: any) {
		console.error(`Failed to get problem tags: ${error.message}`)
		throw new Error('Error occurred while retrieving problem tags.')
	}
}

// Export the service as an implementation of the IProblemService interface
const problemsService: IProblemService = {
	getFilteredProblems,
	getProblemsTags,
}

export default problemsService
