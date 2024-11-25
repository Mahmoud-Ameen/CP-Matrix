import { Router } from 'express'
import problemController from '../controllers/problem.controller.js'
import { validateRequest } from '../middlewares/validateRequest.middleware.js'
import { problemQuerySchema } from '../validations/problem.schema.js'

const router = Router()
/**
 * Get a list of problems with optional filters and pagination.
 */

router.get('/', validateRequest(problemQuerySchema), problemController.getProblemsHandler)

/**
 *  Returns A list of tags
 * */
router.get('/tags', problemController.getTagsHandler)

export default router
