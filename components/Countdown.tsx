
import React, { useState, useEffect, useRef } from 'react';

interface CountdownProps {
  timezone: string;
  onMidnight: () => void;
}

const Countdown: React.FC<CountdownProps> = ({ timezone, onMidnight }) => {
  const [timeLeft, setTimeLeft] = useState({ h: 0, m: 0, s: 0, ms: 0 });
  const [progress, setProgress] = useState(0);
  const testStartTime = useRef<number | null>(null);

  useEffect(() => {
    // Reset test start time whenever timezone changes
    testStartTime.current = null;

    const timer = setInterval(() => {
      let diff: number;

      if (timezone === 'TEST_MODE') {
        if (testStartTime.current === null) {
          testStartTime.current = Date.now();
        }
        const elapsed = Date.now() - testStartTime.current;
        diff = 10000 - elapsed; // 10 seconds test
      } else {
        // Calculate time based on selected timezone
        const now = new Date();
        const formatter = new Intl.DateTimeFormat('en-US', {
          timeZone: timezone,
          year: 'numeric',
          month: 'numeric',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
          second: 'numeric',
          hour12: false,
        });

        const parts = formatter.formatToParts(now);
        const getVal = (type: string) => parseInt(parts.find(p => p.type === type)?.value || '0');
        
        const currentYear = getVal('year');
        
        // Get target epoch in selected timezone
        const targetTime = new Date(new Date().toLocaleString('en-US', { timeZone: timezone }));
        targetTime.setFullYear(currentYear + 1, 0, 1);
        targetTime.setHours(0, 0, 0, 0);

        diff = targetTime.getTime() - new Date(now.toLocaleString('en-US', { timeZone: timezone })).getTime();
      }

      if (diff <= 0) {
        onMidnight();
        clearInterval(timer);
        setTimeLeft({ h: 0, m: 0, s: 0, ms: 0 });
        setProgress(100);
        return;
      }

      const h = Math.floor(diff / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);
      const ms = Math.floor((diff % 1000) / 10);

      setTimeLeft({ h, m, s, ms });
      
      // Progress visualization
      if (timezone === 'TEST_MODE') {
        setProgress(((10000 - diff) / 10000) * 100);
      } else {
        setProgress((s / 60) * 100);
      }
    }, 10);

    return () => clearInterval(timer);
  }, [timezone, onMidnight]);

  const ringStyle = {
    strokeDasharray: '283',
    strokeDashoffset: (283 - (283 * progress) / 100).toString(),
    transition: timezone === 'TEST_MODE' ? 'stroke-dashoffset 0.05s linear' : 'stroke-dashoffset 0.5s ease'
  };

  return (
    <div className="relative flex items-center justify-center">
      {/* Outer Ring */}
      <svg className="w-64 h-64 md:w-80 md:h-80 transform -rotate-90">
        <circle
          cx="50%"
          cy="50%"
          r="45%"
          className="stroke-white/5 fill-transparent"
          strokeWidth="2"
        />
        <circle
          cx="50%"
          cy="50%"
          r="45%"
          className="stroke-gold-500 fill-transparent"
          strokeWidth="4"
          strokeLinecap="round"
          style={ringStyle}
        />
      </svg>

      {/* Timer Text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center space-y-1">
        <div className="flex items-baseline space-x-2">
          <span className="text-4xl md:text-6xl font-serif-elegant font-bold tabular-nums drop-shadow-[0_0_15px_rgba(255,215,0,0.3)]">
            {String(timeLeft.h).padStart(2, '0')}:{String(timeLeft.m).padStart(2, '0')}:{String(timeLeft.s).padStart(2, '0')}
          </span>
          <span className="text-gold-500/60 font-mono text-sm md:text-lg tabular-nums">
            {String(timeLeft.ms).padStart(2, '0')}
          </span>
        </div>
        <div className="text-[10px] tracking-[0.4em] uppercase text-gray-500 font-light">
          {timezone === 'TEST_MODE' ? 'Testing Celebration' : 'Hours : Mins : Secs'}
        </div>
      </div>
      
      {/* Subtle Glow */}
      <div className="absolute inset-0 bg-gold-500/10 blur-[60px] rounded-full z-[-1] animate-pulse" />
    </div>
  );
};

export default Countdown;
