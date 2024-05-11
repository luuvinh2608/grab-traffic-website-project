/* eslint-disable no-console */
'use client'
import { useEffect, useState } from 'react'
import { trafficAirDataService } from '../../services/trafficAirDataService'

export const TestPage = () => {
  const [error, setError] = useState<string>('')

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const data = await trafficAirDataService.getWeeklyData({ id: '24', date: '2024-05-10' })
        console.log(data)
      } catch (error: unknown) {
        console.log(error)
        if (error instanceof Error) {
          setError(error.message)
        } else {
          setError('Error fetching locations')
        }
      }
    }

    fetchLocations()
  }, [])

  if (error) {
    return <div>Error: {error}</div>
  }

  return <div>Test</div>
}