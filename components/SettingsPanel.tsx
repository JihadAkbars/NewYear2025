
import React from 'react';

interface SettingsPanelProps {
  reduceEffects: boolean;
  onToggleEffects: () => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ reduceEffects, onToggleEffects }) => {
  return (
    <div className="fixed top-8 right-8 z-[150]">
      <div className="flex items-center space-x-4 bg-[#0a0a20]/40 backdrop-blur-md border border-white/5 p-2 rounded-full pl-6">
        <span className="text-[10px] tracking-widest text-gray-400 uppercase font-light">
          {reduceEffects ? 'Safe Mode' : 'Full FX'}
        </span>
        <button
          onClick={onToggleEffects}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${reduceEffects ? 'bg-gold-500/20' : 'bg-gold-500'}`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${reduceEffects ? 'translate-x-1' : 'translate-x-6'}`}
          />
        </button>
      </div>
    </div>
  );
};

export default SettingsPanel;
