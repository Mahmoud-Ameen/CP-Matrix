import userProblemStatusService from '../services/userProblemStatus.service.js'
import { Request, Response } from 'express'
import { successResponse, errorResponse } from '../utils/apiResponse.js'

// Helper function for extracting and validating codeforcesHandle
const extractCodeforcesHandle = (req: Request): string => {
	const codeforcesHandle = req.query.codeforcesHandle as string
	if (!codeforcesHandle) {
		throw new Error('Codeforces handle is required')
	}
	return codeforcesHandle
}

/**
 * Retrieves the problem status for a specific user.
 */
const getUserProblemStatus = async (req: Request, res: Response) => {
	try {
		const codeforcesHandle = extractCodeforcesHandle(req)
		const userProblemStatus = await userProblemStatusService.getUserProblemsStatus(codeforcesHandle)
		res.json(successResponse({ problems: userProblemStatus }, { total: userProblemStatus.length }))
	} catch (error: any) {
		console.error(error)
		res.status(500).json(errorResponse('INTERNAL_ERROR', error.message || 'Failed to fetch user problem status'))
	}
}

/**
 * Synchronizes the user's problem status by fetching new submissions from the Codeforces API and updating the database.
 */
const syncUserProblemsStatus = async (req: Request, res: Response) => {
	try {
		const codeforcesHandle = extractCodeforcesHandle(req)
		await userProblemStatusService.syncUserProblemsStatus(codeforcesHandle)
		res.json(
			successResponse({
				message: 'Successfully synced user problem status',
			})
		)
	} catch (error: any) {
		console.error(error)
		res.status(500).json(errorResponse('INTERNAL_ERROR', error.message || 'Failed to sync user problem status'))
	}
}

/**
 * Retrieves the list of problems solved by the user.
 */
const getUserSolvedProblems = async (req: Request, res: Response) => {
	try {
		const codeforcesHandle = extractCodeforcesHandle(req)
		const userSolvedProblems = await userProblemStatusService.getUserSolvedProblems(codeforcesHandle)
		res.json(successResponse({ problems: userSolvedProblems }, { total: userSolvedProblems.length }))
	} catch (error: any) {
		console.error(error)
		res.status(500).json(errorResponse('INTERNAL_ERROR', error.message || 'Failed to fetch user solved problems'))
	}
}

/**
 * Retrieves the list of problems attempted but not solved by the user.
 */
const getUserUnsolvedProblems = async (req: Request, res: Response) => {
	try {
		const codeforcesHandle = extractCodeforcesHandle(req)
		const userUnsolvedProblems = await userProblemStatusService.getUserUnsolvedProblems(codeforcesHandle)
		res.json(successResponse({ problems: userUnsolvedProblems }, { total: userUnsolvedProblems.length }))
	} catch (error: any) {
		console.error(error)
		res.status(500).json(errorResponse('INTERNAL_ERROR', error.message || 'Failed to fetch user unsolved problems'))
	}
}

export default {
	getUserProblemStatus,
	syncUserProblemsStatus,
	getUserSolvedProblems,
	getUserUnsolvedProblems,
}
