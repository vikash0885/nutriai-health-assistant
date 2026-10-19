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
  fixed?: boolean;
}

export const FlowingParticles: React.FC<FlowingParticlesProps> = ({
  count = 70,
  className = '',
  connectLines = true,
  fixed = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;

    const updateDimensions = () => {
      if (!canvas) return;
      if (fixed) {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
      } else {
        width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
        height = canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);

    const colors = [
      '245, 158, 11',  // radiant amber
      '251, 191, 36',  // golden yellow
      '253, 224, 71',  // bright gold
      '255, 255, 255', // starlight white
    ];

    const particles: Particle[] = [];
    const particleCount = count || Math.min(85, Math.floor((width * height) / 11000));

    for (let i = 0; i < particleCount; i++) {
      const color = colors[Math.floor(Math.random() * colors.length)];
      const maxAlpha = Math.random() * 0.45 + 0.35;
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2.2 + 1.1,
        speedX: (Math.random() - 0.5) * 0.45,
        speedY: -Math.random() * 0.5 - 0.18, // gently flow upwards
        color,
        alpha: Math.random() * maxAlpha,
        pulseSpeed: (Math.random() * 0.012 + 0.006) * (Math.random() > 0.5 ? 1 : -1),
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
            if (dist < 90) {
              const lineAlpha = (1 - dist / 90) * 0.12;
              ctx.strokeStyle = `rgba(245, 158, 11, ${lineAlpha})`;
              ctx.lineWidth = 0.55;
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
        } else if (p.alpha < 0.1) {
          p.alpha = 0.1;
          p.pulseSpeed = Math.abs(p.pulseSpeed);
        }

        // Loop boundaries smoothly
        if (p.y < -12) {
          p.y = height + 10;
          p.x = Math.random() * width;
        } else if (p.y > height + 12) {
          p.y = -10;
        }

        if (p.x < -12) {
          p.x = width + 10;
        } else if (p.x > width + 12) {
          p.x = -10;
        }

        // Render dot with radiant bloom
        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color}, ${p.alpha})`;
        ctx.shadowBlur = 9;
        ctx.shadowColor = `rgba(${p.color}, 0.8)`;
        ctx.fill();
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', updateDimensions);
      cancelAnimationFrame(animationFrameId);
    };
  }, [count, connectLines, fixed]);

  const basePosition = fixed ? 'fixed inset-0 w-screen h-screen' : 'absolute inset-0 w-full h-full';

  return (
    <canvas
      ref={canvasRef}
      className={`${basePosition} pointer-events-none ${className}`}
      style={{ zIndex: 0 }}
    />
  );
};
