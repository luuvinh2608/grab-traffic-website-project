import { fakerVI } from '@faker-js/faker'
import { useEffect, useState } from 'react'
import { RankingBoard } from './RankingBoard'

const rankingData = Array.from({ length: fakerVI.number.int({ min: 10, max: 20 }) }, () => ({
  location: fakerVI.location.city(),
  value: fakerVI.number.int({ min: 0, max: 100 })
}))

const rankingOptions = {
  title: 'Change Ranking',
  columns: [
    { title: 'Location', key: 'location' as keyof Ranking },
    { title: 'Average Traffic', key: 'value' as keyof Ranking }
  ],
  color: [
    { range: [0, 10] as [number, number], color: '#7ABA78' },
    { range: [11, 20] as [number, number], color: '#FEB941' },
    { range: [21, 30] as [number, number], color: '#F97300' },
    { range: [31, 40] as [number, number], color: '#C40C0C' },
    { range: [41, 50] as [number, number], color: '#8644A2' },
    { range: [51, 9999] as [number, number], color: '#32012F' }
  ]
}

export const ChangeRanking = () => {
  const [data, setData] = useState<Ranking[]>(rankingData)

  useEffect(() => {
    const interval = setInterval(() => {
      setData((data) => {
        const newData = data.map((item) => ({
          ...item,
          value: item.value + fakerVI.number.int({ min: -1, max: 1 }) * fakerVI.number.int({ min: 1, max: 10 })
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
