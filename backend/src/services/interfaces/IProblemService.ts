import { IProblem, IProblemFilters } from '../../types/shared'

/**
 * Interface for problem-related business logic service.
 * This Interface serves as an informal code contract between the problems controller and the service layer.
 */
export interface IProblemService {
	/**
	 * Retrieves a list of problems filtered based on the specified filters.
	 *
	 * @param filters - An object containing filtering options such as tags, ratings, divisions, etc.
	 * @param page - The page number to retrieve, used for pagination.
	 * @param rowsPerPage - The maximum number of problems to return per page.
	 * @returns A promise that resolves to an object of two properties: `count` and `problems`.
	 * The `count` property is the total number of problems that match the provided filters,
	 * and the `problems` property is an array of `IProblem` objects matching the provided filters and paginated.
	 */
	getFilteredProblems(
		filters: IProblemFilters,
		page: number,
		rowsPerPage: number
	): Promise<{ count: number; problems: IProblem[] }>

	/**
	 * Retrieves a list of all available problem tags.
	 *
	 * @returns A promise that resolves to an array of strings representing all unique tags associated with problems.
	 */
	getProblemsTags(): Promise<string[]>
}
