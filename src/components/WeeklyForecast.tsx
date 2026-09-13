import React from 'react';
import { motion } from 'framer-motion';
import { WeatherData } from '../types';
import { WeatherIcon } from './WeatherIcon';
import { GlassCard } from './GlassCard';
import { Droplets } from 'lucide-react';

interface WeeklyForecastProps {
  data: WeatherData;
  convertTemp: (t: number) => number;
}

export const WeeklyForecast: React.FC<WeeklyForecastProps> = ({ data, convertTemp }) => {
  return (
    <div className="w-full overflow-x-auto hide-scrollbar pb-4 -mx-4 px-4 md:mx-0 md:px-0">
      <div className="flex gap-4 min-w-max">
        {data.daily.map((day, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="flex flex-col items-center gap-3 p-5 rounded-3xl min-w-[120px] bg-black/20 border border-white/10 hover:bg-white/10 transition-colors backdrop-blur-md"
          >
            <span className={`text-sm font-medium ${index === 0 ? 'text-white' : 'text-white/80'}`}>
              {index === 0 ? 'Today' : index === 1 ? 'Tomorrow' : day.date.substring(0, 3)}
            </span>
            
            <WeatherIcon condition={day.condition} size={32} />
            
            <div className="flex flex-col items-center gap-1 w-full mt-2">
              <div className="flex justify-between w-full text-sm">
                <span className="text-white/60">H</span>
                <span className="font-medium text-white">{convertTemp(day.high)}°</span>
              </div>
              <div className="flex justify-between w-full text-sm">
                <span className="text-white/60">L</span>
                <span className="font-medium text-white/80">{convertTemp(day.low)}°</span>
              </div>
            </div>

            {day.rainProbability > 20 && (
              <div className="flex items-center gap-1 text-xs text-blue-300 font-medium mt-1">
                <Droplets size={12} />
                <span>{day.rainProbability}%</span>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};
