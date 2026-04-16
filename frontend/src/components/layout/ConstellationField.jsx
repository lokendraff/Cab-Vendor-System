import React, { useRef, useEffect, useCallback } from 'react';

/**
 * ConstellationField — Interactive "Shattering Constellation" Background
 * 
 * Particles form a subtle tech-node grid pattern. When the user's cursor
 * moves near them, particles scatter (repel/bounce). They slowly drift
 * back to their original positions once the cursor leaves.
 * 
 * Zero external dependencies — pure Canvas API for maximum performance.
 * Themed to match FleetMaster's Space Dark + Golden aesthetic.
 */
const ConstellationField = () => {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const particlesRef = useRef([]);
  const animationRef = useRef(null);

  const initParticles = useCallback((width, height) => {
    const particles = [];
    // Grid-based placement for "structured constellation" feel
    const cols = Math.floor(width / 80);
    const rows = Math.floor(height / 80);
    const spacingX = width / (cols + 1);
    const spacingY = height / (rows + 1);

    for (let row = 1; row <= rows; row++) {
      for (let col = 1; col <= cols; col++) {
        // Add slight randomness to grid positions for organic feel
        const originX = col * spacingX + (Math.random() - 0.5) * 30;
        const originY = row * spacingY + (Math.random() - 0.5) * 30;
        const isGolden = Math.random() > 0.82;

        particles.push({
          x: originX,
          y: originY,
          originX,
          originY,
          vx: 0,
          vy: 0,
          radius: Math.random() * 1.8 + 0.6,
          opacity: Math.random() * 0.35 + 0.08,
          baseOpacity: Math.random() * 0.35 + 0.08,
          isGolden,
          // Each particle has a unique return speed for staggered reformation
          returnSpeed: Math.random() * 0.015 + 0.008,
          // Twinkle
          twinklePhase: Math.random() * Math.PI * 2,
          twinkleSpeed: Math.random() * 0.015 + 0.005,
        });
      }
    }

    return particles;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // --- Resize ---
    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
      particlesRef.current = initParticles(rect.width, rect.height);
    };
    resize();
    window.addEventListener('resize', resize);

    // --- Mouse tracking ---
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };
    const handleMouseLeave = () => {
      mouseRef.current = { x: -9999, y: -9999 };
    };

    // Listen on the parent container, not the canvas (canvas is pointer-events-none)
    const parent = canvas.parentElement;
    parent?.addEventListener('mousemove', handleMouseMove);
    parent?.addEventListener('mouseleave', handleMouseLeave);

    // --- Configuration ---
    const REPEL_RADIUS = 120;
    const REPEL_FORCE = 8;
    const CONNECTION_DIST = 100;
    const FRICTION = 0.92;

    // --- Animation Loop ---
    const animate = () => {
      const particles = particlesRef.current;
      const { width, height } = canvas.getBoundingClientRect();
      const mouse = mouseRef.current;

      ctx.clearRect(0, 0, width, height);

      // Update & draw connections first (behind particles)
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < CONNECTION_DIST) {
            const alpha = (1 - dist / CONNECTION_DIST) * 0.06;
            const isGoldenLine = particles[i].isGolden || particles[j].isGolden;

            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = isGoldenLine
              ? `rgba(212, 168, 83, ${alpha * 1.5})`
              : `rgba(255, 255, 255, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      // Update & draw particles
      particles.forEach((p) => {
        // Twinkle
        p.twinklePhase += p.twinkleSpeed;
        const twinkle = Math.sin(p.twinklePhase) * 0.15 + 0.85;

        // Mouse repulsion
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const distToMouse = Math.sqrt(dx * dx + dy * dy);

        if (distToMouse < REPEL_RADIUS && distToMouse > 0) {
          const force = (REPEL_RADIUS - distToMouse) / REPEL_RADIUS;
          const angle = Math.atan2(dy, dx);
          p.vx += Math.cos(angle) * force * REPEL_FORCE;
          p.vy += Math.sin(angle) * force * REPEL_FORCE;
          // Brighten on interaction
          p.opacity = Math.min(p.baseOpacity * 3, 0.8);
        } else {
          // Fade back to base opacity
          p.opacity += (p.baseOpacity - p.opacity) * 0.03;
        }

        // Apply velocity with friction
        p.vx *= FRICTION;
        p.vy *= FRICTION;
        p.x += p.vx;
        p.y += p.vy;

        // Spring back to origin (the "reform" effect)
        const dxOrigin = p.originX - p.x;
        const dyOrigin = p.originY - p.y;
        p.x += dxOrigin * p.returnSpeed;
        p.y += dyOrigin * p.returnSpeed;

        // Draw particle
        const alpha = p.opacity * twinkle;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);

        if (p.isGolden) {
          ctx.fillStyle = `rgba(212, 168, 83, ${alpha})`;
          ctx.shadowColor = 'rgba(212, 168, 83, 0.4)';
          ctx.shadowBlur = 8;
        } else {
          ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.8})`;
          ctx.shadowColor = 'transparent';
          ctx.shadowBlur = 0;
        }

        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', resize);
      parent?.removeEventListener('mousemove', handleMouseMove);
      parent?.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [initParticles]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
      style={{ background: 'transparent' }}
    />
  );
};

export default ConstellationField;
