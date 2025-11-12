import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { ProcessedHourlyData } from '../types';

interface TemperatureChartProps {
  data: ProcessedHourlyData[];
}

const TemperatureChart: React.FC<TemperatureChartProps> = ({ data }) => {
  const chartData = useMemo(() => {
    return data.map(item => {
      const date = item.time;
      const dayLabel = date.toLocaleDateString('ja-JP', { month: 'numeric', day: 'numeric' });
      const hour = date.getHours();
      return {
        time: item.time.getTime(),
        label: `${dayLabel} ${hour}:00`,
        actual: !item.isForecast ? item.temperature : null,
        forecast: item.isForecast ? item.temperature : null,
      };
    }).filter((_, index) => index % 3 === 0); // Display every 3 hours to prevent clutter
  }, [data]);

  const CustomTooltip: React.FC<any> = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const pointData = payload[0].payload;
      const temp = pointData.actual ?? pointData.forecast;

      if (temp === null || temp === undefined) {
        return null;
      }
      
      return (
        <div className="bg-white dark:bg-gray-700 p-2 border border-gray-200 dark:border-gray-600 rounded shadow-lg">
          <p className="label text-gray-800 dark:text-gray-200">{pointData.label}</p>
          <p className="intro text-blue-500">{`気温: ${temp.toFixed(1)}°C`}</p>
        </div>
      );
    }
    return null;
  };
  
  return (
    <div style={{ width: '100%', height: 400 }}>
      <ResponsiveContainer>
        <LineChart
          data={chartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
          <XAxis 
            dataKey="time" 
            tickFormatter={(unixTime) => {
              const date = new Date(unixTime);
              return `${date.getDate()}日${date.getHours()}時`;
            }}
            angle={-30}
            textAnchor="end"
            height={70}
            interval="preserveStartEnd"
            tick={{ fill: 'currentColor', fontSize: 12 }}
          />
          <YAxis 
            domain={['dataMin - 2', 'dataMax + 2']} 
            tickFormatter={(value) => `${value}°C`}
            tick={{ fill: 'currentColor', fontSize: 12 }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line
            type="monotone"
            dataKey="actual"
            name="実績"
            stroke="#10b981"
            strokeWidth={3}
            dot={{ r: 4 }}
            activeDot={{ r: 8 }}
            connectNulls={false}
          />
          <Line
            type="monotone"
            dataKey="forecast"
            name="予想"
            stroke="#3b82f6"
            strokeWidth={3}
            strokeDasharray="5 5"
            dot={{ r: 4 }}
            activeDot={{ r: 8 }}
            connectNulls={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TemperatureChart;
