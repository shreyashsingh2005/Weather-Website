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
    <div className="flex flex-col gap-6 mt-4 sm:mt-8 relative z-10 w-full min-w-0 px-2 sm:px-4">
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-8 w-full min-w-0">
        
        {/* Large Temperature & High/Low */}
        <motion.div 
          initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 1, delay: 0.2, type: "spring", stiffness: 50 }}
          className="flex items-start gap-4 sm:gap-6"
        >
          {/* Fluid typography using clamp to fit 320px up to 4K safely */}
          <h1 className="text-[clamp(5rem,20vw,11rem)] leading-none font-extralight tracking-tighter flex drop-shadow-2xl">
            {convertTemp(data.temp)}
            <span className="text-[clamp(2rem,6vw,4rem)] font-light mt-2 sm:mt-4 text-white/60">°</span>
          </h1>
          
          <div className="flex flex-col justify-center gap-2 mt-2 sm:mt-6 bg-black/20 backdrop-blur-xl rounded-2xl p-3 sm:p-4 border border-white/10 shadow-2xl hover:bg-white/10 transition-colors">
            <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-base font-medium">
              <span className="text-white/40">H</span>
              <span className="text-white drop-shadow-md">{convertTemp(data.daily[0].high)}°</span>
            </div>
            <div className="w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
            <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-base font-medium">
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
          className="max-w-xs xl:text-right flex flex-col xl:items-end gap-4"
        >
          <p className="text-sm sm:text-base text-white/70 leading-relaxed bg-black/20 backdrop-blur-md p-4 sm:p-5 rounded-3xl border border-white/5 shadow-2xl">
            With real-time API data and advanced tracking, we provide reliable atmospheric forecasts for any location worldwide.
          </p>
        </motion.div>
      </div>

      {/* Main Condition Text */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="mt-2 sm:mt-4 w-full min-w-0"
      >
        <h2 className="text-[clamp(2.5rem,8vw,5rem)] font-light tracking-tight text-white/90 max-w-3xl leading-[1.1] drop-shadow-lg break-words hyphens-auto">
          {data.condition} conditions expected
        </h2>
        <p className="text-[clamp(1rem,3vw,1.5rem)] text-white/60 font-light max-w-2xl mt-2 break-words">
          Feels like {convertTemp(data.feelsLike)}°. {data.summary}
        </p>
      </motion.div>
    </div>
  );
};
