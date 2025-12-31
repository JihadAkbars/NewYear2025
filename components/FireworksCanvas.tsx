
import React, { useEffect, useRef } from 'react';
import { AUDIO_URLS } from '../constants';

interface Props {
  isMidnight: boolean;
  reduceEffects: boolean;
  isMuted: boolean;
  volume: number;
}

const FireworksCanvas: React.FC<Props> = ({ isMidnight, reduceEffects, isMuted, volume }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const audioPool = useRef<HTMLAudioElement[]>([]);
  const poolSize = 30;

  useEffect(() => {
    const pool: HTMLAudioElement[] = [];
    const variants = AUDIO_URLS.fireworkVariants;
    
    for (let i = 0; i < poolSize; i++) {
      // Distribute variants across the pool
      const variantUrl = variants[i % variants.length];
      const audio = new Audio(variantUrl);
      audio.preload = 'auto';
      pool.push(audio);
    }
    audioPool.current = pool;
  }, []);

  const playFirecrackerSfx = (customVolume: number = 1) => {
    if (isMuted) return;
    
    // Find all currently available audio elements in the pool
    const available = audioPool.current.filter(a => a.paused || a.ended);
    
    if (available.length > 0) {
      // Randomly select one from the available pool for sound variety
      const audio = available[Math.floor(Math.random() * available.length)];
      audio.volume = Math.min(volume * customVolume, 1);
      audio.currentTime = 0;
      audio.play().catch(() => {
        // Handle potential autoplay restrictions or rapid trigger errors
      });
    }
  };

  class Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    alpha: number;
    color: string;
    decay: number;
    friction: number;
    gravity: number;
    size: number;
    flicker: boolean;
    hasTrail: boolean;
    life: number;

    constructor(
      x: number,
      y: number,
      color: string,
      speed: number,
      angle: number,
      options: {
        gravity?: number;
        friction?: number;
        decay?: number;
        size?: number;
        flicker?: boolean;
        hasTrail?: boolean;
      } = {}
    ) {
      this.x = x;
      this.y = y;
      this.vx = Math.cos(angle) * speed;
      this.vy = Math.sin(angle) * speed;
      this.color = color;
      this.alpha = 1;
      this.gravity = options.gravity ?? 0.04;
      this.friction = options.friction ?? 0.96;
      this.decay = options.decay ?? (Math.random() * 0.02 + 0.01);
      this.size = options.size ?? (Math.random() * 2 + 1);
      this.flicker = options.flicker ?? Math.random() > 0.5;
      this.hasTrail = options.hasTrail ?? false;
      this.life = 1;
    }

    update() {
      this.vx *= this.friction;
      this.vy *= this.friction;
      this.vy += this.gravity;
      this.x += this.vx;
      this.y += this.vy;
      this.alpha -= this.decay;
      this.life -= this.decay;
    }

    draw(ctx: CanvasRenderingContext2D) {
      if (this.alpha <= 0) return;
      ctx.save();
      ctx.globalAlpha = this.flicker ? this.alpha * (Math.random() * 0.4 + 0.6) : this.alpha;
      ctx.fillStyle = this.color;
      
      if (this.size > 2) {
        ctx.shadowBlur = 8;
        ctx.shadowColor = this.color;
      }

      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resize);
    resize();

    const palettes = [
      ['#ffd700', '#ffffff', '#ff8c00'], // Gold & White
      ['#ff00ff', '#8a2be2', '#4b0082'], // Purple & Indigo
      ['#00ffff', '#00ced1', '#ffffff'], // Teal & Cyan
      ['#ff4500', '#ff8c00', '#ffff00'], // Fire
      ['#ff69b4', '#ff1493', '#ffffff'], // Pink & Rose
      ['#adff2f', '#00ff00', '#32cd32'], // Neon Green
    ];

    const createBurst = (x: number, y: number, forceType?: string) => {
      if (reduceEffects && particles.current.length > 300) return;
      
      const palette = palettes[Math.floor(Math.random() * palettes.length)];
      const types = ['classic', 'ring', 'willow', 'crackle', 'star'];
      // At midnight, randomize types more aggressively
      const type = forceType || (isMidnight ? types[Math.floor(Math.random() * types.length)] : types[0]);
      
      const count = reduceEffects ? 30 : (type === 'willow' ? 80 : 100);
      // Intensify particle count at midnight
      const finalCount = isMidnight ? count * 1.5 : count;

      switch(type) {
        case 'ring':
          for (let i = 0; i < finalCount; i++) {
            const angle = (i / finalCount) * Math.PI * 2;
            const speed = (isMidnight ? 8 : 6) + Math.random() * 0.5;
            particles.current.push(new Particle(x, y, palette[i % palette.length], speed, angle, {
              friction: 0.97,
              size: 2,
              decay: 0.012
            }));
          }
          break;

        case 'willow':
          for (let i = 0; i < finalCount; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 4 + 2;
            particles.current.push(new Particle(x, y, '#ffd700', speed, angle, {
              gravity: 0.02,
              friction: 0.98,
              decay: 0.008,
              size: 1.2,
              hasTrail: !reduceEffects
            }));
          }
          break;

        case 'crackle':
          for (let i = 0; i < finalCount / 2; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 8 + 2;
            const p = new Particle(x, y, palette[Math.floor(Math.random() * palette.length)], speed, angle, {
              decay: 0.03,
              friction: 0.94
            });
            particles.current.push(p);
            
            // Add tiny delayed bursts for the 'crackle' effect
            setTimeout(() => {
              if (Math.random() > 0.4) {
                const subX = p.x + p.vx * 10;
                const subY = p.y + p.vy * 10;
                for (let j = 0; j < 5; j++) {
                  particles.current.push(new Particle(subX, subY, '#ffffff', Math.random() * 2, Math.random() * Math.PI * 2, {
                    size: 0.8,
                    decay: 0.05,
                    flicker: true
                  }));
                }
                // Small crackle pop sound
                playFirecrackerSfx(0.15);
              }
            }, 400 + Math.random() * 200);
          }
          break;

        case 'star':
          const points = 5;
          for (let i = 0; i < finalCount; i++) {
            const angle = (i / finalCount) * Math.PI * 2;
            const r = Math.abs(Math.sin(angle * points / 2));
            const speed = (2 + r * (isMidnight ? 10 : 6)) * (0.9 + Math.random() * 0.2);
            particles.current.push(new Particle(x, y, palette[1], speed, angle, {
              friction: 0.95,
              decay: 0.015,
              size: 2
            }));
          }
          break;

        default: // Classic
          for (let i = 0; i < finalCount; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * (isMidnight ? 10 : 7) + 1;
            particles.current.push(new Particle(x, y, palette[Math.floor(Math.random() * palette.length)], speed, angle, {
              hasTrail: !reduceEffects && Math.random() > 0.8,
              flicker: isMidnight
            }));
          }
      }

      // Play a random firework variant sound for the main burst
      playFirecrackerSfx(type === 'willow' || type === 'ring' ? 0.9 : 0.7);
    };

    const animate = () => {
      // Midnight intensity: darker backgrounds and higher contrast
      ctx.fillStyle = isMidnight ? 'rgba(5, 2, 15, 0.25)' : 'rgba(5, 5, 16, 0.2)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const chance = isMidnight ? 0.15 : 0.012;
      if (Math.random() < chance && !reduceEffects) {
        createBurst(
          Math.random() * canvas.width, 
          Math.random() * canvas.height * 0.6 + 50
        );
      }

      for (let i = particles.current.length - 1; i >= 0; i--) {
        const p = particles.current[i];
        p.update();

        if (p.hasTrail && Math.random() > 0.6 && p.life > 0.2) {
            particles.current.push(new Particle(p.x, p.y, p.color, 0.1, 0, {
                size: p.size * 0.6,
                decay: 0.1,
                friction: 1,
                gravity: 0.01,
                flicker: false
            }));
        }

        if (p.alpha <= 0) {
          particles.current.splice(i, 1);
        } else {
          p.draw(ctx);
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    const handleClick = (e: MouseEvent) => {
      createBurst(e.clientX, e.clientY);
    };

    window.addEventListener('click', handleClick);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('click', handleClick);
    };
  }, [isMidnight, reduceEffects, isMuted, volume]);

  return (
    <canvas 
      ref={canvasRef} 
      className="block w-full h-full cursor-crosshair opacity-90"
    />
  );
};

export default FireworksCanvas;
