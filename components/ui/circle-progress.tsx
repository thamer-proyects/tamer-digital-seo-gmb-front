'use client';

import React, { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';

interface CircleProgressProps {
  percentage: number;
  size?: number;
}

const CircleProgress: React.FC<CircleProgressProps> = ({ percentage, size = 100 }) => {
  const [dotPosition, setDotPosition] = useState({ x: 0, y: 0 });
  const { theme } = useTheme();

  const getColor = (percentage: number) => {
    if (percentage >= 90) return 'rgb(34, 197, 94)';
    if (percentage >= 50) return 'rgb(234, 179, 8)';
    return 'rgb(239, 68, 68)';
  };

  const getThemeStyles = () => {
    return {
      background: theme === 'dark' ? '#1E1E1E' : '#ffffff',
      boxShadow:
        theme === 'dark'
          ? `
          inset 6px 6px 12px rgba(0, 0, 0, 0.6),
          inset -6px -6px 12px rgba(255, 255, 255, 0.05),
          3px 3px 6px rgba(0, 0, 0, 0.5),
          -3px -3px 6px rgba(255, 255, 255, 0.05)
        `
          : `
          inset 6px 6px 12px rgba(0, 0, 0, 0.1),
          inset -6px -6px 12px rgba(255, 255, 255, 0.8),
          3px 3px 6px rgba(0, 0, 0, 0.1),
          -3px -3px 6px rgba(255, 255, 255, 0.8)
        `,
      textShadow:
        theme === 'dark' ? '1px 1px 2px rgba(0, 0, 0, 0.7)' : '1px 1px 2px rgba(0, 0, 0, 0.2)',
    };
  };

  const color = getColor(percentage);
  const themeStyles = getThemeStyles();

  useEffect(() => {
    const angle = (percentage / 100) * 360;
    const radius = (size - 16) / 2;
    const centerOffset = size / 2;

    const x = centerOffset + radius * Math.sin((angle * Math.PI) / 180);
    const y = centerOffset - radius * Math.cos((angle * Math.PI) / 180);

    setDotPosition({ x, y });
  }, [percentage, size]);

  const radius = (size - 16) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="p-4">
      <div
        className="relative rounded-full"
        style={{
          width: size,
          height: size,
          background: themeStyles.background,
          boxShadow: themeStyles.boxShadow,
        }}
      >
        <svg
          className="w-full h-full"
          viewBox={`0 0 ${size} ${size}`}
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={theme === 'dark' ? '#333' : '#e5e5e5'}
            strokeWidth="8"
          />

          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />

          <circle
            cx={dotPosition.x}
            cy={dotPosition.y}
            r="6"
            fill={color}
            stroke="white"
            strokeWidth="2"
          />
        </svg>

        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center"
          style={{
            color: color,
            textShadow: themeStyles.textShadow,
          }}
        >
          <div className="text-3xl">{Math.round(percentage)}</div>
        </div>
      </div>
    </div>
  );
};

export default CircleProgress;
