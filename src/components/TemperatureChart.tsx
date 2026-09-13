import React from 'react';
import { motion } from 'framer-motion';
import { WeatherData } from '../types';

interface TemperatureChartProps {
  data: WeatherData;
  convertTemp: (t: number) => number;
}

export const TemperatureChart: React.FC<TemperatureChartProps> = ({ data, convertTemp }) => {
  const hourlyData = data.hourly;
  const temps = hourlyData.map(h => convertTemp(h.temp));
  const maxTemp = Math.max(...temps);
  const minTemp = Math.min(...temps);
  const range = maxTemp - minTemp || 1; // Prevent division by zero
  
  // Use responsive relative measurements
  const width = 800;
  const height = 150;
  const paddingX = 40;
  const paddingY = 40;
  
  const graphWidth = width - paddingX * 2;
  const graphHeight = height - paddingY * 2;

  const points = temps.map((temp, index) => {
    const x = paddingX + (index / (temps.length - 1)) * graphWidth;
    const y = paddingY + graphHeight - ((temp - minTemp) / range) * graphHeight;
    return { x, y, temp, time: hourlyData[index].time };
  });

  // Generate smooth cubic bezier curve path
  const createSmoothPath = () => {
    if (points.length === 0) return '';
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];
      const cx = (p0.x + p1.x) / 2;
      d += ` C ${cx} ${p0.y}, ${cx} ${p1.y}, ${p1.x} ${p1.y}`;
    }
    return d;
  };

  const pathD = createSmoothPath();
  const fillPathD = `${pathD} L ${points[points.length - 1].x} ${height} L ${points[0].x} ${height} Z`;

  return (
    <div className="w-full overflow-x-auto overflow-y-hidden pb-4 hide-scrollbar touch-pan-x min-w-0">
      {/* Allow it to shrink to viewport on small screens, or scroll if min-w is hit */}
      <div className="min-w-[500px] w-full relative">
        <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className="w-full h-[150px] overflow-visible">
          <defs>
            <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="rgba(255,255,255,0.4)" />
              <stop offset="50%" stopColor="rgba(255,255,255,1)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0.4)" />
            </linearGradient>
            <linearGradient id="fillGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(255,255,255,0.15)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Fill under the curve */}
          <motion.path
            d={fillPathD}
            fill="url(#fillGradient)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          />

          {/* Smooth Curve Line */}
          <motion.path
            d={pathD}
            fill="none"
            stroke="url(#lineGradient)"
            strokeWidth="3"
            filter="url(#glow)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            vectorEffect="non-scaling-stroke"
          />

          {/* Points and Labels */}
          {points.map((point, i) => (
            <g key={i} className="transition-all duration-300">
              {i === 3 && ( // Highlight middle point
                <>
                  <circle cx={point.x} cy={point.y} r="14" fill="rgba(255,255,255,0.2)" filter="url(#glow)"/>
                  <line x1={point.x} y1={point.y} x2={point.x} y2={height} stroke="rgba(255,255,255,0.3)" strokeWidth="1" strokeDasharray="4 4" />
                </>
              )}
              <circle 
                cx={point.x} 
                cy={point.y} 
                r="4" 
                fill={i === 3 ? "#fff" : "rgba(255,255,255,0.8)"} 
                stroke="rgba(0,0,0,0.5)"
                strokeWidth="2"
              />
              <text 
                x={point.x} 
                y={height - 10} 
                fill={i === 3 ? "#fff" : "rgba(255,255,255,0.6)"}
                fontSize="14" 
                fontWeight={i === 3 ? "600" : "400"}
                textAnchor="middle"
              >
                {point.temp}°
              </text>
              <text 
                x={point.x} 
                y={point.y - 25} 
                fill="rgba(255,255,255,0.6)" 
                fontSize="12" 
                textAnchor="middle"
              >
                {point.time}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
};
