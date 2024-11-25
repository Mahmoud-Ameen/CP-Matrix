import { ZodError } from 'zod'

export interface ApiResponse<T> {
	success: boolean
	data?: T
	error?: {
		code: string
		message: string
		details?: any
	}
	meta?: {
		page?: number
		limit?: number
		total?: number
	}
}

export const successResponse = <T>(data: T, meta?: ApiResponse<T>['meta']): ApiResponse<T> => ({
	success: true,
	data,
	meta,
})

export const errorResponse = (code: string, message: string, details?: any): ApiResponse<never> => ({
	success: false,
	error: {
		code,
		message,
		details,
	},
})

export const handleZodError = (error: ZodError): ApiResponse<never> => ({
	success: false,
	error: {
		code: 'VALIDATION_ERROR',
		message: 'Invalid input parameters',
		details: error.errors.map((err) => ({
			path: err.path.join('.'),
			message: err.message,
		})),
	},
})
