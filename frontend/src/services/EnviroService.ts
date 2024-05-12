import AxiosHttpService from './AxiosHttpService'

export interface IEnviroService {
  getCurrentData(request: TrafficAirDataRequest): Promise<TrafficAirData>
  getDailyData(request: TrafficAirDataRequest): Promise<TrafficAirData[]>
  getWeeklyData(request: TrafficAirDataRequest): Promise<TrafficAirData[]>
}

export class EnviroService implements IEnviroService {
  private axiosService = AxiosHttpService.getInstance()
  private static instance: EnviroService
  private constructor() {}

  static getInstance(): EnviroService {
    if (!EnviroService.instance) {
      EnviroService.instance = new EnviroService()
    }
    return EnviroService.instance
  }

  async getCurrentData(request: TrafficAirDataRequest): Promise<TrafficAirData> {
    try {
      const response = await this.axiosService.get<TrafficAirDataResponse>(`/data/current/locationID=${request.id}`)
      return {
        air_data: response.air_data,
        traffic_data: response.traffic_data
      }
    } catch (error) {
      console.error('Error fetching traffic and air data:', error)
      throw error
    }
  }

  async getDailyData(request: TrafficAirDataRequest): Promise<TrafficAirData[]> {
    try {
      const response = await this.axiosService.get<TrafficAirDataResponse>(
        `/data/daily/locationID=${request.id}&date=${request.date}`
      )
      const finalData: TrafficAirData[] = response.traffic_data_hour
        ?.map((trafficData: TrafficData, index: number) => {
          const airData = response.air_data_hour?.[index]
          if (airData) {
            return {
              air_data: airData,
              traffic_data: trafficData
            }
          }
        })
        .filter(Boolean) as TrafficAirData[]
      return finalData
    } catch (error) {
      console.error('Error fetching traffic and air data daily:', error)
      throw error
    }
  }

  async getWeeklyData(request: TrafficAirDataRequest): Promise<TrafficAirData[]> {
    try {
      const response = await this.axiosService.get<TrafficAirDataResponse>(
        `/data/weekly/locationID=${request.id}&date=${request.date}`
      )
      const finalData: TrafficAirData[] = response.traffic_data_day
        ?.map((trafficData: TrafficData, index: number) => {
          const airData = response.air_data_day?.[index]
          if (airData) {
            return {
              air_data: airData,
              traffic_data: trafficData
            }
          }
        })
        .filter(Boolean) as TrafficAirData[]
      return finalData
    } catch (error) {
      console.error('Error fetching traffic and air data daily:', error)
      throw error
    }
  }
}
