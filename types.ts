
export interface Location {
  name: string;
  latitude: number;
  longitude: number;
}

export interface ProcessedHourlyData {
  time: Date;
  temperature: number;
  weatherCode: number;
  isForecast: boolean;
}

export interface WeatherData {
  hourly: ProcessedHourlyData[];
}

export interface GroupedWeatherData {
    date: string;
    hourly: ProcessedHourlyData[];
}
