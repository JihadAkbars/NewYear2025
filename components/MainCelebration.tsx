
import React, { useState, useEffect, useRef } from 'react';
import FireworksCanvas from './FireworksCanvas';
import Countdown from './Countdown';
import WishModal from './WishModal';
import FloatingMessages from './FloatingMessages';
import { TIMEZONES, AUDIO_URLS } from '../constants';
import { Wish } from '../types';

interface MainCelebrationProps {
  timezone: string;
  reduceEffects: boolean;
  isMuted: boolean;
  volume: number;
  onTimezoneChange: (tz: string) => void;
}

const MainCelebration: React.FC<MainCelebrationProps> = ({ timezone, reduceEffects, isMuted, volume, onTimezoneChange }) => {
  const [isMidnight, setIsMidnight] = useState(false);
  const [isWishModalOpen, setIsWishModalOpen] = useState(false);
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [showHappyNewYear, setShowHappyNewYear] = useState(false);
  const [showSecondaryMessage, setShowSecondaryMessage] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const celebrationAudio = useRef<HTMLAudioElement | null>(null);

  // Load wishes and user data from LocalStorage
  useEffect(() => {
    const savedWishes = localStorage.getItem('new_year_wishes_2025');
    const savedName = localStorage.getItem('new_year_user_name');
    if (savedWishes) {
      setWishes(JSON.parse(savedWishes));
    }
    if (savedName) {
      setUserName(savedName);
    }
    celebrationAudio.current = new Audio(AUDIO_URLS.celebration);
  }, []);

  const handleAddWish = (wish: Omit<Wish, 'id' | 'timestamp'>) => {
    const newWish: Wish = {
      ...wish,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
    };
    const updatedWishes = [...wishes, newWish];
    setWishes(updatedWishes);
    setUserName(wish.name);
    localStorage.setItem('new_year_wishes_2025', JSON.stringify(updatedWishes));
    localStorage.setItem('new_year_user_name', wish.name);
  };

  const handleMidnightReached = () => {
    setIsMidnight(true);
    setShowHappyNewYear(true);
    setIsShaking(true);
    
    if (!isMuted && celebrationAudio.current) {
      celebrationAudio.current.volume = volume;
      celebrationAudio.current.play().catch(() => {});
    }

    // Stop shaking after a short intense burst
    setTimeout(() => setIsShaking(false), 2000);
    
    // Show secondary "See you next year" message after a delay
    setTimeout(() => {
      setShowSecondaryMessage(true);
    }, 4000);
  };

  return (
    <div className={`relative min-h-screen flex flex-col items-center justify-center p-6 transition-all duration-1000 ${isMidnight ? 'bg-gradient-to-b from-[#1a0a30] via-[#200a2a] to-[#050510]' : ''} ${isShaking ? 'animate-shake' : ''}`}>
      <style>{`
        @keyframes shake {
          0% { transform: translate(1px, 1px) rotate(0deg); }
          10% { transform: translate(-1px, -2px) rotate(-1deg); }
          20% { transform: translate(-3px, 0px) rotate(1deg); }
          30% { transform: translate(3px, 2px) rotate(0deg); }
          40% { transform: translate(1px, -1px) rotate(1deg); }
          50% { transform: translate(-1px, 2px) rotate(-1deg); }
          60% { transform: translate(-3px, 1px) rotate(0deg); }
          70% { transform: translate(3px, 1px) rotate(-1deg); }
          80% { transform: translate(-1px, -1px) rotate(1deg); }
          90% { transform: translate(1px, 2px) rotate(0deg); }
          100% { transform: translate(1px, -2px) rotate(-1deg); }
        }
        .animate-shake { animation: shake 0.5s infinite; }
      `}</style>

      {/* Background Effects */}
      <div className="fixed inset-0 z-0">
        <FireworksCanvas 
          isMidnight={isMidnight} 
          reduceEffects={reduceEffects} 
          isMuted={isMuted}
          volume={volume}
        />
      </div>

      {/* Floating UI Elements */}
      <FloatingMessages />

      {/* Main UI Overlay */}
      <div className="relative z-10 w-full max-w-4xl flex flex-col items-center text-center space-y-12">
        {showHappyNewYear ? (
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-in fade-in zoom-in duration-1000">
              <h1 className="text-6xl md:text-9xl font-serif-elegant font-bold shimmer-text drop-shadow-[0_0_50px_rgba(255,215,0,0.6)] mb-2">
                2025
              </h1>
              <p className="text-2xl md:text-4xl font-garamond italic text-gold-200 tracking-[0.2em] uppercase">
                Happy New Year{userName ? `, ${userName}` : ''}
              </p>
            </div>
            
            {showSecondaryMessage && (
              <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
                <p className="text-white/60 font-serif-elegant italic text-lg md:text-2xl tracking-[0.1em] mt-8">
                  See you next year
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            <h2 className="text-gold-500 font-serif-elegant italic text-xl tracking-widest opacity-80">
              The Countdown to New Horizons
            </h2>
            <Countdown 
              timezone={timezone} 
              onMidnight={handleMidnightReached} 
            />
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row gap-6 mt-8">
          <button
            onClick={() => setIsWishModalOpen(true)}
            className="px-8 py-3 rounded-full bg-white/5 border border-white/10 hover:border-gold-500/50 hover:bg-gold-500/10 transition-all duration-300 group"
          >
            <span className="text-sm font-light tracking-widest uppercase group-hover:text-gold-400 transition-colors">
              Write a Wish 2025
            </span>
          </button>
          
          <div className="relative group">
            <select
              value={timezone}
              onChange={(e) => onTimezoneChange(e.target.value)}
              className="appearance-none bg-white/5 border border-white/10 rounded-full px-10 py-3 text-sm font-light tracking-widest uppercase focus:outline-none hover:border-white/30 transition-all cursor-pointer"
            >
              {TIMEZONES.map((tz) => (
                <option key={tz.value} value={tz.value} className="bg-[#050510]">{tz.label}</option>
              ))}
            </select>
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gold-500 pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {isWishModalOpen && (
        <WishModal 
          onClose={() => setIsWishModalOpen(false)} 
          onSubmit={handleAddWish} 
          existingWishes={wishes}
        />
      )}
    </div>
  );
};

export default MainCelebration;
