import { WeatherData, WeatherCondition } from '../types';

// Map Open-Meteo WMO weather codes to our conditions
const mapWeatherCode = (code: number, isDay: boolean): WeatherCondition => {
  if (code === 0) return isDay ? 'Sunny' : 'Clear Night';
  if (code === 1 || code === 2) return isDay ? 'Partly Cloudy' : 'Clear Night';
  if (code === 3) return 'Cloudy';
  if ([45, 48].includes(code)) return 'Cloudy'; // Fog
  if ([51, 53, 55, 56, 57].includes(code)) return 'Rain'; // Drizzle
  if ([61, 63, 65, 66, 67].includes(code)) return 'Rain';
  if ([71, 73, 75, 77, 85, 86].includes(code)) return 'Snow';
  if ([80, 81, 82].includes(code)) return 'Rain'; // Showers
  if ([95, 96, 99].includes(code)) return 'Storm';
  return isDay ? 'Sunny' : 'Clear Night';
};

const getWindDirection = (degrees: number): string => {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  return directions[Math.round(degrees / 45) % 8];
};

export const fetchWeatherData = async (lat: number, lon: number, city: string, country: string): Promise<WeatherData> => {
  try {
    const [weatherRes, aqiRes] = await Promise.all([
      fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,pressure_msl,wind_speed_10m,wind_direction_10m,visibility&hourly=temperature_2m,precipitation_probability,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_probability_max&timezone=auto`),
      fetch(`https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=us_aqi,pm10,pm2_5,nitrogen_dioxide&timezone=auto`)
    ]);

    const weather = await weatherRes.json();
    const aqi = await aqiRes.json();

    const isDay = weather.current.is_day === 1;
    const currentCondition = mapWeatherCode(weather.current.weather_code, isDay);

    // Format hourly data (next 24 hours)
    const currentHourIndex = new Date().getHours();
    const hourly = [];
    for (let i = 0; i < 24; i += 3) { // Skip every 3 hours for cleaner graph
      const timeDate = new Date(weather.hourly.time[i]);
      hourly.push({
        time: i === 0 ? 'Now' : timeDate.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true }),
        condition: mapWeatherCode(weather.hourly.weather_code[i], true), // approximation
        temp: Math.round(weather.hourly.temperature_2m[i]),
        rainProbability: weather.hourly.precipitation_probability[i] || 0
      });
    }

    // Format daily data (next 7 days)
    const daily = weather.daily.time.map((timeStr: string, index: number) => {
      const date = new Date(timeStr);
      return {
        date: date.toLocaleDateString('en-US', { weekday: 'short' }),
        condition: mapWeatherCode(weather.daily.weather_code[index], true),
        high: Math.round(weather.daily.temperature_2m_max[index]),
        low: Math.round(weather.daily.temperature_2m_min[index]),
        rainProbability: weather.daily.precipitation_probability_max[index] || 0
      };
    }).slice(0, 7);

    // Sunrise / Sunset formatting
    const formatTime = (isoString: string) => new Date(isoString).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

    // Determine AQI Status
    const aqiVal = aqi.current?.us_aqi || 20;
    let aqiStatus = 'Good';
    if (aqiVal > 50) aqiStatus = 'Moderate';
    if (aqiVal > 100) aqiStatus = 'Unhealthy';
    if (aqiVal > 200) aqiStatus = 'Hazardous';

    // Generate a contextual summary
    let summary = `Expect ${currentCondition.toLowerCase()} conditions today.`;
    if (currentCondition === 'Rain' || currentCondition === 'Storm') summary = `Rainy conditions expected. Don't forget your umbrella.`;
    if (currentCondition === 'Sunny' && weather.current.temperature_2m > 30) summary = `Hot and sunny. Stay hydrated!`;

    return {
      city,
      country,
      condition: currentCondition,
      temp: Math.round(weather.current.temperature_2m),
      feelsLike: Math.round(weather.current.apparent_temperature),
      humidity: Math.round(weather.current.relative_humidity_2m),
      windSpeed: Math.round(weather.current.wind_speed_10m),
      windDirection: getWindDirection(weather.current.wind_direction_10m),
      visibility: parseFloat((weather.current.visibility / 1000).toFixed(1)) || 10,
      uvIndex: Math.round(weather.daily.uv_index_max[0] || 0),
      pressure: Math.round(weather.current.pressure_msl),
      sunrise: formatTime(weather.daily.sunrise[0]),
      sunset: formatTime(weather.daily.sunset[0]),
      aqi: {
        value: aqiVal,
        status: aqiStatus,
        pm25: Math.round(aqi.current?.pm2_5 || 0),
        pm10: Math.round(aqi.current?.pm10 || 0),
        no2: Math.round(aqi.current?.nitrogen_dioxide || 0)
      },
      hourly: hourly.slice(0, 8), // Just 8 points for the chart
      daily,
      summary
    };

  } catch (error) {
    console.error("Error fetching weather data:", error);
    throw error;
  }
};
