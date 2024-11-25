import { Request, Response, NextFunction } from 'express'
import { AnyZodObject, ZodEffects, ZodError } from 'zod'

export const validateRequest =
	(schema: AnyZodObject | ZodEffects<any>) => async (req: Request, res: Response, next: NextFunction) => {
		try {
			await schema.parseAsync(req.query)
			next()
		} catch (error) {
			if (!(error instanceof ZodError)) {
				return res.status(500).json({
					error: {
						code: 'INTERNAL_ERROR',
						message: 'An unexpected error occurred',
					},
				})
			}

			return res.status(400).json({
				error: {
					code: 'VALIDATION_ERROR',
					message: 'Invalid request parameters',
					details: {
						errors: error.errors.map((err) => ({
							parameter: err.path.join('.'),
							message: err.message,
							...(err.code === 'invalid_enum_value' && {
								allowedValues: err.options,
							}),
						})),
					},
				},
			})
		}
	}
