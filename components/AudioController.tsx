
import React, { useState } from 'react';

interface AudioControllerProps {
  isMuted: boolean;
  volume: number;
  onMuteToggle: () => void;
  onVolumeChange: (val: number) => void;
}

const AudioController: React.FC<AudioControllerProps> = ({ isMuted, volume, onMuteToggle, onVolumeChange }) => {
  const [showSlider, setShowSlider] = useState(false);

  return (
    <div className="fixed bottom-24 right-8 z-[150] flex flex-col items-center group">
      {showSlider && (
        <div className="mb-4 p-4 bg-[#0a0a20]/80 backdrop-blur-md border border-white/10 rounded-2xl animate-in fade-in slide-in-from-bottom-4 duration-300">
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
            className="h-24 bg-white/20 rounded-lg appearance-none cursor-pointer accent-gold-500"
            // Fix: Cast 'slider-vertical' to any to bypass strict Appearance type check in React CSSProperties
            style={{ writingMode: 'bt-lr' as any, appearance: 'slider-vertical' as any }}
          />
        </div>
      )}

      <button
        onClick={onMuteToggle}
        onMouseEnter={() => setShowSlider(true)}
        onMouseLeave={() => setShowSlider(false)}
        className="w-12 h-12 flex items-center justify-center bg-white/5 border border-white/10 rounded-full hover:bg-gold-500/20 hover:border-gold-500/50 transition-all duration-300 group shadow-lg"
        title="Volume Control"
      >
        {isMuted ? (
          <svg className="w-5 h-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" stroke="currentColor" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
          </svg>
        ) : (
          <svg className="w-5 h-5 text-gold-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
          </svg>
        )}
      </button>
    </div>
  );
};

export default AudioController;
