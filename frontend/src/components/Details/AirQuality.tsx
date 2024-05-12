import { useAppSelector } from 'libs/redux'

export const AirQuality = () => {
  const airData = useAppSelector((state) => state.data.currentAirData)

  return (
    <div className="flex flex-col rounded-md bg-green-500 p-4 text-white">
      <div className="flex items-end justify-center align-bottom">
        <h4 className="text-7xl font-semibold">
          {airData.air_quality}
          <span className="text-xl font-light">AQI</span>
        </h4>
      </div>
      <div className="mx-20 flex flex-row items-center justify-center gap-4 rounded-md bg-white p-2 text-green-700">
        <p className="text-base font-semibold">PM2.5</p>
        <p className="text-base">11.9µg/m³</p>
      </div>
    </div>
  )
}
