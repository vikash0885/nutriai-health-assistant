import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  color: string;
  alpha: number;
  pulseSpeed: number;
  maxAlpha: number;
}

interface FlowingParticlesProps {
  count?: number;
  className?: string;
  connectLines?: boolean;
}

export const FlowingParticles: React.FC<FlowingParticlesProps> = ({
  count = 60,
  className = '',
  connectLines = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener('resize', handleResize);

    const colors = [
      '245, 158, 11',  // warm amber
      '251, 191, 36',  // golden yellow
      '253, 224, 71',  // soft sunlight
      '255, 255, 255', // starlight white
    ];

    const particles: Particle[] = [];
    const particleCount = Math.min(count, Math.floor((width * height) / 10000) || 45);

    for (let i = 0; i < particleCount; i++) {
      const color = colors[Math.floor(Math.random() * colors.length)];
      const maxAlpha = Math.random() * 0.5 + 0.35;
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2.2 + 1.2,
        speedX: (Math.random() - 0.5) * 0.4,
        speedY: -Math.random() * 0.5 - 0.2, // gently flow upwards
        color,
        alpha: Math.random() * maxAlpha,
        pulseSpeed: (Math.random() * 0.015 + 0.005) * (Math.random() > 0.5 ? 1 : -1),
        maxAlpha,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Subtle constellation lines between nearby floating dots
      if (connectLines) {
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 95) {
              const lineAlpha = (1 - dist / 95) * 0.14;
              ctx.strokeStyle = `rgba(245, 158, 11, ${lineAlpha})`;
              ctx.lineWidth = 0.6;
              ctx.beginPath();
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
              ctx.stroke();
            }
          }
        }
      }

      // Draw and move floating glowing dots
      for (const p of particles) {
        p.x += p.speedX;
        p.y += p.speedY;

        p.alpha += p.pulseSpeed;
        if (p.alpha > p.maxAlpha) {
          p.alpha = p.maxAlpha;
          p.pulseSpeed = -Math.abs(p.pulseSpeed);
        } else if (p.alpha < 0.12) {
          p.alpha = 0.12;
          p.pulseSpeed = Math.abs(p.pulseSpeed);
        }

        // Loop boundaries smoothly
        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        } else if (p.y > height + 10) {
          p.y = -10;
        }

        if (p.x < -10) {
          p.x = width + 10;
        } else if (p.x > width + 10) {
          p.x = -10;
        }

        // Render dot with radiant bloom
        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color}, ${p.alpha})`;
        ctx.shadowBlur = 10;
        ctx.shadowColor = `rgba(${p.color}, 0.85)`;
        ctx.fill();
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [count, connectLines]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none w-full h-full ${className}`}
      style={{ zIndex: 0 }}
    />
  );
};
