
import React from 'react';

interface WeatherIconProps {
  code: number;
  className?: string;
}

const getWeatherInfo = (code: number): { icon: string; description: string } => {
  switch (code) {
    case 0: return { icon: '☀️', description: '晴れ' };
    case 1: return { icon: '🌤️', description: 'ほぼ晴れ' };
    case 2: return { icon: '🌥️', description: '一部曇り' };
    case 3: return { icon: '☁️', description: '曇り' };
    case 45:
    case 48: return { icon: '🌫️', description: '霧' };
    case 51:
    case 53:
    case 55: return { icon: '🌦️', description: '霧雨' };
    case 61:
    case 63:
    case 65: return { icon: '🌧️', description: '雨' };
    case 66:
    case 67: return { icon: '🌨️', description: 'みぞれ' };
    case 71:
    case 73:
    case 75: return { icon: '❄️', description: '雪' };
    case 77: return { icon: '🌨️', description: '霧雪' };
    case 80:
    case 81:
    case 82: return { icon: '🌦️', description: 'にわか雨' };
    case 85:
    case 86: return { icon: '❄️', description: 'にわか雪' };
    case 95:
    case 96:
    case 99: return { icon: '⛈️', description: '雷雨' };
    default: return { icon: '🌍', description: '不明' };
  }
};

const WeatherIcon: React.FC<WeatherIconProps> = ({ code, className = '' }) => {
  const { icon, description } = getWeatherInfo(code);
  return (
    <div className="flex flex-col items-center">
      <span className={`text-3xl ${className}`} title={description}>{icon}</span>
      <span className="text-xs text-gray-500 dark:text-gray-400">{description}</span>
    </div>
  );
};

export default WeatherIcon;
