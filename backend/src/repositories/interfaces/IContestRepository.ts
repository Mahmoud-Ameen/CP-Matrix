/**
 * Interface defining the methods for interacting with contest data in the repository.
 * This interface serves as a code contract between the contests service and repository layers.
 * It abstracts the underlying data storage mechanism, making it easy to
 * switch between different database implementations or data sources without affecting
 * the service layer.
 */
export interface IContestRepository {
	/**
	 * Retrieves a list of distinct IDs of contest of a specific division.
	 *
	 * @param division - The division to filter contests by, e.g., "Div1", "Div2".
	 * @returns A promise that resolves to an array of unique contest IDs
	 *          associated with the specified division.
	 */
	getDistinctContestIdsByDivision(division: string): Promise<number[]>
}
