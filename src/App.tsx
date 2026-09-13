import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Background } from './components/Background';
import { Sidebar } from './components/Sidebar';
import { TopNav } from './components/TopNav';
import { HeroWeather } from './components/HeroWeather';
import { HourlyForecast } from './components/HourlyForecast';
import { WeeklyForecast } from './components/WeeklyForecast';
import { WeatherDetails } from './components/WeatherDetails';
import { TemperatureChart } from './components/TemperatureChart';
import { WeatherData } from './types';
import { fetchWeatherData } from './services/weatherApi';
import { reverseGeocode } from './services/locationApi';
import { Loader2 } from 'lucide-react';

function App() {
  const [unit, setUnit] = useState<'C' | 'F'>('C');
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLocating, setIsLocating] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Default fallback location (London)
  const defaultLocation = { lat: 51.5074, lon: -0.1278, city: 'London', country: 'United Kingdom' };

  const loadWeather = async (lat: number, lon: number, city: string, country: string) => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      const data = await fetchWeatherData(lat, lon, city, country);
      setWeatherData(data);
    } catch (err) {
      setErrorMsg('Failed to load weather data.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Attempt to get user's location on initial load
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const { city, country } = await reverseGeocode(latitude, longitude);
            await loadWeather(latitude, longitude, city, country);
          } catch (e) {
             // Fallback
             loadWeather(defaultLocation.lat, defaultLocation.lon, defaultLocation.city, defaultLocation.country);
          }
        },
        (err) => {
          // If denied or error, load default
          loadWeather(defaultLocation.lat, defaultLocation.lon, defaultLocation.city, defaultLocation.country);
        },
        { enableHighAccuracy: false, timeout: 5000, maximumAge: 300000 } // Optimized for instant speed
      );
    } else {
      loadWeather(defaultLocation.lat, defaultLocation.lon, defaultLocation.city, defaultLocation.country);
    }
  }, []);

  const handleLocationSelect = (lat: number, lon: number, name: string, country: string) => {
    loadWeather(lat, lon, name, country);
  };

  const handleCurrentLocation = () => {
    if (!navigator.geolocation) {
      setErrorMsg('Geolocation is not supported by your browser.');
      return;
    }
    
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const { city, country } = await reverseGeocode(latitude, longitude);
          await loadWeather(latitude, longitude, city, country);
        } catch (e) {
          setErrorMsg('Failed to fetch location details.');
        } finally {
          setIsLocating(false);
        }
      },
      (err) => {
        setIsLocating(false);
        if (err.code === err.PERMISSION_DENIED) {
           setErrorMsg('Location permission denied.');
        } else {
           setErrorMsg('Unable to retrieve your location. Try again or search manually.');
        }
      },
      { enableHighAccuracy: false, timeout: 5000, maximumAge: 300000 } // Optimized for instant speed
    );
  };

  const handleCityPreset = (city: string) => {
     const presets: Record<string, {lat: number, lon: number, country: string}> = {
        'Brooklyn': { lat: 40.6782, lon: -73.9442, country: 'United States' },
        'London': { lat: 51.5074, lon: -0.1278, country: 'United Kingdom' },
        'Tokyo': { lat: 35.6762, lon: 139.6503, country: 'Japan' },
        'Dubai': { lat: 25.2048, lon: 55.2708, country: 'United Arab Emirates' },
        'Delhi': { lat: 28.6139, lon: 77.2090, country: 'India' }
     };
     if (presets[city]) {
        loadWeather(presets[city].lat, presets[city].lon, city, presets[city].country);
     }
  };

  const convertTemp = (temp: number) => {
    if (unit === 'F') {
      return Math.round((temp * 9) / 5 + 32);
    }
    return temp;
  };

  return (
    <div className="min-h-[100dvh] w-full relative text-white font-sans flex flex-col">
      <Background condition={weatherData?.condition || 'Cloudy'} />
      
      {/* Container: Stacked on mobile, side-by-side on tablet/desktop */}
      <div className="relative z-10 flex-1 flex flex-col lg:flex-row p-4 sm:p-6 lg:p-8 gap-6 w-full max-w-[1600px] mx-auto">
        
        {/* Sidebar: Order 2 on mobile/tablet (bottom), Order 1 on desktop (left) */}
        {weatherData && (
          <aside className="order-2 lg:order-1 w-full lg:w-[320px] xl:w-[380px] shrink-0 pb-8 lg:pb-0">
            <Sidebar 
              data={weatherData} 
              convertTemp={convertTemp} 
              unit={unit} 
              onCitySelect={handleCityPreset}
            />
          </aside>
        )}
        
        {/* Main Content: Order 1 on mobile/tablet (top), Order 2 on desktop (right) */}
        <main className="order-1 lg:order-2 flex-1 flex flex-col gap-6 w-full min-w-0">
          <TopNav 
            selectedCity={weatherData?.city || 'Locating...'}
            onLocationSelect={handleLocationSelect}
            onCurrentLocation={handleCurrentLocation}
            unit={unit} 
            onUnitToggle={() => setUnit(unit === 'C' ? 'F' : 'C')}
            isLocating={isLocating}
          />

          {errorMsg && (
             <div role="alert" className="bg-red-500/20 border border-red-500/50 text-red-200 p-4 rounded-2xl backdrop-blur-md animate-fade-in text-sm sm:text-base">
               {errorMsg}
             </div>
          )}
          
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div 
                key="loader"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col items-center justify-center min-h-[50dvh]"
              >
                <Loader2 size={48} className="animate-spin text-white/50 mb-4" />
                <p className="text-white/60 tracking-wider uppercase text-sm font-medium">Fetching atmosphere</p>
              </motion.div>
            ) : weatherData ? (
              <motion.div 
                key={weatherData.city}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col gap-8 sm:gap-10 pb-6 md:pb-12 w-full min-w-0"
              >
                <HeroWeather data={weatherData} convertTemp={convertTemp} unit={unit} />
                
                <section className="flex flex-col gap-4 w-full min-w-0">
                  <h3 className="text-sm uppercase tracking-widest text-white/50 font-medium px-2">Hourly Forecast</h3>
                  <div className="w-full min-w-0">
                     <HourlyForecast data={weatherData} convertTemp={convertTemp} />
                     <TemperatureChart data={weatherData} convertTemp={convertTemp} />
                  </div>
                </section>
                
                <section className="flex flex-col gap-4 w-full min-w-0">
                  <h3 className="text-sm uppercase tracking-widest text-white/50 font-medium px-2">7-Day Forecast</h3>
                  <div className="w-full min-w-0">
                    <WeeklyForecast data={weatherData} convertTemp={convertTemp} />
                  </div>
                </section>
                
                <section className="w-full min-w-0">
                  <WeatherDetails data={weatherData} />
                </section>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

export default App;
