import React from 'react';
import { motion } from 'framer-motion';
import { WeatherData } from '../types';
import { GlassCard } from './GlassCard';
import { Droplets, Wind, Sun, Eye, Gauge, Sunrise, Activity, Navigation, ArrowDown } from 'lucide-react';

interface WeatherDetailsProps {
  data: WeatherData;
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 100 } }
};

export const WeatherDetails: React.FC<WeatherDetailsProps> = ({ data }) => {
  // Helpers for visual indicators
  const uvPercentage = Math.min((data.uvIndex / 11) * 100, 100);
  const uvColor = data.uvIndex <= 2 ? '#4ade80' : data.uvIndex <= 5 ? '#facc15' : data.uvIndex <= 7 ? '#f97316' : '#ef4444';
  
  const humidityHeight = `${data.humidity}%`;
  
  // Wind direction rotation (N=0, E=90, S=180, W=270)
  const dirMap: Record<string, number> = { 'N': 0, 'NE': 45, 'E': 90, 'SE': 135, 'S': 180, 'SW': 225, 'W': 270, 'NW': 315 };
  const windRotation = dirMap[data.windDirection] || 0;

  return (
    <div className="flex flex-col gap-6 mt-6">
      <h3 className="text-xs uppercase tracking-[0.2em] text-white/40 font-semibold px-2">Weather Details</h3>
      
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6"
      >
        {/* AQI Premium Card */}
        <motion.div variants={itemVariants} className="col-span-2 md:col-span-2 xl:col-span-2 h-full">
          <GlassCard className="p-8 h-full relative overflow-hidden flex flex-col md:flex-row items-center gap-8 group transition-all hover:bg-white/[0.05]">
            <div className="flex-1 w-full z-10">
              <div className="flex items-center gap-2 text-white/50 mb-4">
                <Activity size={16} className="text-green-400" />
                <span className="text-xs font-semibold uppercase tracking-widest">Air Quality</span>
              </div>
              <div className="text-6xl font-extralight tracking-tighter mb-1 text-white group-hover:scale-[1.02] transition-transform origin-left">{data.aqi.value}</div>
              <div className="text-lg font-medium text-green-400">{data.aqi.status}</div>
              
              <div className="flex gap-8 mt-8 w-full border-t border-white/10 pt-6">
                <div className="flex flex-col">
                  <span className="text-[10px] text-white/40 mb-1 tracking-wider uppercase font-semibold">PM2.5</span>
                  <span className="text-base font-medium">{data.aqi.pm25} <span className="text-[10px] text-white/30 font-normal">µg/m³</span></span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-white/40 mb-1 tracking-wider uppercase font-semibold">PM10</span>
                  <span className="text-base font-medium">{data.aqi.pm10} <span className="text-[10px] text-white/30 font-normal">µg/m³</span></span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-white/40 mb-1 tracking-wider uppercase font-semibold">NO2</span>
                  <span className="text-base font-medium">{data.aqi.no2} <span className="text-[10px] text-white/30 font-normal">µg/m³</span></span>
                </div>
              </div>
            </div>
            
            {/* Elegant Circular Progress */}
            <div className="relative w-40 h-40 shrink-0 z-10 flex items-center justify-center">
               <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full transform -rotate-90 drop-shadow-2xl">
                 <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="6" />
                 <motion.circle 
                   cx="50" 
                   cy="50" 
                   r="42" 
                   fill="none" 
                   stroke="url(#aqiGradient)" 
                   strokeWidth="6"
                   strokeDasharray="263.89"
                   initial={{ strokeDashoffset: 263.89 }}
                   animate={{ strokeDashoffset: 263.89 - (263.89 * Math.min(data.aqi.value, 150)) / 150 }}
                   transition={{ duration: 1.5, ease: "easeOut" }}
                   strokeLinecap="round"
                 />
                 <defs>
                   <linearGradient id="aqiGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                     <stop offset="0%" stopColor="#4ade80" />
                     <stop offset="50%" stopColor="#facc15" />
                     <stop offset="100%" stopColor="#ef4444" />
                   </linearGradient>
                 </defs>
               </svg>
               <div className="flex items-center justify-center flex-col">
                 <span className="text-[10px] text-white/40 uppercase font-semibold tracking-widest">Index</span>
                 <span className="text-2xl font-light text-white">{data.aqi.value}</span>
               </div>
            </div>
            
            {/* Ambient Glow */}
            <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-green-500/10 blur-[100px] rounded-full pointer-events-none group-hover:bg-green-500/20 transition-colors duration-700" />
          </GlassCard>
        </motion.div>

        {/* Humidity Card */}
        <motion.div variants={itemVariants} className="h-full">
          <GlassCard className="p-6 h-full flex flex-col justify-between hover:bg-white/[0.05] transition-all duration-300 group">
            <div className="flex items-center gap-2 text-white/50 mb-6 group-hover:text-white/80 transition-colors">
              <Droplets size={16} />
              <span className="text-xs font-semibold uppercase tracking-widest">Humidity</span>
            </div>
            <div className="flex justify-between items-end">
              <div>
                <div className="text-4xl font-extralight mb-2 text-white">{data.humidity}<span className="text-2xl text-white/50">%</span></div>
                <div className="text-xs text-white/40 font-medium">The dew point is 12° right now.</div>
              </div>
              {/* Visual Vertical Bar */}
              <div className="w-2 h-16 bg-white/5 rounded-full overflow-hidden flex flex-col justify-end">
                 <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: humidityHeight }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="w-full bg-blue-400 rounded-full"
                 />
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Wind Card */}
        <motion.div variants={itemVariants} className="h-full">
          <GlassCard className="p-6 h-full flex flex-col justify-between hover:bg-white/[0.05] transition-all duration-300 group">
            <div className="flex items-center gap-2 text-white/50 mb-6 group-hover:text-white/80 transition-colors">
              <Wind size={16} />
              <span className="text-xs font-semibold uppercase tracking-widest">Wind</span>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <div className="text-4xl font-extralight mb-2 text-white">{data.windSpeed}<span className="text-xl text-white/50 ml-1">km/h</span></div>
                <div className="text-xs text-white/40 font-medium">Direction: {data.windDirection}</div>
              </div>
              {/* Visual Compass */}
              <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center relative bg-white/5">
                 <motion.div 
                   initial={{ rotate: 0 }}
                   animate={{ rotate: windRotation }}
                   transition={{ duration: 1, type: "spring" }}
                   className="text-white"
                 >
                    <Navigation size={16} fill="currentColor" className="text-white" />
                 </motion.div>
                 <span className="absolute top-1 text-[8px] text-white/30 font-bold">N</span>
                 <span className="absolute bottom-1 text-[8px] text-white/30 font-bold">S</span>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* UV Index Card */}
        <motion.div variants={itemVariants} className="h-full">
          <GlassCard className="p-6 h-full flex flex-col justify-between hover:bg-white/[0.05] transition-all duration-300 group">
            <div className="flex items-center gap-2 text-white/50 mb-6 group-hover:text-white/80 transition-colors">
              <Sun size={16} />
              <span className="text-xs font-semibold uppercase tracking-widest">UV Index</span>
            </div>
            <div className="flex flex-col">
              <div className="text-4xl font-extralight mb-1 text-white">{data.uvIndex}</div>
              <div className="text-sm font-medium mb-4" style={{ color: uvColor }}>{data.uvIndex > 5 ? 'High' : data.uvIndex > 2 ? 'Moderate' : 'Low'}</div>
              {/* Visual Horizontal Bar */}
              <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden relative">
                 <div className="absolute inset-0 bg-gradient-to-r from-green-400 via-yellow-400 to-red-500 opacity-50" />
                 <motion.div 
                   initial={{ x: '-100%' }}
                   animate={{ x: `${uvPercentage - 100}%` }}
                   transition={{ duration: 1.5, ease: "easeOut" }}
                   className="absolute top-0 bottom-0 w-full rounded-full border-r-2 border-white bg-transparent"
                 />
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Visibility Card */}
        <motion.div variants={itemVariants} className="h-full">
          <GlassCard className="p-6 h-full flex flex-col justify-between hover:bg-white/[0.05] transition-all duration-300 group">
            <div className="flex items-center gap-2 text-white/50 mb-6 group-hover:text-white/80 transition-colors">
              <Eye size={16} />
              <span className="text-xs font-semibold uppercase tracking-widest">Visibility</span>
            </div>
            <div className="flex justify-between items-end">
              <div>
                <div className="text-4xl font-extralight mb-2 text-white">{data.visibility}<span className="text-xl text-white/50 ml-1">km</span></div>
                <div className="text-xs text-white/40 font-medium">{data.visibility > 8 ? 'Perfectly clear view.' : 'Reduced visibility.'}</div>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Pressure Card */}
        <motion.div variants={itemVariants} className="h-full">
          <GlassCard className="p-6 h-full flex flex-col justify-between hover:bg-white/[0.05] transition-all duration-300 group">
            <div className="flex items-center gap-2 text-white/50 mb-6 group-hover:text-white/80 transition-colors">
              <Gauge size={16} />
              <span className="text-xs font-semibold uppercase tracking-widest">Pressure</span>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <div className="text-4xl font-extralight mb-2 text-white">{data.pressure}<span className="text-sm text-white/50 ml-1">hPa</span></div>
                <div className="text-xs text-white/40 font-medium flex items-center gap-1">
                   <ArrowDown size={12} className="text-white/50" />
                   Falling
                </div>
              </div>
              <div className="w-12 h-12 rounded-full border-4 border-white/5 flex items-center justify-center border-t-white/40 rotate-45 group-hover:rotate-90 transition-transform duration-1000" />
            </div>
          </GlassCard>
        </motion.div>

        {/* Sunrise/Sunset Card */}
        <motion.div variants={itemVariants} className="h-full">
          <GlassCard className="p-6 h-full flex flex-col justify-between hover:bg-white/[0.05] transition-all duration-300 group relative overflow-hidden">
            <div className="flex items-center gap-2 text-white/50 mb-4 group-hover:text-white/80 transition-colors relative z-10">
              <Sunrise size={16} />
              <span className="text-xs font-semibold uppercase tracking-widest">Sunrise</span>
            </div>
            <div className="relative z-10">
              <div className="text-3xl font-light mb-1 text-white">{data.sunrise}</div>
              <div className="text-xs text-white/40 font-medium">Sunset: {data.sunset}</div>
            </div>
            {/* Visual Arc Background */}
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-48 h-24 rounded-t-full border-t-2 border-dashed border-white/10" />
            <div className="absolute bottom-6 left-1/4 w-3 h-3 bg-yellow-400 rounded-full shadow-[0_0_15px_rgba(250,204,21,0.8)]" />
          </GlassCard>
        </motion.div>

      </motion.div>
    </div>
  );
};
