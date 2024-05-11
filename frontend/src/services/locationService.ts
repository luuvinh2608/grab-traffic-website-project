// locationService.ts
import axios from 'axios'
import FormData from 'form-data'

const API_BASE_URL: string = import.meta.env.VITE_API_BASE_URL || ''

export interface LocationService {
  getAllLocations(): Promise<Location[]>
  searchLocationByName(request: LocationRequest): Promise<Location[]>
  autofillLocationByName(request: LocationRequest): Promise<Location[]>
  getNearbyLocations(request: LocationRequest): Promise<Location[]>
}

export const locationService: LocationService = {
  async getAllLocations(): Promise<Location[]> {
    try {
      const url: string = `${API_BASE_URL}/location/all`
      const response = await axios.get<LocationResponse>(url)
      return response.data.locations
    } catch (error: unknown) {
      throw new Error(`Failed to get all locations: ${(error as Error).message}`)
    }
  },

  async searchLocationByName(request: LocationRequest): Promise<Location[]> {
    try {
      const url: string = `${API_BASE_URL}/location/name/search`
      const formData = new FormData()
      formData.append('keyword', request.keyword || '')

      const response = await axios.post<LocationResponse>(url, formData)
      return response.data.locations
    } catch (error: unknown) {
      throw new Error(`Failed to search locations by name: ${(error as Error).message}`)
    }
  },

  async autofillLocationByName(request: LocationRequest): Promise<Location[]> {
    try {
      const url: string = `${API_BASE_URL}/location/name/autofill`
      const formData = new FormData()
      formData.append('keyword', request.keyword || '')

      const response = await axios.post<LocationResponse>(url, formData)
      return response.data.locations
    } catch (error: unknown) {
      throw new Error(`Failed to autofill locations by name: ${(error as Error).message}`)
    }
  },

  async getNearbyLocations(request: LocationRequest): Promise<Location[]> {
    try {
      const url: string = `${API_BASE_URL}/location/nearby`
      const formData = new FormData()
      formData.append('id', request.id?.toString() ?? '')
      formData.append('radius', request.radius)
      formData.append('number', request.number)

      const response = await axios.post<LocationResponse>(url, formData)
      return response.data.locations
    } catch (error: unknown) {
      throw new Error(`Failed to get nearby locations: ${(error as Error).message}`)
    }
  }
}
