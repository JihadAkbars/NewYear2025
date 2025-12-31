
import React, { useState, useEffect } from 'react';
import { FLOATING_MESSAGES } from '../constants';

const FloatingMessages: React.FC = () => {
  const [currentMessage, setCurrentMessage] = useState(FLOATING_MESSAGES[0]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const cycle = () => {
      setIsVisible(true);
      setTimeout(() => setIsVisible(false), 5000); // fade out after 5s
    };

    const interval = setInterval(() => {
      const next = FLOATING_MESSAGES[Math.floor(Math.random() * FLOATING_MESSAGES.length)];
      setCurrentMessage(next);
      cycle();
    }, 10000); // new message every 10s

    cycle(); // initial trigger

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[5] overflow-hidden">
      <div 
        className={`absolute bottom-1/4 left-1/2 -translate-x-1/2 transition-all duration-1000 ease-in-out transform
          ${isVisible ? 'opacity-30 translate-y-0' : 'opacity-0 translate-y-10'}`}
      >
        <p className="text-xl md:text-2xl font-garamond italic text-white text-center max-w-lg px-4">
          <span className="text-gold-500/40 text-3xl align-top mr-1">“</span>
          {currentMessage}
          <span className="text-gold-500/40 text-3xl align-bottom ml-1">”</span>
        </p>
      </div>
      
      {/* Decorative floating dots */}
      {[...Array(20)].map((_, i) => (
        <div 
          key={i}
          className="absolute rounded-full bg-gold-500/20 animate-float"
          style={{
            width: Math.random() * 4 + 2 + 'px',
            height: Math.random() * 4 + 2 + 'px',
            top: Math.random() * 100 + '%',
            left: Math.random() * 100 + '%',
            animationDuration: Math.random() * 10 + 10 + 's',
            animationDelay: Math.random() * 5 + 's',
          }}
        />
      ))}
      <style>{`
        @keyframes float {
          0% { transform: translateY(0) translateX(0); opacity: 0; }
          50% { opacity: 0.5; }
          100% { transform: translateY(-100px) translateX(20px); opacity: 0; }
        }
        .animate-float { animation: float linear infinite; }
      `}</style>
    </div>
  );
};

export default FloatingMessages;
