import AxiosHttpService from './AxiosHttpService'

export interface IRankingService {}

export class RankingService implements IRankingService {
  private axiosService = AxiosHttpService.getInstance()
  private static instance: RankingService

  private constructor() {}

  static getInstance(): RankingService {
    if (!RankingService.instance) {
      RankingService.instance = new RankingService()
    }
    return RankingService.instance
  }
}
