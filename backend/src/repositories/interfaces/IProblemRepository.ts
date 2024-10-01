import { IProblem, IProblemFilters } from '../../types/shared'

/**
 * Interface defining the methods for interacting with problem data in the repository.
 * This interface serves as a code contract between the problems service and repository layers.
 * It abstracts the underlying data storage mechanism, making it easy to
 * switch between different database implementations or data sources without affecting
 * the service layer.
 */
export interface IProblemRepository {
	/**
	 * Fetches a list of problems from the database based on the provided filters.
	 * The results are paginated and sorted by `contestId` in descending order.
	 *
	 * @param filters - An object containing various filters to apply, such as tags, divisions,
	 *                  and rating range. These filters are used to construct the query to
	 *                  retrieve problems that match the specified criteria.
	 * @param page - The page number to retrieve, used for pagination. It determines the offset
	 *               for the query results.
	 * @param limit - The maximum number of problems to return per page. This controls the size
	 *                of each paginated result set.
	 *
	 * @returns A promise that resolves to an object with two properties: `count` and `problems`.
	 *          The `count` property is the total number of problems that match the provided filters,
	 *          and the `problems` property is an array of `IProblem` objects matching the provided filters.
	 *          If no problems are found, the array will be empty.
	 *
	 * @throws Will throw an error if the query execution fails.
	 */
	getFilteredProblems(
		filters: IProblemFilters,
		page: number,
		limit: number
	): Promise<{ count: number; problems: IProblem[] }>

	/**
	 * Counts the number of problems in the database that match the given filters.
	 *
	 * @param filters - An object containing various filters such as tags, divisions,
	 *                  and rating range to apply when counting problems. These rilters
	 *                  are used to construct a query that identifies problems meeting
	 *                  the specified criteria.
	 *
	 * @returns A promise that resolves to the number of problems matching the provided filters.
	 *
	 * @throws Will throw an error if the query execution fails.
	 */
	countProblems(filters: IProblemFilters): Promise<number>

	/**
	 * Fetches a list of all available problem tags.
	 * @returns A promise that resolves to an array of strings representing all unique tags associated with problems.
	 */
	getProblemsTags(): Promise<string[]>
}
