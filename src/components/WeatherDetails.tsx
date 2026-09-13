import React from 'react';
import { motion } from 'framer-motion';
import { WeatherData } from '../types';
import { GlassCard } from './GlassCard';
import { Droplets, Wind, Sun, Eye, Gauge, Sunrise, Sunset, Activity } from 'lucide-react';

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
  const details = [
    { label: 'Humidity', value: `${data.humidity}%`, icon: Droplets, secondary: 'Dew point calculated' },
    { label: 'Wind', value: `${data.windSpeed} km/h`, icon: Wind, secondary: `Direction ${data.windDirection}` },
    { label: 'UV Index', value: data.uvIndex, icon: Sun, secondary: data.uvIndex > 5 ? 'High' : 'Moderate' },
    { label: 'Visibility', value: `${data.visibility} km`, icon: Eye, secondary: data.visibility > 8 ? 'Clear view' : 'Reduced' },
    { label: 'Pressure', value: `${data.pressure} hPa`, icon: Gauge, secondary: 'Atmospheric' },
    { label: 'Sunrise / Set', value: data.sunrise, icon: Sunrise, secondary: data.sunset },
  ];

  return (
    <div className="flex flex-col gap-6 mt-4">
      <h3 className="text-sm uppercase tracking-widest text-white/50 font-medium px-2">Weather Details</h3>
      
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6"
      >
        {/* AQI Card - Highlighted */}
        <motion.div variants={itemVariants} className="col-span-2 md:col-span-2 xl:col-span-2 h-full">
          <GlassCard className="p-6 h-full relative overflow-hidden flex flex-col md:flex-row items-center gap-8 group">
            <div className="flex-1 w-full z-10">
              <div className="flex items-center gap-2 text-white/60 mb-2">
                <Activity size={16} className="text-green-400" />
                <span className="text-sm font-medium uppercase tracking-wider">Air Quality</span>
              </div>
              <div className="text-5xl font-light tracking-tight mb-1 group-hover:scale-105 transition-transform origin-left">{data.aqi.value}</div>
              <div className="text-lg font-medium text-green-300">{data.aqi.status}</div>
              
              <div className="flex gap-6 mt-6 w-full">
                <div className="flex flex-col">
                  <span className="text-xs text-white/40 mb-1">PM2.5</span>
                  <span className="text-sm font-medium">{data.aqi.pm25} <span className="text-[10px] text-white/30">µg/m³</span></span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-white/40 mb-1">PM10</span>
                  <span className="text-sm font-medium">{data.aqi.pm10} <span className="text-[10px] text-white/30">µg/m³</span></span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-white/40 mb-1">NO2</span>
                  <span className="text-sm font-medium">{data.aqi.no2} <span className="text-[10px] text-white/30">µg/m³</span></span>
                </div>
              </div>
            </div>
            
            {/* Circular Progress Indicator for AQI */}
            <div className="relative w-32 h-32 shrink-0 z-10">
               <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                 <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                 <motion.circle 
                   cx="50" 
                   cy="50" 
                   r="40" 
                   fill="none" 
                   stroke="url(#aqiGradient)" 
                   strokeWidth="8"
                   strokeDasharray="251.2"
                   initial={{ strokeDashoffset: 251.2 }}
                   animate={{ strokeDashoffset: 251.2 - (251.2 * Math.min(data.aqi.value, 150)) / 150 }}
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
               <div className="absolute inset-0 flex items-center justify-center flex-col">
                 <span className="text-xs text-white/50 uppercase font-medium">AQI</span>
               </div>
            </div>
            
            {/* Ambient Glow */}
            <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-green-500/10 blur-3xl rounded-full pointer-events-none group-hover:bg-green-500/20 transition-colors duration-500" />
          </GlassCard>
        </motion.div>

        {/* Other Detail Cards */}
        {details.map((detail, index) => (
          <motion.div key={index} variants={itemVariants} className="h-full">
            <GlassCard className="p-5 h-full flex flex-col justify-between hover:bg-white/10 transition-all duration-300 group hover:-translate-y-1">
              <div className="flex items-center gap-2 text-white/60 mb-4 group-hover:text-white/90 transition-colors">
                <detail.icon size={16} />
                <span className="text-sm font-medium">{detail.label}</span>
              </div>
              <div>
                <div className="text-2xl font-light mb-1">{detail.value}</div>
                <div className="text-xs text-white/40 group-hover:text-white/60 transition-colors">{detail.secondary}</div>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};
