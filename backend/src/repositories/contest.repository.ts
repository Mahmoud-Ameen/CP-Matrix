import Contest from '../models/contest.model.js'
import { IContestRepository } from './interfaces/IContestRepository.js'

const findDistinctContestIdsByDivision = async (division: string): Promise<number[]> => {
	return Contest.find({ division }).distinct('id').exec()
}

const contestRepository: IContestRepository = {
	getDistinctContestIdsByDivision: findDistinctContestIdsByDivision,
}
export default contestRepository
