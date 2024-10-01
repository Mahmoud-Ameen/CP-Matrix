// Libraries
import express, { json } from 'express'
import cors from 'cors'
import compression from 'compression'

// Config files
import { connectToDatabase, disconnectFromDatabase } from './config/db.js'

// Route files
import problemRoutes from './routes/problem.routes.js'
import userRoutes from './routes/user.routes.js'
import userProblemStatusRoutes from './routes/userProblemStatus.routes.js'

import timingMiddleware from './middlewares/timing.middleware.js'

const app = express()
const PORT = process.env.PORT || 3000

// Middlewares
app.use(json())
app.use(cors())
app.use(compression())
app.use(timingMiddleware)

// Routers
app.use('/api/problems', problemRoutes)
app.use('/api/users', userRoutes)
app.use('/api/userproblemstatus', userProblemStatusRoutes)

const startServer = async () => {
	try {
		await connectToDatabase()
		app.listen(PORT, () => {
			console.log(`Server running on http://localhost:${PORT}`)
		})
	} catch (error) {
		console.error('Failed to connect to the database:', error)
		process.exit(1)
	}
}

startServer()
