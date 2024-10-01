import { Router } from 'express'
import problemController from '../controllers/problem.controller.js'

const router = Router()
/**
 * Get a list of problems with optional filters and pagination.
 */

router.get('/', problemController.getProblemsHandler)

/**
 *  Returns A list of tags
 * */
router.get('/tags', problemController.getTagsHandler)

export default router
