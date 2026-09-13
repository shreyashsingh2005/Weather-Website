import React from 'react';
import { motion } from 'framer-motion';
import { WeatherData } from '../types';
import { WeatherIcon } from './WeatherIcon';
import { Droplets } from 'lucide-react';

interface HourlyForecastProps {
  data: WeatherData;
  convertTemp: (t: number) => number;
}

export const HourlyForecast: React.FC<HourlyForecastProps> = ({ data, convertTemp }) => {
  return (
    <div className="w-full overflow-x-auto hide-scrollbar pb-4 -mx-4 px-4 md:mx-0 md:px-0">
      <div className="flex gap-4 min-w-max">
        {data.hourly.map((hour, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            className={`flex flex-col items-center gap-3 p-4 rounded-3xl min-w-[90px] border ${
              index === 0 
                ? 'bg-white/20 border-white/30 shadow-[0_0_20px_rgba(255,255,255,0.1)]' 
                : 'bg-black/20 border-white/10 hover:bg-white/10'
            } transition-colors backdrop-blur-md`}
          >
            <span className={`text-sm ${index === 0 ? 'text-white font-medium' : 'text-white/60'}`}>
              {hour.time}
            </span>
            <WeatherIcon condition={hour.condition} size={28} />
            <span className="text-xl font-medium">{convertTemp(hour.temp)}°</span>
            {hour.rainProbability > 0 && (
              <div className="flex items-center gap-1 text-xs text-blue-300 font-medium">
                <Droplets size={12} />
                <span>{hour.rainProbability}%</span>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};
