import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  radius: number;
  speedX: number;
  speedY: number;
  color: string;
  alpha: number;
  minAlpha: number;
  maxAlpha: number;
  pulseSpeed: number;
}

interface FlowingParticlesProps {
  count?: number;
  className?: string;
  connectLines?: boolean;
  fixed?: boolean;
}

export const FlowingParticles: React.FC<FlowingParticlesProps> = ({
  count = 160,
  className = '',
  connectLines = false,
  fixed = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let cssWidth = 0;
    let cssHeight = 0;

    const updateDimensions = () => {
      if (!canvas) return;
      const dpr = window.devicePixelRatio || 1;

      if (fixed) {
        cssWidth = window.innerWidth;
        cssHeight = window.innerHeight;
      } else {
        cssWidth = canvas.parentElement?.clientWidth || window.innerWidth;
        cssHeight = canvas.parentElement?.clientHeight || window.innerHeight;
      }

      // Crisp HiDPI / Retina canvas configuration to prevent blurry rendering on Windows displays
      canvas.width = Math.floor(cssWidth * dpr);
      canvas.height = Math.floor(cssHeight * dpr);
      canvas.style.width = `${cssWidth}px`;
      canvas.style.height = `${cssHeight}px`;

      ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset transform
      ctx.scale(dpr, dpr);
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);

    // Vibrant, clear particle color palette (Amber, Gold, Sunlight, Starlight White)
    const colors = [
      '251, 191, 36',  // Pure radiant gold
      '245, 158, 11',  // Deep amber
      '253, 224, 71',  // Bright warm sunlight
      '250, 204, 21',  // Vivid electric gold
      '255, 255, 255', // Crisp starlight white
    ];

    // Compute dynamic density based on screen area to ensure dots cover the entire wide display
    const area = cssWidth * cssHeight;
    const targetCount = Math.max(count, Math.min(260, Math.floor(area / 7500)));

    const particles: Particle[] = [];
    for (let i = 0; i < targetCount; i++) {
      const color = colors[Math.floor(Math.random() * colors.length)];
      // Size distribution: mostly 1.5-2.5px, some prominent 3-4px dots
      const sizeTier = Math.random();
      let radius: number;
      if (sizeTier < 0.6) {
        radius = Math.random() * 0.8 + 1.4; // 1.4px to 2.2px (crisp clear small dots)
      } else if (sizeTier < 0.9) {
        radius = Math.random() * 0.9 + 2.2; // 2.2px to 3.1px (medium bright dots)
      } else {
        radius = Math.random() * 1.0 + 3.1; // 3.1px to 4.1px (prominent glowing orbs)
      }

      const minAlpha = Math.random() * 0.2 + 0.45; // 0.45 to 0.65 - always clearly visible
      const maxAlpha = Math.random() * 0.25 + 0.75; // 0.75 to 1.0 - vibrant peak

      particles.push({
        x: Math.random() * cssWidth,
        y: Math.random() * cssHeight,
        radius,
        speedX: (Math.random() - 0.5) * 0.4,
        speedY: -Math.random() * 0.5 - 0.2, // Smooth upward floating movement
        color,
        alpha: Math.random() * (maxAlpha - minAlpha) + minAlpha,
        minAlpha,
        maxAlpha,
        pulseSpeed: (Math.random() * 0.008 + 0.004) * (Math.random() > 0.5 ? 1 : -1),
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, cssWidth, cssHeight);

      // Optional subtle constellation lines if enabled
      if (connectLines) {
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 90) {
              const lineAlpha = (1 - dist / 90) * 0.12;
              ctx.strokeStyle = `rgba(245, 158, 11, ${lineAlpha})`;
              ctx.lineWidth = 0.5;
              ctx.beginPath();
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
              ctx.stroke();
            }
          }
        }
      }

      // Render crisp, unmistakable floating dots
      for (const p of particles) {
        p.x += p.speedX;
        p.y += p.speedY;

        // Gentle breathing brightness oscillation (dots never fade into invisible smudges)
        p.alpha += p.pulseSpeed;
        if (p.alpha >= p.maxAlpha) {
          p.alpha = p.maxAlpha;
          p.pulseSpeed = -Math.abs(p.pulseSpeed);
        } else if (p.alpha <= p.minAlpha) {
          p.alpha = p.minAlpha;
          p.pulseSpeed = Math.abs(p.pulseSpeed);
        }

        // Seamless boundary respawn across all 4 edges
        if (p.y < -15) {
          p.y = cssHeight + 15;
          p.x = Math.random() * cssWidth;
        } else if (p.y > cssHeight + 15) {
          p.y = -15;
          p.x = Math.random() * cssWidth;
        }

        if (p.x < -15) {
          p.x = cssWidth + 15;
          p.y = Math.random() * cssHeight;
        } else if (p.x > cssWidth + 15) {
          p.x = -15;
          p.y = Math.random() * cssHeight;
        }

        // Draw clear, razor-sharp dot
        ctx.save();

        // 1. Soft atmospheric halo
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius + 1.2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color}, ${p.alpha * 0.22})`;
        ctx.fill();

        // 2. Clear, solid, brightly lit dot core
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color}, ${p.alpha})`;
        ctx.shadowBlur = 4;
        ctx.shadowColor = `rgba(${p.color}, 0.85)`;
        ctx.fill();

        // 3. Starlight pinpoint white spark in the center for clear definition
        if (p.radius >= 2.0) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius * 0.45, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(1, p.alpha + 0.3)})`;
          ctx.shadowBlur = 0;
          ctx.fill();
        }

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
