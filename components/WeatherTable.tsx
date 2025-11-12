import React from 'react';
import type { GroupedWeatherData } from '../types';
import WeatherIcon from './WeatherIcon';

interface WeatherTableProps {
  data: GroupedWeatherData[];
}

const WeatherTable: React.FC<WeatherTableProps> = ({ data }) => {
  const getDayLabel = (date: Date) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);
      const dayBeforeYesterday = new Date(today);
      dayBeforeYesterday.setDate(today.getDate() - 2);
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);

      const compDate = new Date(date);
      compDate.setHours(0,0,0,0);

      if (compDate.getTime() === dayBeforeYesterday.getTime()) return '一昨日';
      if (compDate.getTime() === yesterday.getTime()) return '昨日';
      if (compDate.getTime() === today.getTime()) return '今日';
      if (compDate.getTime() === tomorrow.getTime()) return '明日';
      return date.toLocaleDateString('ja-JP', { weekday: 'short' });
  };

  const hours = Array.from({ length: 8 }, (_, i) => i * 3); // [0, 3, 6, ..., 21]

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="py-3 px-6 w-48">日時</th>
            {hours.map(hour => (
                <th key={hour} scope="col" className="py-3 px-6 text-center">
                    {hour}時
                </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map(({ date, hourly }, groupIndex) => {
            const displayDate = new Date(hourly[0].time);
            
            const hourlyDataForTable = hours.map(hour => {
                return hourly.find(h => h.time.getHours() === hour) || null;
            });

            return(
            <React.Fragment key={date}>
                <tr className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                    <td className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        {date} ({getDayLabel(displayDate)})
                    </td>
                    {hourlyDataForTable.map((item, index) => (
                        <td key={`${date}-weather-${index}`} className={`py-4 px-6 text-center ${item?.isForecast ? 'opacity-70' : ''}`}>
                            {item ? <WeatherIcon code={item.weatherCode} /> : <div className="h-12 flex items-center justify-center">-</div>}
                        </td>
                    ))}
                </tr>
                 <tr className={`bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-600 ${groupIndex < data.length - 1 ? 'border-b-4 border-gray-200 dark:border-gray-600' : 'border-b dark:border-gray-700'}`}>
                    <td className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        気温 (°C)
                    </td>
                    {hourlyDataForTable.map((item, index) => (
                        <td key={`${date}-temp-${index}`} className={`py-4 px-6 text-center text-lg font-semibold ${item?.isForecast ? 'text-gray-400 dark:text-gray-500' : 'text-gray-900 dark:text-white'}`}>
                            {item ? item.temperature.toFixed(1) : '-'}
                        </td>
                    ))}
                </tr>
            </React.Fragment>
          )})}
        </tbody>
      </table>
    </div>
  );
};

export default WeatherTable;
