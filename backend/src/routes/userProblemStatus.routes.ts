import userProblemStatusController from '../controllers/userProblemStatus.controller.js'
import { Router } from 'express'

const router = Router()

/**
 * Fetches the problem status of a user based on their Codeforces handle.
 */
router.get('/', userProblemStatusController.getUserProblemStatus)

/**
 * Synchronizes the user's problem status by fetching new submissions from Codeforces.
 */
router.post('/sync', userProblemStatusController.syncUserProblemsStatus)

/**
 * Retrieves a list of problems that the user has attempted but not solved yet.
 */
router.get('/unsolved', userProblemStatusController.getUserUnsolvedProblems)

/**
 * Retrieves a list of problems that the user has solved.
 */
router.get('/solved', userProblemStatusController.getUserSolvedProblems)

export default router
