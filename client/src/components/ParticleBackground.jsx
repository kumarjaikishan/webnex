import React, { useEffect, useRef } from "react";

export default function ParticleBackground() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container && !canvas) return;

    const targetCanvas = canvas || container;
    const ctx = targetCanvas.getContext("2d");
    let animationFrameId;

    let width = (targetCanvas.width = window.innerWidth);
    let height = (targetCanvas.height = window.innerHeight);
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const applyDpr = () => {
      targetCanvas.width = width * dpr;
      targetCanvas.height = height * dpr;
      targetCanvas.style.width = `${width}px`;
      targetCanvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    applyDpr();

    // ---------------------------------------------------------------------------
    // 1. PREVIOUS FASTER PARTICLES & CONSTELLATION LINES (UNTOUCHED)
    // ---------------------------------------------------------------------------
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

    // ---------------------------------------------------------------------------
    // 2. NEW 3D ROAMING HALO RING (COPIED EXACTLY FROM portfolio_claude)
    // ---------------------------------------------------------------------------
    const baseRadius = Math.max(width, height) * 0.85;
    const baseHaloRadius = 46;

    const initialOrbitAngle = Math.random() * Math.PI * 2;
    const initialSelfAngleX = Math.random() * Math.PI * 2;
    const initialSelfAngleY = Math.random() * Math.PI * 2;

    let globalAngleY = 0;
    let targetSpeedY = 0.0017;

    const handleMouseMove = (e) => {
      const x = e.clientX - width / 2;
      targetSpeedY = 0.0015 + (x / width) * 0.0025;
    };

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      applyDpr();
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);

    const startTime = performance.now();
    const fov = 600;

    const haloColor = "rgba(90, 215, 215, 0.95)"; // Exact vibrant cyan teal from reference image


    const render = (now) => {
      const elapsed = now - startTime;

      ctx.clearRect(0, 0, width, height);

      // --- Draw particle constellation connections ---
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

      // --- Draw & move particles ---
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

      // --- Draw 3D Roaming Halo Ring matching reference image ---
      const cx = width / 2;
      const cy = height / 2;

      globalAngleY += targetSpeedY;
      const angleX = 0.1;
      const angleY = globalAngleY;

      const cosX = Math.cos(angleX);
      const sinX = Math.sin(angleX);
      const cosY = Math.cos(angleY);
      const sinY = Math.sin(angleY);

      const project = (x, y, z) => {
        const denom = Math.max(fov + z + baseRadius, fov * 0.4);
        const scale = fov / denom;
        return { x: cx + x * scale, y: cy + y * scale, scale };
      };

      const rotateY = (x, y, z, c, s) => ({ x: x * c - z * s, y, z: x * s + z * c });
      const rotateX = (x, y, z, c, s) => ({ x, y: y * c - z * s, z: y * s + z * c });

      const selfAngleX = initialSelfAngleX + elapsed * 0.0002;
      const selfAngleY = initialSelfAngleY + elapsed * 0.0003;
      const sCosX = Math.cos(selfAngleX);
      const sSinX = Math.sin(selfAngleX);
      const sCosY = Math.cos(selfAngleY);
      const sSinY = Math.sin(selfAngleY);

      const orbitR = baseRadius * 0.65;
      const orbitAngle = initialOrbitAngle + elapsed * 0.00015;
      const orbitX = Math.cos(orbitAngle) * orbitR;
      const orbitY = Math.sin(orbitAngle * 0.7) * (baseRadius * 0.25);
      const orbitZ = Math.sin(orbitAngle) * orbitR;

      const haloScale = 1 + Math.sin(elapsed * 0.0008) * 0.18;
      const currentHaloRadius = baseHaloRadius * haloScale;

      const rotateBasis = (vx, vy, vz) => {
        let s1 = rotateY(vx, vy, vz, sCosY, sSinY);
        let s2 = rotateX(s1.x, s1.y, s1.z, sCosX, sSinX);
        let g1 = rotateY(s2.x, s2.y, s2.z, cosY, sinY);
        return rotateX(g1.x, g1.y, g1.z, cosX, sinX);
      };

      const centerLocal = rotateY(orbitX, orbitY, orbitZ, cosY, sinY);
      const centerRotated = rotateX(centerLocal.x, centerLocal.y, centerLocal.z, cosX, sinX);
      const centerProj = project(centerRotated.x, centerRotated.y, centerRotated.z);

      const uAxis = rotateBasis(currentHaloRadius, 0, 0);
      const vAxis = rotateBasis(0, currentHaloRadius, 0);
      const u2d = { x: uAxis.x * centerProj.scale, y: uAxis.y * centerProj.scale };
      const v2d = { x: vAxis.x * centerProj.scale, y: vAxis.y * centerProj.scale };

      const RING_SEGMENTS = 56;
      const tracePath = () => {
        ctx.beginPath();
        for (let i = 0; i <= RING_SEGMENTS; i++) {
          const a = (i / RING_SEGMENTS) * Math.PI * 2;
          const ca = Math.cos(a);
          const sa = Math.sin(a);
          const px = centerProj.x + u2d.x * ca + v2d.x * sa;
          const py = centerProj.y + u2d.y * ca + v2d.y * sa;
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
      };

      ctx.save();
      tracePath();
      ctx.lineWidth = 2.2;
      ctx.strokeStyle = haloColor;
      ctx.shadowBlur = 10;
      ctx.shadowColor = "rgba(90, 215, 215, 0.6)";
      ctx.stroke();
      ctx.restore();


      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none" ref={containerRef}>
      <canvas className="block w-full h-full" ref={canvasRef} />
    </div>
  );
}
