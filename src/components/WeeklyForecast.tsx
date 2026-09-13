import React from 'react';
import { motion } from 'framer-motion';
import { WeatherData } from '../types';
import { WeatherIcon } from './WeatherIcon';
import { Droplets } from 'lucide-react';
import { GlassCard } from './GlassCard';

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
            transition={{ duration: 0.4, delay: index * 0.05 }}
          >
            <GlassCard 
              intensity={index === 0 ? 'heavy' : 'light'}
              className={`flex flex-col items-center gap-4 p-5 min-w-[110px] sm:min-w-[130px] transition-all duration-300 hover:-translate-y-1 ${
                index === 0 ? 'border-white/20 shadow-[0_8px_32px_rgba(255,255,255,0.05)] ring-1 ring-white/10' : 'hover:border-white/20'
              }`}
            >
              <span className={`text-sm font-semibold tracking-wide ${index === 0 ? 'text-white' : 'text-white/70'}`}>
                {index === 0 ? 'Today' : index === 1 ? 'Tomorrow' : day.date.substring(0, 3)}
              </span>
              
              <div className="drop-shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                <WeatherIcon condition={day.condition} size={36} />
              </div>
              
              <div className="flex flex-col items-center gap-1.5 w-full mt-2">
                <div className="flex justify-between w-full text-sm">
                  <span className="text-white/40 font-medium">H</span>
                  <span className="font-semibold text-white">{convertTemp(day.high)}°</span>
                </div>
                <div className="flex justify-between w-full text-sm">
                  <span className="text-white/40 font-medium">L</span>
                  <span className="font-medium text-white/70">{convertTemp(day.low)}°</span>
                </div>
              </div>

              {day.rainProbability > 20 && (
                <div className="flex items-center justify-center gap-1.5 text-xs text-blue-300 font-semibold mt-2 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20 w-full">
                  <Droplets size={10} strokeWidth={3} />
                  <span>{day.rainProbability}%</span>
                </div>
              )}
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
