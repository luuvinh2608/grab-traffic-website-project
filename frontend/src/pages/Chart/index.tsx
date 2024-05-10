/* eslint-disable @typescript-eslint/no-unused-vars */
import { AutoComplete, Segmented } from 'antd'
import { Dayjs } from 'dayjs'
import { useState } from 'react'
import { CombineChart, DateInput, LocationList, StatisticPane } from './components'

import type { DatePickerProps } from 'antd'
import type { RangeValue, CalendarChangeProps } from './components'

const mockVal = (str: string, repeat: number = 1) => ({
  value: str.repeat(repeat)
})

export const ChartPage = () => {
  const [location, setLocation] = useState<string>('')
  const [startDate, setStartDate] = useState<Dayjs | null>(null)
  const [endDate, setEndDate] = useState<Dayjs | null>(null)
  const [options, setOptions] = useState<{ value: string }[]>([])
  const [isWeekly, setIsWeekly] = useState<boolean>(false)

  const getPanelValue = (searchText: string) =>
    !searchText ? [] : [mockVal(searchText), mockVal(searchText, 2), mockVal(searchText, 3)]

  const onChange = (data: string) => {
    setLocation(data)
  }

  const disableDate: DatePickerProps['disabledDate'] = (current, { from }) => {
    if (from) {
      return Math.abs(current.diff(from, 'days')) > 7
    }
    return false
  }

  const handleChangeRange: CalendarChangeProps = (selectedDates, _, __) => {
    const dates = selectedDates as RangeValue
    if (dates) {
      setStartDate(dates[0])
      setEndDate(dates[1])
    }
  }
  const handleChangeDate: CalendarChangeProps = (date, _, __) => {
    if (date) {
      setStartDate(date as Dayjs)
      setEndDate(date as Dayjs)
    }
  }

  return (
    <div className="container grid h-full w-full grid-cols-1 gap-4 py-2 md:grid-cols-12">
      {/* Input section */}
      <div className="col-span-full flex flex-col items-center justify-between gap-2 md:flex-row md:gap-0 md:space-x-4">
        <AutoComplete
          options={options}
          className="w-full"
          onSearch={(searchText) => setOptions(getPanelValue(searchText))}
          onChange={onChange}
          placeholder="Enter location"
        />
        <DateInput
          className="w-full"
          isWeekly={isWeekly}
          onChange={isWeekly ? handleChangeRange : handleChangeDate}
          disableDate={disableDate}
        />
        <Segmented
          className="self-auto "
          options={['Daily', 'Weekly']}
          value={isWeekly ? 'Weekly' : 'Daily'}
          onChange={(value) => setIsWeekly(value === 'Weekly')}
        />
      </div>
      {/* Chart and statistics section */}
      <div className="col-span-full grid grid-cols-1 gap-4 md:grid-cols-12">
        <div className="grid grid-cols-1 gap-4 md:col-span-12 md:grid-cols-12">
          <CombineChart />
          <StatisticPane className="border-1 col-span-1 rounded-md border border-gray-200 p-8 md:col-span-4" />
        </div>
        <LocationList />
      </div>
    </div>
  )
}
