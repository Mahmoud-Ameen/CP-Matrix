import ProblemModel from '../models/problem.model.js'
import { IProblem, IProblemFilters, ProblemStatus } from '../types/shared.js'
import contestRepository from './contest.repository.js'
import { IProblemRepository } from './interfaces/IProblemRepository.js'
import userProblemStatusRepository from './userProblemStatus.repository.js'

const MIN_PROBLEM_RATING = 800
const MAX_PROBLEM_RATING = 3500

/**
 * Fetch problems from database based on the passed query, sorted by contestId in descending order, and paginated
 */
const getFilteredProblems = async (
	filters: IProblemFilters,
	page: number,
	limit: number
): Promise<{ count: number; problems: IProblem[] }> => {
	try {
		const query = await generateQueryFromFilters(filters)
		let problems: IProblem[] = await ProblemModel.find(query)
			.select(['contestId', 'index', 'name', 'tags', 'rating', 'division', 'problemId', '-_id'])
			.sort({ contestId: -1 })
			.lean()

		// Handle filtering by status (i.e. solved, attempted, or new)
		if (filters.codeforcesHandle && filters.status)
			problems = await filterProblemsByStatus(filters.codeforcesHandle, filters.status, problems)

		// Handle pagination
		const problemsCount = problems.length
		const startIndex = (page - 1) * limit
		problems = problems.slice(startIndex, startIndex + limit)

		return { count: problemsCount, problems }
	} catch (error) {
		console.error('Error fetching filtered problems:', error)
		throw new Error('Failed to fetch filtered problems')
	}
}
const filterProblemsByStatus = async (handle: string, status: string, problems: IProblem[]): Promise<IProblem[]> => {
	try {
		if (status === ProblemStatus.SOLVED) {
			const solvedProblems = new Set(await userProblemStatusRepository.getUserSolvedProblemsIds(handle))
			problems = problems.filter((problem) => solvedProblems.has(problem.problemId))
		} else if (status === ProblemStatus.ATTEMPTED) {
			const attemptedProblems = new Set(await userProblemStatusRepository.getUserUnsolvedProblemsIds(handle))
			problems = problems.filter((problem) => attemptedProblems.has(problem.problemId))
		} else if (status === ProblemStatus.NEW) {
			const userProblemStatus = await userProblemStatusRepository.getUserProblemsStatus(handle)
			const oldProblems = new Set(userProblemStatus.map((status) => status.problemId))
			problems = problems.filter((problem) => !oldProblems.has(problem.problemId))
		}
		return problems
	} catch (error) {
		throw error
	}
}

/**
 * Helper function to generate a MongoDB query from the given problem filters.
 *
 * @param filters - The filters to apply to the query.
 * @return A MongoDB query object.
 */
const generateQueryFromFilters = async (filters: IProblemFilters) => {
	const { tags, divisions, minRating, maxRating } = filters

	// Array to hold conditions for db query
	const queryConditions: any[] = []

	// Handle divisions filter
	if (divisions) {
		const divisionConditions = await generateDivisionsQuery(divisions)
		queryConditions.push(divisionConditions)
	}

	// Handle tags filter
	if (tags && tags.length > 0) {
		const tagsConditions = await generateTagsQuery(tags)
		queryConditions.push(tagsConditions)
	}

	// Handle rating range filter
	if ((minRating && minRating > MIN_PROBLEM_RATING) || (maxRating && maxRating < MAX_PROBLEM_RATING)) {
		const ratingConditions: any = { $ne: null }

		if (minRating) ratingConditions.$gte = Number(minRating)
		if (maxRating) ratingConditions.$lte = Number(maxRating)

		queryConditions.push({ rating: ratingConditions })
	}

	// Combine queries using $and so that every condition (filter) must apply
	const combinedQuery = queryConditions.length > 0 ? { $and: queryConditions } : {}
	return combinedQuery
}

/**
 * Helper function to create query conditions based on specified divisions
 * @param divisions object where keys are division names and values are arrays of problem indexes
 */
const generateDivisionsQuery = async (divisions: string[]) => {
	if (!divisions) return {}

	const formattedDivisions: Record<string, string[]> = {}
	divisions.forEach((div) => {
		const division = div.slice(0, div.indexOf(':'))
		const index = div.slice(div.indexOf(':' + 1))

		if (!Object.hasOwn(formattedDivisions, division)) formattedDivisions[division] = []
		formattedDivisions[division].push(index)
	})

	const divisionsQuery = []

	for (const division in formattedDivisions) {
		const indexes = formattedDivisions[division]
		// Subtasks of a problem are considered part of the same problem
		// e.g. Div2C1 and Div2C2 are considered Div2C
		indexes.forEach((index) => indexes.push(index + '1', index + '2'))

		const contestsIds = await contestRepository.getDistinctContestIdsByDivision(division)
		divisionsQuery.push({
			contestId: { $in: contestsIds },
			index: { $in: indexes },
		})
	}

	// combine division queries using or operator
	// i.e. we want problems that belong to any of the specified divisions
	if (divisionsQuery.length > 0) return { $or: divisionsQuery }

	return {}
}

/**
 * Helper function to create query conditions based on tags
 * parsedTags: array of problem tags e.g. ["math","geometry"]
 */
const generateTagsQuery = async (parsedTags: string[]) => {
	if (!Array.isArray(parsedTags) || parsedTags.length == 0) return {}

	const combinedCondition = parsedTags.map((tag) => ({ tags: tag }))

	return combinedCondition.length > 0 ? { $or: combinedCondition } : {}
}

/**
 * Counts number of problems in db that match the query
 * @param filters object containing query filters
 * @returns number of problems that match the query
 * @throws error if query fails
 */
const countProblems = async (filters: IProblemFilters): Promise<number> => {
	try {
		const query = await generateQueryFromFilters(filters)
		let problems = await ProblemModel.find(query).select(['-_id', 'problemId']).lean()

		// Handle filtering by status (i.e. solved, attempted, or new)
		if (filters.codeforcesHandle && filters.status) {
			if (filters.status === ProblemStatus.SOLVED) {
				const solvedProblems = new Set(
					await userProblemStatusRepository.getUserSolvedProblemsIds(filters.codeforcesHandle)
				)
				problems = problems.filter((problem) => solvedProblems.has(problem.problemId))
			} else if (filters.status === ProblemStatus.ATTEMPTED) {
				const attemptedProblems = new Set(
					await userProblemStatusRepository.getUserUnsolvedProblemsIds(filters.codeforcesHandle)
				)
				problems = problems.filter((problem) => attemptedProblems.has(problem.problemId))
			} else if (filters.status === ProblemStatus.NEW) {
				const userProblemStatus = await userProblemStatusRepository.getUserProblemsStatus(
					filters.codeforcesHandle
				)
				const oldProblems = new Set(userProblemStatus.map((status) => status.problemId))
				problems = problems.filter((problem) => !oldProblems.has(problem.problemId))
			}
		}
		return problems.length
	} catch (error) {
		console.error('Error fetching filtered problems:', error)
		throw new Error('Failed to fetch filtered problems')
	}
}

const getProblemsTags = async () => {
	const tags = [
		'2-sat',
		'binary search',
		'bitmasks',
		'brute force',
		'chinese remainder theorem',
		'constructive algorithms',
		'data structures',
		'dfs and similar',
		'divide and conquer',
		'dp',
		'dsu',
		'expression parsing',
		'fft',
		'flows',
		'games',
		'geometry',
		'graph matchings',
		'graphs',
		'greedy',
		'hashing',
		'implementation',
		'interactive',
		'math',
		'matrices',
		'meet-in-the-middle',
		'number theory',
		'probabilities',
		'schedules',
		'shortest paths',
		'sortings',
		'string suffix structures',
		'strings',
		'ternary search',
		'trees',
		'two pointers',
	]

	return tags
}

const problemRepository: IProblemRepository = {
	getFilteredProblems: getFilteredProblems,
	countProblems,
	getProblemsTags,
}
export default problemRepository
