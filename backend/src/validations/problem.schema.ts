import { z } from 'zod'
import { ProblemStatus } from '../types/shared.js'

// Constants for validation
const RATING_MIN = 800
const RATING_MAX = 3500
const PAGE_MIN = 1
const PAGE_MAX = 1000
const PAGE_DEFAULT = 1
const LIMIT_MIN = 1
const LIMIT_MAX = 500
const LIMIT_DEFAULT = 25

const DIVISION_REGEX = /^div[1-4][A-H]$/

export const problemQuerySchema = z
	.preprocess(
		(obj: any) => ({
			...obj,
			// Convert string numbers to numbers before validation
			minRating: obj && 'minRating' in obj ? Number(obj.minRating as string) : undefined,
			maxRating: obj && 'maxRating' in obj ? Number(obj.maxRating as string) : undefined,
			page: obj && 'page' in obj ? Number(obj.page as string) : PAGE_DEFAULT,
			limit: obj && 'limit' in obj ? Number(obj.limit as string) : LIMIT_DEFAULT,

			// ignore empty strings
			divisions: obj && obj.divisions !== '' ? obj.divisions : undefined,
			codeforcesHandle: obj && obj.codeforcesHandle !== '' ? obj.codeforcesHandle : undefined,
		}),
		z.object({
			divisions: z
				.string()
				.transform((val) => val.split(','))
				.refine((divisions) => divisions.every((div) => DIVISION_REGEX.test(div)), {
					message: 'Invalid division format. Expected format: div[1-4][A-H]',
				})
				.optional(),

			tags: z
				.string()
				.transform((val) => val.split(','))
				.optional(),

			minRating: z
				.number()
				.refine((val) => val >= RATING_MIN && val <= RATING_MAX, {
					message: `Must be between ${RATING_MIN} and ${RATING_MAX}`,
				})
				.optional(),

			maxRating: z
				.number()
				.refine((val) => val >= RATING_MIN && val <= RATING_MAX, {
					message: `Must be between ${RATING_MIN} and ${RATING_MAX}`,
				})
				.optional(),

			codeforcesHandle: z.string().min(1, 'Handle cannot be empty').max(50, 'Handle too long').optional(),

			status: z.enum([ProblemStatus.SOLVED, ProblemStatus.ATTEMPTED, ProblemStatus.NEW, 'all']).optional(),

			page: z
				.number()
				.refine((val) => val >= PAGE_MIN && val <= PAGE_MAX, {
					message: `Must be between ${PAGE_MIN} and ${PAGE_MAX}`,
				})
				.default(PAGE_DEFAULT),

			limit: z
				.number()
				.refine((val) => val >= LIMIT_MIN && val <= LIMIT_MAX, {
					message: `Must be between ${LIMIT_MIN} and ${LIMIT_MAX}`,
				})
				.default(LIMIT_DEFAULT),
		})
	)
	.superRefine((data, ctx) => {
		if (data.minRating && data.maxRating && data.minRating > data.maxRating) {
			ctx.addIssue({
				code: 'custom',
				message: 'minRating must be less than or equal to maxRating',
				path: ['minRating', 'maxRating'],
			})
		}

		if (data.status && data.status !== 'all' && !data.codeforcesHandle) {
			ctx.addIssue({
				code: 'custom',
				message: 'codeforcesHandle is required when status is provided',
				path: ['codeforcesHandle'],
			})
		}
	})
