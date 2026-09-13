import React from 'react';
import { motion } from 'framer-motion';
import { WeatherData } from '../types';
import { WeatherIcon } from './WeatherIcon';
import { Droplets } from 'lucide-react';
import { GlassCard } from './GlassCard';

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
          >
            <GlassCard
               intensity={index === 0 ? 'heavy' : 'light'}
               className={`flex flex-col items-center gap-3 p-4 min-w-[90px] transition-all duration-300 hover:-translate-y-1 ${
                  index === 0 ? 'border-white/20 shadow-[0_8px_32px_rgba(255,255,255,0.05)] ring-1 ring-white/10' : 'hover:border-white/20'
               }`}
            >
              <span className={`text-xs uppercase tracking-wider font-semibold ${index === 0 ? 'text-white' : 'text-white/60'}`}>
                {hour.time}
              </span>
              
              <div className="drop-shadow-md my-1 group-hover:scale-110 transition-transform duration-300">
                <WeatherIcon condition={hour.condition} size={28} />
              </div>
              
              <span className="text-xl font-light text-white">{convertTemp(hour.temp)}°</span>
              
              {hour.rainProbability > 0 && (
                <div className="flex items-center gap-1 text-[10px] text-blue-300 font-bold mt-1 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20">
                  <Droplets size={10} strokeWidth={3} />
                  <span>{hour.rainProbability}%</span>
                </div>
              )}
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
