import { DatePicker, DatePickerProps } from 'antd'
import dayjs from 'libs/utils/dayjsConfig'
import type { Dayjs } from 'dayjs'
import type { BaseInfo } from 'rc-picker/lib/interface'

const { RangePicker } = DatePicker
const dateFormat = 'DD/MM/YYYY'
export type RangeValue = [Dayjs | null, Dayjs | null] | null
export type CalendarChangeProps = (
  dates: RangeValue | Dayjs | Dayjs[],
  dateStrings: [string, string] | string | string[],
  info: BaseInfo
) => void
interface DateInputProps {
  className?: string
  isWeekly: boolean
  onChange: CalendarChangeProps
  disableDate: DatePickerProps['disabledDate']
}

export const DateInput: React.FC<DateInputProps> = ({ className, isWeekly, onChange, disableDate }: DateInputProps) => {
  return isWeekly ? (
    <RangePicker
      className={className ?? ''}
      format={dateFormat}
      onCalendarChange={onChange}
      disabledDate={disableDate}
      maxDate={dayjs().add(7, 'day')}
    />
  ) : (
    <DatePicker
      className={className ?? ''}
      format={dateFormat}
      onCalendarChange={onChange}
      disabledDate={disableDate}
      maxDate={dayjs().add(7, 'day')}
    />
  )
}
