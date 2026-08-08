import React, { useEffect, useRef } from "react";

export default function ParticleBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    // 1. FASTER PARTICLES ACROSS WHOLE VIEWPORT (55 count)
    const particleCount = 55;
    const colors = ["rgba(124, 108, 251, ", "rgba(63, 214, 224, ", "rgba(151, 151, 172, "];
    const particles = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2 + 1,
        colorPrefix: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.45 + 0.15,
        vx: (Math.random() - 0.5) * 1.3,
        vy: (Math.random() - 0.5) * 1.3,
      });
    }

    // 2. 3D ROTATING HALO RINGS ROAMING FULL VIEWPORT
    const haloColors = [
      "rgba(63, 214, 224, 0.85)",  // Neon Cyan
      "rgba(124, 108, 251, 0.85)", // Neon Violet
      "rgba(255, 138, 0, 0.85)",   // Radiant Amber
      "rgba(63, 214, 224, 0.7)",   // Soft Cyan
    ];

    const halos = Array.from({ length: 1 }).map((_, idx) => ({
      x: Math.random() * (width - 120) + 60,
      y: Math.random() * (height - 120) + 60,
      baseRadius: Math.random() * 8 + 16,
      angle3D: Math.random() * Math.PI * 2,
      spinSpeed3D: (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 0.03 + 0.02),
      tiltAngle: Math.random() * Math.PI,
      vx: (Math.random() - 0.5) * 1.1,
      vy: (Math.random() - 0.5) * 1.1,
      color: haloColors[idx % haloColors.length],
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw particle constellation connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 125) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(124, 108, 251, ${0.14 * (1 - dist / 125)})`;
            ctx.lineWidth = 0.6;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw & move particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${p.colorPrefix}${p.alpha})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = `${p.colorPrefix}0.7)`;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Draw & move 3D spinning halo rings
      halos.forEach((h) => {
        h.x += h.vx;
        h.y += h.vy;
        h.angle3D += h.spinSpeed3D;

        if (h.x < 30 || h.x > width - 30) h.vx *= -1;
        if (h.y < 30 || h.y > height - 30) h.vy *= -1;

        const scaleY = Math.abs(Math.sin(h.angle3D)) * 0.75 + 0.15;
        const currentRadiusX = h.baseRadius;
        const currentRadiusY = h.baseRadius * scaleY;

        ctx.save();
        ctx.beginPath();
        ctx.ellipse(h.x, h.y, currentRadiusX, currentRadiusY, h.tiltAngle, 0, Math.PI * 2);
        ctx.strokeStyle = h.color;
        ctx.lineWidth = 2.2;
        ctx.shadowBlur = 18;
        ctx.shadowColor = h.color;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(h.x, h.y, 1.2, 0, Math.PI * 2);
        ctx.fillStyle = h.color;
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 w-full h-full"
    />
  );
}
