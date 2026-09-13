import React from 'react';
import { motion } from 'framer-motion';
import { WeatherData } from '../types';

interface HeroWeatherProps {
  data: WeatherData;
  convertTemp: (t: number) => number;
  unit: 'C' | 'F';
}

export const HeroWeather: React.FC<HeroWeatherProps> = ({ data, convertTemp }) => {
  return (
    <div className="flex flex-col gap-6 mt-8 md:mt-12 px-4 md:px-8 relative z-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        
        {/* Large Temperature & High/Low */}
        <motion.div 
          initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 1, delay: 0.2, type: "spring", stiffness: 50 }}
          className="flex items-start gap-6"
        >
          <h1 className="text-8xl md:text-[160px] leading-none font-extralight tracking-tighter flex drop-shadow-2xl">
            {convertTemp(data.temp)}
            <span className="text-5xl md:text-7xl mt-4 font-thin text-white/70">°</span>
          </h1>
          
          <div className="flex flex-col justify-center gap-2 mt-4 md:mt-12 bg-black/20 backdrop-blur-xl rounded-2xl p-4 border border-white/10 shadow-2xl hover:bg-white/10 transition-colors">
            <div className="flex items-center gap-4 text-sm md:text-base font-medium">
              <span className="text-white/40">H</span>
              <span className="text-white drop-shadow-md">{convertTemp(data.daily[0].high)}°</span>
            </div>
            <div className="w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
            <div className="flex items-center gap-4 text-sm md:text-base font-medium">
              <span className="text-white/40">L</span>
              <span className="text-white drop-shadow-md">{convertTemp(data.daily[0].low)}°</span>
            </div>
          </div>
        </motion.div>

        {/* Info Text */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="max-w-xs md:text-right flex flex-col md:items-end gap-4"
        >
          <p className="text-sm md:text-base text-white/70 leading-relaxed bg-black/20 backdrop-blur-md p-5 rounded-3xl border border-white/5 shadow-2xl">
            With real-time API data and advanced tracking, we provide reliable atmospheric forecasts for any location worldwide.
          </p>
        </motion.div>
      </div>

      {/* Main Condition Text */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="mt-4 md:mt-8"
      >
        <h2 className="text-4xl md:text-6xl lg:text-7xl font-light tracking-tight text-white/90 max-w-3xl leading-[1.1] drop-shadow-lg">
          {data.summary.split('. ')[0]}
        </h2>
      </motion.div>
    </div>
  );
};
