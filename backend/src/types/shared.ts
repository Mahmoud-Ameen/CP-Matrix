export type AuthenticatedUser = {
	name: string
	picture: string
	email: string
	user_id: string
	auth_time: number
}

export type IProblem = {
	problemId: string
	title?: string // Title of the problem.
	difficulty?: number // Difficulty rating of the problem.
	tags?: string[] // Tags associated with the problem.
	division?: string[] // Divisions in which the problem appears.

	[key: string]: any
}
/**
 * Filters used when querying for problems.
 */
export type IProblemFilters = {
	tags?: string[]
	minRating?: number
	maxRating?: number
	divisions?: string[]
	codeforcesHandle?: string
	status?: ProblemStatus
}

/**
 * Represents the status of a problem for a specific Codeforces account.
 */
export type IUserProblemStatus = {
	problemId: string
	codeforcesHandle: string
	status: ProblemStatus
}

export type ICFAccountInfo = {
	codeforcesHandle: string
	lastProcessedSubmissionId: number
}

/**
 * Enum representing the possible statuses of a problem for a user.
 */
export enum ProblemStatus {
	SOLVED = 'solved',
	ATTEMPTED = 'attempted',
	NEW = 'new',
}
