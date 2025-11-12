
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { LOCATIONS } from './constants';
import type { Location, ProcessedHourlyData, WeatherData } from './types';
import { fetchWeatherData } from './services/weatherService';
import LocationSelector from './components/LocationSelector';
import ComparisonSummary from './components/ComparisonSummary';
import WeatherTable from './components/WeatherTable';
import TemperatureChart from './components/TemperatureChart';

const LoadingSpinner: React.FC = () => (
  <div className="flex justify-center items-center h-64">
    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

const ErrorMessage: React.FC<{ message: string }> = ({ message }) => (
  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative" role="alert">
    <strong className="font-bold">Error:</strong>
    <span className="block sm:inline ml-2">{message}</span>
  </div>
);

export default function App() {
  const [selectedLocation, setSelectedLocation] = useState<Location>(LOCATIONS[0]);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const processApiData = (data: any): WeatherData => {
    const now = new Date();
    const hourlyData: ProcessedHourlyData[] = data.hourly.time.map((timeStr: string, index: number) => {
      const time = new Date(timeStr);
      return {
        time,
        temperature: data.hourly.temperature_2m[index],
        weatherCode: data.hourly.weathercode[index],
        isForecast: time > now,
      };
    });
    return { hourly: hourlyData };
  };

  const loadWeatherData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchWeatherData(selectedLocation.latitude, selectedLocation.longitude);
      const processedData = processApiData(data);
      setWeatherData(processedData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setLoading(false);
    }
  }, [selectedLocation]);

  useEffect(() => {
    loadWeatherData();
  }, [loadWeatherData]);

  const groupedData = useMemo(() => {
    if (!weatherData) return [];
    
    const groups: { [key: string]: ProcessedHourlyData[] } = {};
    weatherData.hourly.forEach(item => {
      const dateKey = item.time.toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' });
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(item);
    });
    
    return Object.entries(groups).map(([date, hourly]) => ({ date, hourly }));
  }, [weatherData]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 p-4 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
            天気比較
          </h1>
          <LocationSelector
            locations={LOCATIONS}
            selectedLocation={selectedLocation}
            onLocationChange={setSelectedLocation}
          />
        </header>

        <main>
          {loading ? (
            <LoadingSpinner />
          ) : error ? (
            <ErrorMessage message={error} />
          ) : weatherData ? (
            <div className="space-y-8">
              <ComparisonSummary data={weatherData.hourly} />
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                 <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">気温推移グラフ</h2>
                 <TemperatureChart data={weatherData.hourly} />
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">時間ごとデータ</h2>
                <WeatherTable data={groupedData} />
              </div>
            </div>
          ) : null}
        </main>
      </div>
    </div>
  );
}
