import React from 'react';
import { Cloud, CloudDrizzle, CloudFog, CloudLightning, CloudMoon, CloudRain, CloudSnow, CloudSun, Moon, Sun } from 'lucide-react';
import { WeatherCondition } from '../types';

interface WeatherIconProps {
  condition: WeatherCondition;
  className?: string;
  size?: number;
}

export const WeatherIcon: React.FC<WeatherIconProps> = ({ condition, className = '', size = 24 }) => {
  switch (condition) {
    case 'Sunny':
      return <Sun className={`text-yellow-400 ${className}`} size={size} />;
    case 'Cloudy':
      return <Cloud className={`text-gray-300 ${className}`} size={size} />;
    case 'Partly Cloudy':
      return <CloudSun className={`text-gray-200 ${className}`} size={size} />;
    case 'Rain':
      return <CloudRain className={`text-blue-300 ${className}`} size={size} />;
    case 'Storm':
      return <CloudLightning className={`text-purple-300 ${className}`} size={size} />;
    case 'Snow':
      return <CloudSnow className={`text-cyan-200 ${className}`} size={size} />;
    case 'Clear Night':
      return <Moon className={`text-blue-100 ${className}`} size={size} />;
    default:
      return <Sun className={`text-yellow-400 ${className}`} size={size} />;
  }
};
