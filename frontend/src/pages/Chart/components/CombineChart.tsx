import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  LineElement,
  LineController,
  BarController,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { Chart } from 'react-chartjs-2'
import { faker } from '@faker-js/faker'
import dayjs from 'libs/utils/dayjsConfig'

ChartJS.register(
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  PointElement,
  BarElement,
  LineElement,
  LineController,
  BarController
)

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    mode: 'index' as const,
    intersect: false
  },
  stacked: true,
  plugins: {
    title: {
      display: true,
      text: 'Chart.js Line Chart'
    }
  }
}

const labels = Array.from({ length: 12 }, (_, i) => dayjs().subtract(i, 'month').format('MMM'))

export const data = {
  labels,
  datasets: [
    {
      type: 'line' as const,
      label: 'Dataset 1',
      borderColor: 'rgb(255, 99, 132)',
      borderWidth: 2,
      fill: false,
      data: labels.map(() => faker.number.int({ min: -1000, max: 1000 }))
    },
    {
      type: 'bar' as const,
      label: 'Dataset 2',
      backgroundColor: 'rgb(75, 192, 192)',
      data: labels.map(() => faker.number.int({ min: -1000, max: 1000 })),
      borderColor: 'white',
      borderWidth: 2
    },
    {
      type: 'bar' as const,
      label: 'Dataset 3',
      backgroundColor: 'rgb(53, 162, 235)',
      data: labels.map(() => faker.number.int({ min: -1000, max: 1000 }))
    }
  ]
}

export const CombineChart = () => (
  <div className="h-[20rem] w-full rounded-md border border-gray-200 md:col-span-8 md:h-[32rem]">
    <Chart type="bar" data={data} style={{ minWidth: '100%' }} options={chartOptions} />
  </div>
)
