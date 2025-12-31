
import React from 'react';

interface WelcomeScreenProps {
  onStart: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#050510] px-4">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-900/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900/20 blur-[120px] rounded-full" />
      </div>

      <div className="relative text-center max-w-2xl transform transition-all duration-1000">
        <h2 className="text-gold-400 font-serif-elegant italic text-lg md:text-xl tracking-[0.3em] uppercase mb-4 opacity-80">
          Welcome to the Journey
        </h2>
        <h1 className="text-4xl md:text-7xl font-serif-elegant font-bold mb-8 shimmer-text leading-tight drop-shadow-[0_0_15px_rgba(255,215,0,0.3)]">
          A Magical New Year<br/>Experience
        </h1>
        <p className="text-gray-400 font-light text-sm md:text-base leading-relaxed mb-12 max-w-lg mx-auto">
          Prepare your heart for a cinematic transition into 2025. 
          A night of light, sound, and future hopes awaits you.
        </p>

        <button
          onClick={onStart}
          className="group relative px-10 py-4 overflow-hidden rounded-full bg-transparent border border-gold-600 hover:border-white transition-all duration-500"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#b8860b] to-[#ffd700] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <span className="relative z-10 font-medium tracking-[0.2em] uppercase text-white group-hover:text-[#050510] transition-colors duration-500">
            Start Celebration
          </span>
          <div className="absolute -inset-1 rounded-full blur-md bg-gold-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </button>
      </div>

      <div className="mt-12 text-gray-600 text-[10px] tracking-widest uppercase animate-pulse">
        Sound interaction recommended
      </div>
    </div>
  );
};

export default WelcomeScreen;
