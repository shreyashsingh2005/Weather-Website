import React from 'react';
import { GlassCard } from './GlassCard';
import { WeatherData } from '../types';
import { MapPin, Navigation, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

interface SidebarProps {
  data: WeatherData;
  convertTemp: (t: number) => number;
  unit: 'C' | 'F';
  onCitySelect: (city: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ data, convertTemp, unit, onCitySelect }) => {
  const savedCities = ['Brooklyn', 'London', 'Tokyo', 'Dubai', 'Delhi'];

  return (
    <aside className="w-full md:w-[280px] flex flex-col gap-6 shrink-0 z-20">
      <GlassCard className="p-6 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-medium flex items-center gap-2">
            WeatherWise
          </h2>
          <Zap className="text-white/40" size={18} />
        </div>
        
        {/* Status Indicator */}
        <div className="relative h-24 rounded-2xl overflow-hidden bg-gradient-to-r from-white/5 to-white/10 border border-white/10 flex items-center p-4">
           <div className="flex flex-col z-10">
              <span className="text-xs text-white/50 uppercase tracking-wider mb-1">Status</span>
              <div className="flex items-center gap-2">
                 <span className={`px-3 py-1 text-black text-xs font-bold rounded-full ${data.condition === 'Storm' || data.condition === 'Snow' ? 'bg-red-400' : 'bg-white'}`}>
                   {data.condition === 'Storm' ? 'Severe' : data.condition === 'Snow' ? 'Cold' : 'Normal'}
                 </span>
                 <span className="text-sm font-medium">{data.aqi.status} Air</span>
              </div>
           </div>
           {/* Abstract graph line for status */}
           <svg className="absolute right-0 bottom-0 w-32 h-16 text-white/20" viewBox="0 0 100 50">
             <motion.path 
               initial={{ pathLength: 0 }}
               animate={{ pathLength: 1 }}
               transition={{ duration: 1.5 }}
               d="M0 50 Q 20 40, 50 30 T 100 10" 
               fill="none" 
               stroke="currentColor" 
               strokeWidth="2" 
             />
             <motion.circle 
               initial={{ scale: 0 }}
               animate={{ scale: 1 }}
               transition={{ delay: 1.5 }}
               cx="90" cy="14" r="3" fill="currentColor" 
             />
           </svg>
        </div>

        {/* Saved Locations */}
        <div className="flex flex-col gap-3 mt-4">
          <div className="flex items-center justify-between text-xs text-white/50 uppercase tracking-wider mb-2">
            <span>Select Area</span>
            <div className="flex gap-2">
              <MapPin size={14} />
              <Navigation size={14} />
            </div>
          </div>
          
          <div className="flex flex-col gap-2">
            {savedCities.map((city) => (
              <button
                key={city}
                onClick={() => onCitySelect(city)}
                className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-300 flex justify-between items-center ${
                  data.city === city 
                    ? 'bg-white/20 shadow-[0_0_15px_rgba(255,255,255,0.1)] border border-white/20' 
                    : 'hover:bg-white/10 border border-transparent'
                }`}
              >
                <span className="font-medium">{city}</span>
                {data.city === city && (
                  <motion.span layoutId="activeCityTemp" className="text-sm text-white font-medium">
                    {convertTemp(data.temp)}°
                  </motion.span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Mini Map representation */}
        <div className="mt-4 flex flex-col items-center">
           <div className="w-40 h-40 rounded-full border-2 border-white/10 bg-black/20 flex items-center justify-center relative overflow-hidden shadow-inner">
              {/* Abstract globe lines */}
              <div className="absolute inset-0 opacity-20 pointer-events-none">
                 <svg viewBox="0 0 100 100" className="animate-[spin_20s_linear_infinite]">
                    <circle cx="50" cy="50" r="48" fill="none" stroke="white" strokeWidth="1"/>
                    <ellipse cx="50" cy="50" rx="20" ry="48" fill="none" stroke="white" strokeWidth="1"/>
                    <ellipse cx="50" cy="50" rx="48" ry="20" fill="none" stroke="white" strokeWidth="1"/>
                 </svg>
              </div>
              {/* Pulsing marker */}
              <div className="relative z-10 flex flex-col items-center">
                 <div className="w-3 h-3 bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,1)] animate-pulse" />
                 <MapPin className="text-white mt-1" size={16} fill="white" />
              </div>
           </div>
           <p className="mt-4 text-sm text-white/60 text-center">{data.city}, <br/><span className="text-xs">{data.country}</span></p>
        </div>
      </GlassCard>
    </aside>
  );
};
