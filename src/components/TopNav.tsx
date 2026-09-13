import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Settings, LocateFixed, Loader2 } from 'lucide-react';
import { searchCity, LocationResult } from '../services/locationApi';
import { motion, AnimatePresence } from 'framer-motion';

interface TopNavProps {
  selectedCity: string;
  onLocationSelect: (lat: number, lon: number, name: string, country: string) => void;
  onCurrentLocation: () => void;
  unit: 'C' | 'F';
  onUnitToggle: () => void;
  isLocating: boolean;
}

export const TopNav: React.FC<TopNavProps> = ({ 
  selectedCity, 
  onLocationSelect, 
  onCurrentLocation, 
  unit, 
  onUnitToggle,
  isLocating
}) => {
  const [searchValue, setSearchValue] = useState('');
  const [results, setResults] = useState<LocationResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchResults = async () => {
      if (searchValue.trim().length < 2) {
        setResults([]);
        return;
      }
      setIsSearching(true);
      const data = await searchCity(searchValue);
      setResults(data);
      setIsSearching(false);
      setShowDropdown(true);
    };

    const debounce = setTimeout(fetchResults, 300);
    return () => clearTimeout(debounce);
  }, [searchValue]);

  const handleSelect = (res: LocationResult) => {
    setSearchValue('');
    setShowDropdown(false);
    onLocationSelect(res.lat, res.lon, res.name, res.country);
  };

  return (
    <nav className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 z-50">
      <div className="w-full sm:w-auto flex items-center justify-between sm:justify-start gap-2 text-sm text-white/80 font-medium bg-black/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
        <div className="flex items-center gap-2">
           <MapPin size={16} className="text-white" />
           <span className="truncate max-w-[120px] sm:max-w-[200px]">{selectedCity}</span>
        </div>
        <span className="text-white/40 ml-2 hidden sm:inline">({new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })})</span>
        
        {/* Mobile-only unit & locate buttons within the pill for compactness */}
        <div className="flex sm:hidden items-center gap-2">
           <button onClick={onCurrentLocation} className="p-1 text-white hover:text-white/80">
              {isLocating ? <Loader2 size={16} className="animate-spin" /> : <LocateFixed size={16} />}
           </button>
           <div className="w-px h-4 bg-white/20"></div>
           <button onClick={onUnitToggle} className="p-1 text-white font-bold">
              °{unit}
           </button>
        </div>
      </div>

      <div className="w-full sm:w-auto flex items-center gap-3 relative">
        {/* Search Input with Dropdown */}
        <div className="relative w-full sm:w-auto" ref={dropdownRef}>
          <div className="relative w-full">
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onFocus={() => { if (results.length > 0) setShowDropdown(true); }}
              placeholder="Search city..."
              className="w-full sm:w-[200px] sm:focus:w-[280px] bg-white/10 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm text-white placeholder-white/50 outline-none focus:bg-white/20 transition-all"
            />
            {isSearching ? (
              <Loader2 size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 animate-spin" />
            ) : (
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50" />
            )}
          </div>

          <AnimatePresence>
            {showDropdown && results.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full mt-2 w-full bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl z-[100]"
              >
                {results.map((res, i) => (
                  <button
                    key={i}
                    onClick={() => handleSelect(res)}
                    className="w-full text-left px-4 py-3 hover:bg-white/10 transition-colors flex flex-col border-b border-white/5 last:border-0"
                  >
                    <span className="font-medium text-white">{res.name}</span>
                    <span className="text-xs text-white/50">{res.country}</span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Desktop-only Action Buttons */}
        <div className="hidden sm:flex items-center gap-2">
           <button 
             onClick={onCurrentLocation}
             className="w-10 h-10 shrink-0 rounded-full bg-white/10 border border-white/10 flex items-center justify-center hover:bg-white/20 transition-colors group relative overflow-hidden"
             title="Use Current Location"
           >
             {isLocating ? (
                <Loader2 size={18} className="animate-spin text-white" />
             ) : (
                <LocateFixed size={18} className="text-white group-hover:scale-110 transition-transform" />
             )}
           </button>

           <button 
             onClick={onUnitToggle}
             className="w-10 h-10 shrink-0 rounded-full bg-white/10 border border-white/10 flex items-center justify-center hover:bg-white/20 transition-colors font-medium"
           >
             °{unit}
           </button>
           
           <button className="w-10 h-10 shrink-0 rounded-full bg-white/10 border border-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
             <Settings size={18} />
           </button>
        </div>
      </div>
    </nav>
  );
};
