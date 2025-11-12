
import React from 'react';
import type { ProcessedHourlyData } from '../types';

interface ComparisonSummaryProps {
  data: ProcessedHourlyData[];
}

const ComparisonSummary: React.FC<ComparisonSummaryProps> = ({ data }) => {
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);

  const findClosestDataPoint = (targetTime: Date, dataPoints: ProcessedHourlyData[]): ProcessedHourlyData | null => {
    let closest: ProcessedHourlyData | null = null;
    let minDiff = Infinity;
    for (const point of dataPoints) {
      const diff = Math.abs(point.time.getTime() - targetTime.getTime());
      if (diff < minDiff) {
        minDiff = diff;
        closest = point;
      }
    }
    return closest;
  };

  const todayData = data.filter(d => d.time.getDate() === now.getDate());
  const yesterdayData = data.filter(d => d.time.getDate() === yesterday.getDate());

  const currentPoint = findClosestDataPoint(now, todayData);
  const yesterdayPoint = findClosestDataPoint(yesterday, yesterdayData);

  if (!currentPoint || !yesterdayPoint) {
    return (
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg text-center">
        <p>十分なデータがありません。</p>
      </div>
    );
  }

  const tempDiff = currentPoint.temperature - yesterdayPoint.temperature;
  const diffText = tempDiff.toFixed(1);
  const diffColor = tempDiff > 0 ? 'text-red-500' : tempDiff < 0 ? 'text-blue-500' : 'text-gray-500';
  
  let summaryText = '';
  if (Math.abs(tempDiff) < 1) {
    summaryText = '昨日と同じくらいの気温です。';
  } else if (tempDiff > 0) {
    summaryText = `昨日より暑く感じられそうです。`;
  } else {
    summaryText = `昨日より涼しく感じられそうです。`;
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg text-center">
      <p className="text-lg text-gray-600 dark:text-gray-400">
        昨日の{now.getHours()}時頃 ({yesterdayPoint.temperature.toFixed(1)}°C) と比べて...
      </p>
      <p className="text-5xl font-bold my-2">
        <span className={diffColor}>
          {tempDiff > 0 ? '+' : ''}{diffText}°C
        </span>
      </p>
      <p className="text-xl text-gray-800 dark:text-gray-200">{summaryText}</p>
    </div>
  );
};

export default ComparisonSummary;
