
import React, { useState } from 'react';
import { Wish } from '../types';

interface WishModalProps {
  onClose: () => void;
  onSubmit: (wish: { name: string; text: string }) => void;
  existingWishes: Wish[];
}

const WishModal: React.FC<WishModalProps> = ({ onClose, onSubmit, existingWishes }) => {
  const [name, setName] = useState('');
  const [wishText, setWishText] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !wishText) return;
    onSubmit({ name, text: wishText });
    setSubmitted(true);
    setTimeout(() => {
      onClose();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-[#050510]/80 backdrop-blur-md"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-lg bg-[#0a0a20] border border-white/10 rounded-3xl p-8 shadow-2xl animate-in zoom-in slide-in-from-bottom duration-500">
        {!submitted ? (
          <>
            <h3 className="text-2xl font-serif-elegant font-bold text-gold-400 mb-2">
              Future Wishes
            </h3>
            <p className="text-gray-400 text-sm font-light mb-8">
              Write down your hopes and best prayers for 2025.
            </p>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-gray-500 ml-4">Your Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex JHDZ"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-gold-500/50 transition-all text-white placeholder:text-gray-700"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-gray-500 ml-4">Your Wish</label>
                <textarea
                  required
                  rows={4}
                  value={wishText}
                  onChange={(e) => setWishText(e.target.value)}
                  placeholder="In 2025, I hope that..."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-gold-500/50 transition-all text-white resize-none placeholder:text-gray-700"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#b8860b] to-[#ffd700] text-[#050510] font-bold uppercase tracking-widest hover:brightness-110 transition-all shadow-[0_0_20px_rgba(255,215,0,0.2)]"
              >
                Send Wish
              </button>
            </form>
          </>
        ) : (
          <div className="py-12 text-center space-y-4">
            <div className="w-16 h-16 bg-gold-500/20 rounded-full flex items-center justify-center mx-auto text-gold-500 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <h3 className="text-2xl font-serif-elegant font-bold text-white">Thank you, {name}!</h3>
            <p className="text-gray-400 font-light italic">Your wishes have been kept in the night sky...</p>
          </div>
        )}

        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>

      {/* Background Wish Wall */}
      <div className="fixed bottom-0 left-0 w-full p-4 overflow-hidden pointer-events-none opacity-20 h-40">
        <div className="flex space-x-8 animate-marquee">
          {existingWishes.slice(-10).map((w) => (
            <div key={w.id} className="whitespace-nowrap text-xs text-gold-200">
               <span className="font-bold">{w.name}:</span> {w.text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WishModal;
