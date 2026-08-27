import React, { useEffect, useRef } from "react";

export default function CuteGhostCanvas({ className = "" }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let animationFrameId;
    let time = 0;

    // Mouse interactive tracking
    let targetRotY = 0;
    let targetRotX = 0;
    let currentRotY = 0;
    let currentRotX = 0;

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - (rect.left + rect.width / 2);
      const y = e.clientY - (rect.top + rect.height / 2);
      targetRotY = (x / rect.width) * 0.7;
      targetRotX = -(y / rect.height) * 0.4;
    };

    const handleTouchMove = (e) => {
      if (e.touches.length > 0) {
        const rect = canvas.getBoundingClientRect();
        const x = e.touches[0].clientX - (rect.left + rect.width / 2);
        const y = e.touches[0].clientY - (rect.top + rect.height / 2);
        targetRotY = (x / rect.width) * 0.7;
        targetRotX = -(y / rect.height) * 0.4;
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove, { passive: true });

    const render = () => {
      time += 0.035;
      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse follow interpolation
      currentRotY += (targetRotY - currentRotY) * 0.06;
      currentRotX += (targetRotX - currentRotX) * 0.06;

      const idleRotY = Math.sin(time * 0.7) * 0.35 + currentRotY;
      const idleFloatY = Math.sin(time * 1.5) * 14;
      const idleBobX = Math.cos(time * 0.9) * 6;

      const centerX = width / 2 + idleBobX;
      const centerY = height / 2 + idleFloatY - 10;

      // --- 1. Ambient Glow Halo Underneath Ghost ---
      const haloGradient = ctx.createRadialGradient(
        centerX,
        centerY + 70,
        10,
        centerX,
        centerY + 70,
        110
      );
      haloGradient.addColorStop(0, "rgba(0, 240, 255, 0.28)");
      haloGradient.addColorStop(0.5, "rgba(124, 108, 251, 0.18)");
      haloGradient.addColorStop(1, "rgba(6, 6, 11, 0)");

      ctx.save();
      ctx.fillStyle = haloGradient;
      ctx.beginPath();
      ctx.ellipse(centerX, centerY + 70, 95, 28, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // --- 2. 3D Floating Shadow on Ground ---
      ctx.save();
      const shadowScale = 1 - Math.sin(time * 1.5) * 0.15;
      const shadowGrad = ctx.createRadialGradient(
        centerX,
        height - 35,
        5,
        centerX,
        height - 35,
        65 * shadowScale
      );
      shadowGrad.addColorStop(0, "rgba(0, 0, 0, 0.65)");
      shadowGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = shadowGrad;
      ctx.beginPath();
      ctx.ellipse(centerX, height - 35, 60 * shadowScale, 14 * shadowScale, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // --- 3. Cute 3D Ghost Body Render with Perspective Shading ---
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(idleRotY * 0.15 + currentRotX * 0.1);

      // Body Gradient (Translucent Ceramic Glass Effect)
      const bodyGrad = ctx.createLinearGradient(-60, -90, 60, 90);
      bodyGrad.addColorStop(0, "#FFFFFF");
      bodyGrad.addColorStop(0.3, "#F0F4FF");
      bodyGrad.addColorStop(0.7, "#DCE4FF");
      bodyGrad.addColorStop(1, "#A8BFFF");

      ctx.fillStyle = bodyGrad;
      ctx.shadowColor = "rgba(0, 240, 255, 0.45)";
      ctx.shadowBlur = 24;

      // Draw Main Smooth Ghost Dome Body & Waving Skirt
      ctx.beginPath();
      ctx.moveTo(-55, 10);
      ctx.bezierCurveTo(-55, -80, 55, -80, 55, 10);
      ctx.bezierCurveTo(55, 45, 52, 60, 50, 75);

      const w1 = Math.sin(time * 2.8) * 6;
      const w2 = Math.sin(time * 2.8 + 1.5) * 6;
      const w3 = Math.sin(time * 2.8 + 3.0) * 6;

      ctx.quadraticCurveTo(38, 62 + w1, 25, 75);
      ctx.quadraticCurveTo(12, 62 + w2, 0, 75);
      ctx.quadraticCurveTo(-12, 62 + w3, -25, 75);
      ctx.quadraticCurveTo(-38, 62 + w1, -50, 75);
      ctx.bezierCurveTo(-52, 60, -55, 45, -55, 10);
      ctx.closePath();
      ctx.fill();

      // Inner Soft Cyber Rim-Light Shading
      const rimGrad = ctx.createLinearGradient(40, -60, -40, 60);
      rimGrad.addColorStop(0, "rgba(255, 255, 255, 0.85)");
      rimGrad.addColorStop(0.5, "rgba(255, 255, 255, 0.1)");
      rimGrad.addColorStop(1, "rgba(124, 108, 251, 0.4)");
      ctx.fillStyle = rimGrad;
      ctx.fill();

      // --- 4. Floating Cute Ghost Hands ---
      const leftHandY = Math.sin(time * 2 + 0.5) * 4;
      const rightHandY = Math.cos(time * 2) * 4;

      ctx.beginPath();
      ctx.fillStyle = "#FFFFFF";
      ctx.ellipse(-52 + idleRotY * 10, 18 + leftHandY, 12, 9, -0.4, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.fillStyle = "#E8EFFF";
      ctx.ellipse(52 + idleRotY * 10, 18 + rightHandY, 12, 9, 0.4, 0, Math.PI * 2);
      ctx.fill();

      // --- 5. Kawaii 3D Eyes & Rosy Cheeks ---
      const blinkCycle = (time * 0.9) % 3.5;
      let blinkFactor = 1;
      if (blinkCycle < 0.16) {
        blinkFactor = Math.abs(Math.sin((blinkCycle / 0.16) * Math.PI - Math.PI / 2));
      }

      const clampedRot = Math.max(-0.65, Math.min(0.65, idleRotY));
      const eyeShiftX = Math.sin(clampedRot) * 16;
      const eyeShiftY = Math.sin(time * 1.5) * 1.5 + currentRotX * 3;

      const leftEyeScaleX = Math.max(0.4, 1 - clampedRot * 0.45);
      const rightEyeScaleX = Math.max(0.4, 1 + clampedRot * 0.45);

      const leftEyeBaseX = -17 + eyeShiftX - clampedRot * 3;
      const rightEyeBaseX = 17 + eyeShiftX + clampedRot * 3;

      // Rosy Glow Cheeks
      ctx.fillStyle = "rgba(255, 100, 160, 0.5)";
      ctx.beginPath();
      ctx.ellipse(-23 + eyeShiftX, 4 + eyeShiftY, 7 * leftEyeScaleX, 4.5, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.ellipse(23 + eyeShiftX, 4 + eyeShiftY, 7 * rightEyeScaleX, 4.5, 0, 0, Math.PI * 2);
      ctx.fill();

      if (blinkFactor < 0.15) {
        ctx.strokeStyle = "#0A0D1A";
        ctx.lineWidth = 2.4;
        ctx.lineCap = "round";

        ctx.beginPath();
        ctx.arc(leftEyeBaseX, -7 + eyeShiftY, 5 * leftEyeScaleX, 0.1 * Math.PI, 0.9 * Math.PI, false);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(rightEyeBaseX, -7 + eyeShiftY, 5 * rightEyeScaleX, 0.1 * Math.PI, 0.9 * Math.PI, false);
        ctx.stroke();
      } else {
        const eyeHeight = Math.max(1, 9 * blinkFactor);

        ctx.fillStyle = "#0A0D1A";
        ctx.beginPath();
        ctx.ellipse(leftEyeBaseX, -8 + eyeShiftY, 5.5 * leftEyeScaleX, eyeHeight, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.ellipse(rightEyeBaseX, -8 + eyeShiftY, 5.5 * rightEyeScaleX, eyeHeight, 0, 0, Math.PI * 2);
        ctx.fill();

        if (blinkFactor > 0.45) {
          ctx.fillStyle = "#FFFFFF";
          ctx.beginPath();
          ctx.arc(leftEyeBaseX - 1.5 * leftEyeScaleX, -11 + eyeShiftY, 2.4 * Math.min(1, leftEyeScaleX), 0, Math.PI * 2);
          ctx.arc(rightEyeBaseX - 1.5 * rightEyeScaleX, -11 + eyeShiftY, 2.4 * Math.min(1, rightEyeScaleX), 0, Math.PI * 2);
          ctx.fill();

          ctx.beginPath();
          ctx.arc(leftEyeBaseX + 2 * leftEyeScaleX, -5 + eyeShiftY, 1.2 * Math.min(1, leftEyeScaleX), 0, Math.PI * 2);
          ctx.arc(rightEyeBaseX + 2 * rightEyeScaleX, -5 + eyeShiftY, 1.2 * Math.min(1, rightEyeScaleX), 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Cute Smile
      ctx.strokeStyle = "#1A1E33";
      ctx.lineWidth = 2.2;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.arc(0 + eyeShiftX, 2 + eyeShiftY, 4.5, 0.15 * Math.PI, 0.85 * Math.PI, false);
      ctx.stroke();

      // Floating Neon Cyber Particles Orbiting Ghost
      for (let p = 0; p < 4; p++) {
        const pAngle = time * 1.6 + (p * Math.PI) / 2;
        const pRadiusX = 75;
        const pRadiusY = 28;
        const px = Math.cos(pAngle) * pRadiusX;
        const py = Math.sin(pAngle) * pRadiusY + 10;
        const pSize = (Math.sin(pAngle) + 1.8) * 1.6;

        ctx.fillStyle = p % 2 === 0 ? "#00F0FF" : "#7C6CFB";
        ctx.shadowColor = ctx.fillStyle;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(px, py, pSize, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);

  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      {/* Ambient Neon Backlight Halo */}
      <div className="absolute w-64 h-64 bg-[#7C6CFB]/20 rounded-full blur-[70px] pointer-events-none animate-pulse"></div>
      <div className="absolute w-52 h-52 bg-[#00F0FF]/15 rounded-full blur-[60px] pointer-events-none"></div>

      <canvas
        ref={canvasRef}
        width={340}
        height={320}
        className="relative z-10 w-full max-w-[340px] h-auto drop-shadow-[0_15px_30px_rgba(0,0,0,0.6)] cursor-grab active:cursor-grabbing"
      />
    </div>
  );
}
