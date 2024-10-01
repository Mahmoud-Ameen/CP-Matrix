import { Request, Response, NextFunction } from 'express'

interface CustomRequest extends Request {
	startTime?: number
}
const timingMiddleware = (req: CustomRequest, res: Response, next: NextFunction): void => {
	req.startTime = Date.now() // Record start time
	console.log('-------------------------------------------')
	console.log(`Request to ${req.originalUrl} started`)

	// Save the original 'end' method
	const originalEnd = res.end

	// Override 'end' to log the duration and call the original method
	res.end = function (...args: any[]) {
		const duration = Date.now() - (req.startTime as number) // Calculate duration

		console.log(`Request to ${req.originalUrl} took ${duration}ms`)

		res.end = originalEnd // Restore original end function
		return res.end(...args) // Call original end function
	}

	next() // Call next middleware
}

export default timingMiddleware
