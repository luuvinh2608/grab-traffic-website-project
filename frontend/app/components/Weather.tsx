import { FaCloud, FaWind } from 'react-icons/fa';
import { FaC, FaGaugeHigh } from 'react-icons/fa6';
import { WiHumidity } from 'react-icons/wi';

interface ItemProps {
  leadingIcon?: React.ReactNode;
  title: string;
  value: string;
  unit: string;
}

const Item: React.FC<ItemProps> = ({ leadingIcon, title, value, unit }) => (
  <div className="flex flex-row items-center justify-between p-2">
    <div className="flex flex-row items-center gap-2">
      {leadingIcon}
      <p className="text-base font-semibold">{title}</p>
    </div>
    <p className="text-base">
      <span className="font-bold">{value}</span> <span>{unit}</span>
    </p>
  </div>
);

export const Weather = () => (
  <div className="flex flex-col rounded-md border-2 border-gray-200 p-4">
    <Item title={'33°C'} value={'Cloudy'} unit={''} />
    <Item
      title={'Humidity'}
      value={'50'}
      unit={'%'}
      leadingIcon={<WiHumidity className="text-xl" />}
    />
    <Item
      title={'Wind'}
      value={'10'}
      unit={'km/h'}
      leadingIcon={<FaWind className="text-xl" />}
    />
    <Item
      title={'Pressure'}
      value={'1013'}
      unit={'hPa'}
      leadingIcon={<FaGaugeHigh className="text-xl" />}
    />
  </div>
);
