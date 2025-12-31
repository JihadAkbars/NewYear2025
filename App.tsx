
import React, { useState, useEffect, useCallback, useRef } from 'react';
import WelcomeScreen from './components/WelcomeScreen';
import MainCelebration from './components/MainCelebration';
import AudioController from './components/AudioController';
import SettingsPanel from './components/SettingsPanel';
import { AUDIO_URLS } from './constants';

const App: React.FC = () => {
  const [isStarted, setIsStarted] = useState(false);
  const [reduceEffects, setReduceEffects] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [activeTimezone, setActiveTimezone] = useState('Asia/Jakarta');
  const bgMusicRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (isStarted) {
      if (!bgMusicRef.current) {
        bgMusicRef.current = new Audio(AUDIO_URLS.bgMusic);
        bgMusicRef.current.loop = true;
      }
      bgMusicRef.current.volume = volume;
      bgMusicRef.current.muted = isMuted;
      
      const playPromise = bgMusicRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.log("Auto-play was prevented. Audio will play on next interaction.", error);
        });
      }
    }
    
    return () => {
      if (bgMusicRef.current) {
        bgMusicRef.current.pause();
      }
    };
  }, [isStarted, isMuted, volume]);

  const startCelebration = useCallback(() => {
    setIsStarted(true);
  }, []);

  return (
    <div className="relative min-h-screen bg-[#050510] overflow-hidden text-white font-sans">
      {/* Background Ambience Layer */}
      <div className="fixed inset-0 pointer-events-none bg-gradient-to-b from-[#0a0a20] via-[#100a1a] to-[#050505] z-0" />
      
      {!isStarted ? (
        <WelcomeScreen onStart={startCelebration} />
      ) : (
        <MainCelebration 
          timezone={activeTimezone}
          reduceEffects={reduceEffects}
          isMuted={isMuted}
          volume={volume}
          onTimezoneChange={setActiveTimezone}
        />
      )}

      {/* Global Controls - Only show after start */}
      {isStarted && (
        <>
          <AudioController 
            isMuted={isMuted} 
            volume={volume} 
            onMuteToggle={() => setIsMuted(!isMuted)} 
            onVolumeChange={setVolume} 
          />
          <SettingsPanel 
            reduceEffects={reduceEffects} 
            onToggleEffects={() => setReduceEffects(!reduceEffects)} 
          />
        </>
      )}

      {/* Footer */}
      <footer className="fixed bottom-4 left-0 right-0 text-center z-50 pointer-events-none opacity-40 hover:opacity-100 transition-opacity">
        <p className="text-[10px] tracking-[0.2em] font-light uppercase">
          Copyright © 2025 JHDZ Happy New Year
        </p>
      </footer>
    </div>
  );
};

export default App;
