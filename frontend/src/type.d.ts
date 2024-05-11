interface Location {
  id: number
  place: string
  lat?: string
  long?: string
  request?: string
  distance?: number
}

interface LocationResponse {
  count: number
  time?: string
  keyword?: string
  param?: {
    radius: string
    number: string
  }
  center?: {
    id: number
    place: string
  }
  locations: Location[]
}

interface LocationRequest {
  id?: string
  keyword?: string
  radius?: string
  number?: string
}

interface TrafficData {
  day?: number
  hour?: number
  car: number
  bike: number
  truck: number
  bus: number
  person: number
  motorbike: number
  count?: number
  traffic_quality?: number
  trafic_quality_index?: number
}

interface AirData {
  day?: number
  hour?: number
  co: number
  no: number
  no2: number
  o3: number
  so2: number
  pm2_5: number
  pm10: number
  nh3: number
  count?: number
  air_quality?: number
  air_quality_index?: number
}

interface TrafficAirData {
  traffic_data?: TrafficData
  air_data?: AirData
}

interface TrafficAirDataResponse {
  id: number
  name: string
  lat: string
  long: string
  time?: string
  date?: string
  request: string
  traffic_data?: TrafficData
  air_data?: AirData
  traffic_data_hour?: TrafficData[]
  air_data_hour?: AirData[]
  traffic_data_day?: TrafficData[]
  air_data_day?: AirData[]
}

interface TrafficAirDataRequest {
  id?: string
  date?: string
}
type Ranking<T = number> = {
  location: string
  value: T
}
