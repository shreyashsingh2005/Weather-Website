export type WeatherCondition = 'Sunny' | 'Cloudy' | 'Partly Cloudy' | 'Rain' | 'Storm' | 'Snow' | 'Clear Night';

export interface DailyForecast {
  date: string;
  condition: WeatherCondition;
  high: number;
  low: number;
  rainProbability: number;
}

export interface HourlyForecast {
  time: string;
  condition: WeatherCondition;
  temp: number;
  rainProbability: number;
}

export interface WeatherData {
  city: string;
  country: string;
  condition: WeatherCondition;
  temp: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  windDirection: string;
  visibility: number;
  uvIndex: number;
  pressure: number;
  sunrise: string;
  sunset: string;
  aqi: {
    value: number;
    status: string;
    pm25: number;
    pm10: number;
    no2: number;
  };
  hourly: HourlyForecast[];
  daily: DailyForecast[];
  summary: string;
}
