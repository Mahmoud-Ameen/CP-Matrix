import { Router } from 'express'
import { registerOrUpdateUser } from '../controllers/user.controller.js'
import verifyFirebaseToken from '../middlewares/verifyFirebaseToken.middleware.js'

const router = Router()

router.post('/login', verifyFirebaseToken, registerOrUpdateUser)

export default router
