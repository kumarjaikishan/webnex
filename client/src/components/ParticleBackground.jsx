import React, { useEffect, useRef } from "react";

export default function ParticleBackground({ style = "cyber_grid" }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const applyDpr = () => {
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    applyDpr();

    let mouse = { x: width / 2, y: height / 3, targetX: width / 2, targetY: height / 3 };

    const handleMouseMove = (e) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
    };

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      applyDpr();
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);

    // -------------------------------------------------------------
    // ENGINE 1: PREVIOUS CLASSIC CONSTELLATION & 3D ROAMING HALO
    // -------------------------------------------------------------
    const classicParticleCount = 55;
    const classicColors = ["rgba(124, 108, 251, ", "rgba(63, 214, 224, ", "rgba(151, 151, 172, "];
    const classicParticles = [];

    for (let i = 0; i < classicParticleCount; i++) {
      classicParticles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2 + 1,
        colorPrefix: classicColors[Math.floor(Math.random() * classicColors.length)],
        alpha: Math.random() * 0.45 + 0.15,
        vx: (Math.random() - 0.5) * 1.3,
        vy: (Math.random() - 0.5) * 1.3,
      });
    }

    const baseRadius = Math.max(width, height) * 0.85;
    const baseHaloRadius = 46;
    let globalAngleY = 0;
    const startTime = performance.now();
    const fov = 600;
    const haloColor = "rgba(90, 215, 215, 0.95)";

    // -------------------------------------------------------------
    // ENGINE 2: 21st.dev INTERACTIVE CYBER GRID & SPOTLIGHT
    // -------------------------------------------------------------
    const cyberParticleCount = Math.min(65, Math.floor((width * height) / 22000));
    const cyberColors = [
      { r: 6, g: 182, b: 212 },
      { r: 124, g: 108, b: 251 },
      { r: 56, g: 189, b: 248 },
      { r: 244, g: 114, b: 182 },
    ];
    const cyberParticles = [];
    for (let i = 0; i < cyberParticleCount; i++) {
      const col = cyberColors[Math.floor(Math.random() * cyberColors.length)];
      cyberParticles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2.2 + 0.8,
        color: col,
        alpha: Math.random() * 0.45 + 0.2,
        baseAlpha: Math.random() * 0.45 + 0.2,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        pulseSpeed: Math.random() * 0.02 + 0.01,
        pulsePhase: Math.random() * Math.PI * 2,
      });
    }
    let haloAngle21 = 0;

    // -------------------------------------------------------------
    // ENGINE 3: 3D WARP SPEED HYPERDRIVE & COSMIC STREAKS (WARP SPEED)
    // -------------------------------------------------------------
    const starCount = 320;
    const warpStars = [];
    const warpColors = [
      "rgba(6, 182, 212, ",   // Cyan
      "rgba(139, 92, 246, ",  // Violet
      "rgba(56, 189, 248, ",  // Sky
      "rgba(255, 255, 255, ", // Pure White Starburst
    ];

    for (let i = 0; i < starCount; i++) {
      warpStars.push({
        x: (Math.random() - 0.5) * width * 2.2,
        y: (Math.random() - 0.5) * height * 2.2,
        z: Math.random() * 1000 + 1,
        pz: 0,
        colorPrefix: warpColors[Math.floor(Math.random() * warpColors.length)],
        size: Math.random() * 2.0 + 0.8,
      });
    }

    const render = (now) => {
      ctx.clearRect(0, 0, width, height);

      // =========================================================================
      // MODE 1: PREVIOUS CLASSIC CONSTELLATION & 3D ROAMING HALO RING
      // =========================================================================
      if (style === "classic_particles") {
        const elapsed = now - startTime;

        for (let i = 0; i < classicParticles.length; i++) {
          for (let j = i + 1; j < classicParticles.length; j++) {
            const dx = classicParticles[i].x - classicParticles[j].x;
            const dy = classicParticles[i].y - classicParticles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 125) {
              ctx.beginPath();
              ctx.strokeStyle = `rgba(124, 108, 251, ${0.14 * (1 - dist / 125)})`;
              ctx.lineWidth = 0.6;
              ctx.moveTo(classicParticles[i].x, classicParticles[i].y);
              ctx.lineTo(classicParticles[j].x, classicParticles[j].y);
              ctx.stroke();
            }
          }
        }

        for (let i = 0; i < classicParticles.length; i++) {
          const p = classicParticles[i];
          p.x += p.vx;
          p.y += p.vy;

          if (p.x < 0 || p.x > width) p.vx *= -1;
          if (p.y < 0 || p.y > height) p.vy *= -1;

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = `${p.colorPrefix}${p.alpha})`;
          ctx.fill();
        }

        // Previous 3D Roaming Halo Ring
        globalAngleY += 0.0018;
        const selfAngleX = elapsed * 0.0012;
        const selfAngleY = elapsed * 0.0016;

        const orbitCenterDist = baseRadius * 0.75;
        const ringX = width * 0.5 + Math.cos(globalAngleY) * orbitCenterDist;
        const ringY = height * 0.5 + Math.sin(globalAngleY * 0.7) * (height * 0.28);
        const ringZ = Math.sin(globalAngleY) * (orbitCenterDist * 0.45);

        const ringSegments = 64;
        ctx.beginPath();
        let started = false;

        for (let i = 0; i <= ringSegments; i++) {
          const theta = (i / ringSegments) * Math.PI * 2;
          let lx = Math.cos(theta) * baseHaloRadius;
          let ly = Math.sin(theta) * baseHaloRadius;
          let lz = 0;

          const rx_y = ly * Math.cos(selfAngleX) - lz * Math.sin(selfAngleX);
          const rx_z = ly * Math.sin(selfAngleX) + lz * Math.cos(selfAngleX);
          ly = rx_y;
          lz = rx_z;

          const ry_x = lx * Math.cos(selfAngleY) + lz * Math.sin(selfAngleY);
          const ry_z = -lx * Math.sin(selfAngleY) + lz * Math.cos(selfAngleY);
          lx = ry_x;
          lz = ry_z;

          const wx = ringX + lx;
          const wy = ringY + ly;
          const wz = ringZ + lz;

          const scale = fov / (fov + wz + 300);
          const sx = (wx - width / 2) * scale + width / 2;
          const sy = (wy - height / 2) * scale + height / 2;

          if (!started) {
            ctx.moveTo(sx, sy);
            started = true;
          } else {
            ctx.lineTo(sx, sy);
          }
        }

        ctx.strokeStyle = haloColor;
        ctx.lineWidth = 1.4;
        ctx.shadowColor = "rgba(90, 215, 215, 0.8)";
        ctx.shadowBlur = 10;
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      // =========================================================================
      // MODE 2: 21st.dev INTERACTIVE CYBER GRID & SPOTLIGHT
      // =========================================================================
      else if (style === "cyber_grid") {
        mouse.x += (mouse.targetX - mouse.x) * 0.08;
        mouse.y += (mouse.targetY - mouse.y) * 0.08;

        const spotGrad = ctx.createRadialGradient(
          mouse.x,
          mouse.y,
          0,
          mouse.x,
          mouse.y,
          Math.max(380, width * 0.4)
        );
        spotGrad.addColorStop(0, "rgba(6, 182, 212, 0.07)");
        spotGrad.addColorStop(0.5, "rgba(124, 108, 251, 0.04)");
        spotGrad.addColorStop(1, "rgba(6, 6, 11, 0)");
        ctx.fillStyle = spotGrad;
        ctx.fillRect(0, 0, width, height);

        const auroraGrad1 = ctx.createRadialGradient(width * 0.15, height * 0.2, 0, width * 0.15, height * 0.2, 450);
        auroraGrad1.addColorStop(0, "rgba(124, 108, 251, 0.06)");
        auroraGrad1.addColorStop(1, "transparent");
        ctx.fillStyle = auroraGrad1;
        ctx.fillRect(0, 0, width, height);

        const auroraGrad2 = ctx.createRadialGradient(width * 0.85, height * 0.35, 0, width * 0.85, height * 0.35, 500);
        auroraGrad2.addColorStop(0, "rgba(6, 182, 212, 0.08)");
        auroraGrad2.addColorStop(1, "transparent");
        ctx.fillStyle = auroraGrad2;
        ctx.fillRect(0, 0, width, height);

        const gridSpacing = 48;
        for (let gx = 0; gx < width; gx += gridSpacing) {
          for (let gy = 0; gy < height; gy += gridSpacing) {
            const dx = mouse.x - gx;
            const dy = mouse.y - gy;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 220) {
              const glow = 1 - dist / 220;
              ctx.fillStyle = `rgba(6, 182, 212, ${0.15 + glow * 0.55})`;
              ctx.beginPath();
              ctx.arc(gx, gy, 1.2 + glow * 1.5, 0, Math.PI * 2);
              ctx.fill();
            } else {
              ctx.fillStyle = "rgba(151, 151, 172, 0.07)";
              ctx.fillRect(gx, gy, 1, 1);
            }
          }
        }

        for (let i = 0; i < cyberParticles.length; i++) {
          for (let j = i + 1; j < cyberParticles.length; j++) {
            const dx = cyberParticles[i].x - cyberParticles[j].x;
            const dy = cyberParticles[i].y - cyberParticles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 130) {
              const lineAlpha = (1 - dist / 130) * 0.18;
              ctx.beginPath();
              ctx.strokeStyle = `rgba(6, 182, 212, ${lineAlpha})`;
              ctx.lineWidth = 0.75;
              ctx.moveTo(cyberParticles[i].x, cyberParticles[i].y);
              ctx.lineTo(cyberParticles[j].x, cyberParticles[j].y);
              ctx.stroke();
            }
          }
        }

        for (let i = 0; i < cyberParticles.length; i++) {
          const p = cyberParticles[i];
          p.x += p.vx;
          p.y += p.vy;

          if (p.x < 0 || p.x > width) p.vx *= -1;
          if (p.y < 0 || p.y > height) p.vy *= -1;

          const mdx = mouse.x - p.x;
          const mdy = mouse.y - p.y;
          const mDist = Math.sqrt(mdx * mdx + mdy * mdy);

          if (mDist < 160) {
            const force = (1 - mDist / 160) * 1.2;
            p.x -= (mdx / mDist) * force * 2;
            p.y -= (mdy / mDist) * force * 2;
          }

          p.pulsePhase += p.pulseSpeed;
          const currentAlpha = p.baseAlpha + Math.sin(p.pulsePhase) * 0.15;

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${Math.max(0.05, currentAlpha)})`;
          ctx.shadowBlur = 8;
          ctx.shadowColor = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, 0.6)`;
          ctx.fill();
          ctx.shadowBlur = 0;
        }

        haloAngle21 += 0.003;
        const ringCenterX = width * 0.78 + Math.cos(haloAngle21 * 1.2) * 50;
        const ringCenterY = height * 0.28 + Math.sin(haloAngle21) * 35;

        ctx.save();
        ctx.translate(ringCenterX, ringCenterY);
        ctx.rotate(Math.sin(haloAngle21 * 0.8) * 0.4 + 0.35);
        ctx.beginPath();
        ctx.ellipse(0, 0, 54, 18, 0, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(6, 182, 212, 0.4)";
        ctx.lineWidth = 1.5;
        ctx.shadowBlur = 14;
        ctx.shadowColor = "rgba(6, 182, 212, 0.8)";
        ctx.stroke();
        ctx.restore();
      }

      // =========================================================================
      // MODE 3: 3D WARP SPEED HYPERDRIVE & COSMIC STREAKS (SLOW CINEMATIC)
      // =========================================================================
      else if (style === "warp_speed") {
        mouse.x += (mouse.targetX - mouse.x) * 0.03;
        mouse.y += (mouse.targetY - mouse.y) * 0.03;

        const centerX = width / 2 + (mouse.x - width / 2) * 0.15;
        const centerY = height / 2 + (mouse.y - height / 2) * 0.15;
        const warpSpeed = 1.8; // Calmed down to slow, cinematic floating drift

        for (let i = 0; i < warpStars.length; i++) {
          const s = warpStars[i];
          s.pz = s.z;
          s.z -= warpSpeed;

          if (s.z <= 0) {
            s.z = 1000;
            s.pz = 1000;
            s.x = (Math.random() - 0.5) * width * 2.0;
            s.y = (Math.random() - 0.5) * height * 2.0;
          }

          const k = 380 / s.z;
          const px = s.x * k + centerX;
          const py = s.y * k + centerY;

          const pk = 380 / s.pz;
          const ppx = s.x * pk + centerX;
          const ppy = s.y * pk + centerY;

          const alpha = Math.min(0.75, (1 - s.z / 1000) * 1.2);

          // Subtle graceful motion streak
          ctx.beginPath();
          ctx.strokeStyle = `${s.colorPrefix}${alpha * 0.6})`;
          ctx.lineWidth = Math.min(1.8, (1 - s.z / 1000) * s.size * 1.4);
          ctx.moveTo(ppx, ppy);
          ctx.lineTo(px, py);
          ctx.stroke();

          // Soft Glowing Star Point
          ctx.beginPath();
          ctx.arc(px, py, Math.min(2.2, (1 - s.z / 1000) * s.size * 1.3), 0, Math.PI * 2);
          ctx.fillStyle = `${s.colorPrefix}${alpha})`;
          ctx.shadowBlur = 6;
          ctx.shadowColor = s.colorPrefix.replace(", ", ", 0.5)");
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [style]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <div className="absolute inset-0 bg-[#06060B]" />
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[550px] bg-gradient-to-b from-cyan-500/10 via-violet-600/5 to-transparent rounded-full blur-[120px] pointer-events-none" />
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block pointer-events-none" />
    </div>
  );
}
