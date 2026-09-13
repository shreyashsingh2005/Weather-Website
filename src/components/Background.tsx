import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WeatherCondition } from '../types';
import './Background.css';

interface BackgroundProps {
  condition: WeatherCondition;
}

export const Background: React.FC<BackgroundProps> = ({ condition }) => {
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageError(false);
  }, [condition]);

  // ALL of these are specifically hand-picked to be expansive, cinematic SKIES only. 
  // NO umbrellas, NO macro raindrops, NO ground, just sky and clouds.
  const getBackgroundImage = () => {
    switch (condition) {
      case 'Sunny':
        return 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?q=80&w=2500&auto=format&fit=crop';
      case 'Cloudy':
      case 'Partly Cloudy':
        return 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?q=80&w=2500&auto=format&fit=crop'; // Cinematic cloudy sunset
      case 'Storm':
        return 'https://images.unsplash.com/photo-1429552077091-836152271555?q=80&w=2500&auto=format&fit=crop'; // Dark cinematic storm clouds
      case 'Rain':
        return 'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?q=80&w=2500&auto=format&fit=crop'; // Dark heavy rain clouds in sky
      case 'Snow':
        return 'https://images.unsplash.com/photo-1483664852095-d6cc6870702d?q=80&w=2500&auto=format&fit=crop'; // Snowy sky
      case 'Clear Night':
        return 'https://images.unsplash.com/photo-1506318137071-a4e50141a565?q=80&w=2500&auto=format&fit=crop';
      default:
        return 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?q=80&w=2500&auto=format&fit=crop';
    }
  };

  const getFallbackGradient = () => {
    switch (condition) {
      case 'Sunny': return 'linear-gradient(to bottom right, #1e3c72, #2a5298)';
      case 'Cloudy': return 'linear-gradient(to bottom right, #304352, #d7d2cc)';
      case 'Partly Cloudy': return 'linear-gradient(to bottom right, #2c3e50, #3498db)';
      case 'Storm': return 'linear-gradient(to bottom right, #141e30, #243b55)';
      case 'Rain': return 'linear-gradient(to bottom right, #2b5876, #4e4376)';
      case 'Snow': return 'linear-gradient(to bottom right, #8e9eab, #eef2f3)';
      case 'Clear Night': return 'linear-gradient(to bottom right, #0f2027, #203a43)';
      default: return 'linear-gradient(to bottom right, #232526, #414345)';
    }
  };

  return (
    <div className="weather-background">
      <AnimatePresence mode="wait">
        <motion.div
          key={condition}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="weather-layer"
          data-condition={condition}
        >
          {/* Base Cinematic Sky Image Layer */}
          {!imageError ? (
            <img 
              src={getBackgroundImage()} 
              alt={condition}
              onError={() => setImageError(true)}
              crossOrigin="anonymous"
            />
          ) : (
            <div style={{ width: '100%', height: '100%', background: getFallbackGradient() }} />
          )}

          {/* Realistic 3-Layer Volumetric Clouds System */}
          <div className="cinematic-clouds-container">
             <div className="cinematic-cloud-layer layer-1" />
             <div className="cinematic-cloud-layer layer-2" />
             <div className="cinematic-cloud-layer layer-3" />
          </div>

          {/* Dark Atmospheric Overlay to keep UI perfectly readable */}
          <div className="weather-overlay" />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
