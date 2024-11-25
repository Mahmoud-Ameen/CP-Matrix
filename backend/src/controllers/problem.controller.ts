import { Request, Response } from 'express'
import problemService from '../services/problem.service.js'
import { IProblemFilters } from '../types/shared.js'
import { successResponse, errorResponse } from '../utils/apiResponse.js'

// Utility to parse and extract query parameters into a filters object
const parseProblemFilters = (query: any): IProblemFilters => {
	const divisions: string[] = query.divisions ? query.divisions.split(',') : []
	const tags: string[] = query.tags ? query.tags.split(',') : []
	const minRating = query.minRating ? Number(query.minRating) : undefined
	const maxRating = query.maxRating ? Number(query.maxRating) : undefined
	const codeforcesHandle = query.codeforcesHandle?.toLowerCase() || undefined
	const status = query.status || undefined

	return {
		divisions,
		tags,
		minRating,
		maxRating,
		codeforcesHandle,
		status,
	}
}

const getProblemsHandler = async (req: Request<{}, {}, {}, any>, res: Response) => {
	try {
		// Parse and extract query params
		const filters = parseProblemFilters(req.query)
		const page = req.query.page ? Number(req.query.page) : 1
		const rowsPerPage = req.query.limit ? Number(req.query.limit) : 20

		const data = await problemService.getFilteredProblems(filters, page, rowsPerPage)

		res.json(
			successResponse(
				{ problems: data.problems },
				{
					page,
					limit: rowsPerPage,
					total: data.count,
				}
			)
		)
	} catch (error) {
		console.error(error)
		res.status(500).json(errorResponse('INTERNAL_ERROR', 'Failed to fetch problems'))
	}
}

const getTagsHandler = async (req: Request, res: Response) => {
	try {
		const tags = await problemService.getProblemsTags()
		res.json(successResponse({ tags }))
	} catch (error) {
		console.error(error)
		res.status(500).json(errorResponse('INTERNAL_ERROR', 'Failed to fetch tags'))
	}
}

export default {
	getProblemsHandler,
	getTagsHandler,
}
