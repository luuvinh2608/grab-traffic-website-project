import axios from 'axios'

const API_BASE_URL: string = import.meta.env.VITE_API_BASE_URL || ''

export interface TrafficAirDataService {
  getCurrentData(request: TrafficAirDataRequest): Promise<TrafficAirData>
  getDailyData(request: TrafficAirDataRequest): Promise<TrafficAirData[]>
  getWeeklyData(request: TrafficAirDataRequest): Promise<TrafficAirData[]>
}

export const trafficAirDataService: TrafficAirDataService = {
  async getCurrentData(request: TrafficAirDataRequest): Promise<TrafficAirData> {
    try {
      const url: string = `${API_BASE_URL}/data/current/locationID=${request.id}`
      const response = await axios.get<TrafficAirDataResponse>(url)
      const finalData: TrafficAirData = {
        air_data: response.data.air_data,
        traffic_data: response.data.traffic_data
      }
      return finalData
    } catch (error) {
      console.error('Error fetching traffic and air data:', error)
      throw error
    }
  },

  async getDailyData(request: TrafficAirDataRequest): Promise<TrafficAirData[]> {
    try {
      const url: string = `${API_BASE_URL}/data/daily`
      const formData = new FormData()
      formData.append('id', request.id || '')
      formData.append('date', request.date || '')

      const response = await axios.post<TrafficAirDataResponse>(url, formData)

      const finalData: TrafficAirData[] = response.data.traffic_data_hour
        ?.map((trafficData: TrafficData, index: number) => {
          const airData = response.data.air_data_hour?.[index]
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
  },

  async getWeeklyData(request: TrafficAirDataRequest): Promise<TrafficAirData[]> {
    try {
      const url: string = `${API_BASE_URL}/data/weekly`
      const formData = new FormData()
      formData.append('id', request.id || '')
      formData.append('date', request.date || '')

      const response = await axios.post<TrafficAirDataResponse>(url, formData)

      const finalData: TrafficAirData[] = response.data.traffic_data_day
        ?.map((trafficData: TrafficData, index: number) => {
          const airData = response.data.air_data_day?.[index]
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
