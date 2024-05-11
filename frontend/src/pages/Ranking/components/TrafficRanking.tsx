import { fakerVI } from '@faker-js/faker'
import { RankingBoard } from './RankingBoard'
import { useEffect, useState } from 'react'

const rankingData = Array.from({ length: fakerVI.number.int({ min: 10, max: 20 }) }, () => ({
  location: fakerVI.location.city(),
  value: fakerVI.number.int({ min: 0, max: 1000 })
}))

const rankingOptions = {
  title: 'Traffic Ranking',
  columns: [
    { title: 'Location', key: 'location' as keyof Ranking },
    { title: 'Average Traffic', key: 'value' as keyof Ranking }
  ],
  color: [
    { range: [0, 100] as [number, number], color: '#7ABA78' },
    { range: [101, 200] as [number, number], color: '#FEB941' },
    { range: [201, 250] as [number, number], color: '#F97300' },
    { range: [251, 400] as [number, number], color: '#C40C0C' },
    { range: [401, 600] as [number, number], color: '#8644A2' },
    { range: [601, 9999] as [number, number], color: '#32012F' }
  ]
}

export const TrafficRanking = () => {
  const [data, setData] = useState<Ranking[]>(rankingData)

  useEffect(() => {
    const interval = setInterval(() => {
      setData((data) => {
        const newData = data.map((item) => ({
          ...item,
          value: item.value + fakerVI.number.int({ min: -1, max: 1 }) * fakerVI.number.int({ min: 50, max: 100 })
        }))
        return newData
      })
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="rounded-md border px-2">
      <RankingBoard ranking={data} options={rankingOptions} />
    </div>
  )
}
