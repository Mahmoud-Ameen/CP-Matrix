import { Request, Response } from 'express'
import problemService from '../services/problem.service.js'
import { IProblemFilters } from '../types/shared.js'

// Utility to parse and extract query parameters into a filters object
const parseProblemFilters = (query: any): IProblemFilters => {
	const divisions: string[] = query.divisions ? JSON.parse(query.divisions) : []
	const tags: string[] = query.tags ? JSON.parse(query.tags) : []
	const minRating = query.minrating ? Number(query.minrating) : undefined
	const maxRating = query.maxrating ? Number(query.maxrating) : undefined

	return {
		divisions,
		tags,
		minRating,
		maxRating,
		codeforcesHandle: query.codeforcesHandle,
		status: query.status,
	}
}

const getProblemsHandler = async (req: Request<{}, {}, {}, any>, res: Response) => {
	try {
		// Parse and extract query params
		const filters = parseProblemFilters(req.query)
		const page = req.query.page ? Number(req.query.page) : 1
		const rowsPerPage = req.query.rowsPerPage ? Number(req.query.rowsPerPage) : 20

		// User Problems service to get filtered problems and return them
		const data = await problemService.getFilteredProblems(filters, page, rowsPerPage)
		const problems = data.problems
		const totalProblemsCount = data.count
		res.json({
			totalProblemsCount,
			problems,
		})
	} catch (error) {
		console.error(error)
		res.status(500).json({ error: 'Failed to fetch problems' })
	}
}

const getTagsHandler = (req: Request, res: Response) => {
	try {
		const tags = problemService.getProblemsTags()
		res.json({ tags })
	} catch (error) {
		console.error(error)
		res.status(500).json({ error: 'Failed to fetch tags' })
	}
}

export default {
	getProblemsHandler,
	getTagsHandler,
}
