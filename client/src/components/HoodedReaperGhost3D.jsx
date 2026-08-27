import React, { useState, useEffect, useRef } from "react";
import { Sparkles, Flame, ShieldCheck, Zap } from "lucide-react";

export default function HoodedReaperGhost3D({ className = "" }) {
  const containerRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0, normX: 0, normY: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [clickBurst, setClickBurst] = useState(false);
  const [clickCount, setClickCount] = useState(0);

  // Mouse move handler for smooth 3D parallax tilt & eye tracking
  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const normX = Math.max(-1, Math.min(1, x / (rect.width / 2)));
    const normY = Math.max(-1, Math.min(1, y / (rect.height / 2)));
    setMousePos({ x, y, normX, normY });
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    setMousePos({ x: 0, y: 0, normX: 0, normY: 0 });
  };

  const handleClick = () => {
    setClickBurst(true);
    setClickCount((c) => c + 1);
    setTimeout(() => setClickBurst(false), 700);
  };

  // Interpolate 3D rotation angles
  const rotY = mousePos.normX * 18; // Degrees
  const rotX = -mousePos.normY * 14; // Degrees

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      className={`relative flex items-center justify-center select-none cursor-pointer group ${className}`}
      style={{ perspective: "1200px" }}
    >
      {/* 1. Volumetric Ethereal Cyan & Indigo Aura Backlight */}
      <div
        className={`absolute w-72 sm:w-96 h-72 sm:h-96 rounded-full blur-[80px] pointer-events-none transition-all duration-700 ${
          clickBurst
            ? "bg-cyan-400/40 scale-125"
            : "bg-gradient-to-tr from-cyan-500/20 via-sky-500/15 to-indigo-600/20 animate-pulse scale-100"
        }`}
      />
      <div className="absolute w-56 h-56 bg-cyan-400/15 rounded-full blur-[60px] pointer-events-none" />

      {/* 2. Floating 3D Telemetry Badges (21st.dev UI standard) */}
      {/* Top Right: Status Badge */}
      <div className="absolute -top-3 right-0 sm:right-2 z-30 pointer-events-none transition-transform duration-300 group-hover:scale-105">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-cyan-500/40 bg-panel/90 backdrop-blur-md shadow-[0_8px_24px_rgba(6,182,212,0.25)]">
          <Flame className={`w-3.5 h-3.5 text-cyan ${clickBurst ? "animate-bounce text-cyan-300" : "animate-pulse"}`} />
          <span className="font-mono text-[10px] sm:text-xs text-paper font-semibold tracking-wide flex items-center gap-1">
            Spectral Soul Engine
          </span>
        </div>
      </div>

      {/* Bottom Left: Speed Badge */}
      <div className="absolute bottom-4 -left-2 sm:left-0 z-30 pointer-events-none transition-transform duration-300 group-hover:scale-105">
        <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl border border-sky-500/30 bg-panel/90 backdrop-blur-md shadow-[0_8px_24px_rgba(56,189,248,0.2)]">
          <ShieldCheck className="w-4 h-4 text-cyan" />
          <div className="flex flex-col">
            <span className="font-mono text-[9px] text-mist">Interactive 3D</span>
            <span className="font-mono text-[10px] font-bold text-cyan">Hardware Accelerated</span>
          </div>
        </div>
      </div>

      {/* Bottom Right: Click Hint */}
      <div className="absolute -bottom-2 right-4 z-30 pointer-events-auto">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-cyan-500/30 bg-panel/90 backdrop-blur-sm shadow-md text-[10px] font-mono text-mist hover:text-cyan hover:border-cyan transition-all">
          <Sparkles className="w-3 h-3 text-cyan animate-spin [animation-duration:6s]" />
          <span>Ignite Soul</span>
          {clickCount > 0 && <span className="text-cyan font-bold">({clickCount})</span>}
        </div>
      </div>

      {/* 3. Main 3D Interactive Floating Character Container */}
      <div
        className="relative z-20 w-full max-w-[340px] sm:max-w-[400px] transition-transform duration-150 ease-out"
        style={{
          transform: `rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(${isHovered ? "30px" : "0px"})`,
          transformStyle: "preserve-3d",
        }}
      >
        {/* Floating Bobbing Kinematics Wrapper */}
        <div className="animate-[bounce_4s_easeInOut_infinite] relative flex items-center justify-center">
          {/* High-Resolution 3D Hooded Reaper Ghost Asset */}
          <img
            src="/hooded_reaper_ghost.jpg"
            alt="3D Hooded Reaper Ghost Mascot"
            className="w-full h-auto object-contain mix-blend-screen drop-shadow-[0_20px_40px_rgba(6,182,212,0.35)] filter contrast-[1.08] brightness-[1.02]"
            style={{
              transform: `translateZ(20px)`,
            }}
          />

          {/* Dynamic Glowing Eyes Overlay (Tracks Mouse & Pulses) */}
          <div
            className="absolute pointer-events-none transition-transform duration-75 ease-out"
            style={{
              top: "32%",
              left: "48%",
              transform: `translate(-50%, -50%) translate3d(${mousePos.normX * 8}px, ${mousePos.normY * 6}px, 40px)`,
            }}
          >
            {/* Left Eye Beam */}
            <div
              className={`absolute -left-7 -top-2 w-5 h-5 rounded-full bg-cyan-400 blur-[3px] opacity-80 ${
                clickBurst ? "scale-150 bg-white" : "animate-pulse"
              }`}
            />
            {/* Right Eye Beam */}
            <div
              className={`absolute left-3 -top-2 w-5 h-5 rounded-full bg-cyan-400 blur-[3px] opacity-80 ${
                clickBurst ? "scale-150 bg-white" : "animate-pulse"
              }`}
            />
            {/* Forehead Crescent Moon Glow */}
            <div
              className={`absolute -left-2 -top-11 w-4 h-4 rounded-full bg-cyan-300 blur-[4px] opacity-75 ${
                clickBurst ? "scale-150" : ""
              }`}
            />
          </div>

          {/* Dynamic Lantern Flame Burst Light (Positioned right over the lantern) */}
          <div
            className="absolute pointer-events-none"
            style={{
              top: "62%",
              right: "17%",
              transform: `translate3d(${mousePos.normX * -6}px, ${mousePos.normY * 4}px, 35px)`,
            }}
          >
            <div
              className={`w-14 h-14 rounded-full bg-cyan-400 blur-[18px] transition-all duration-300 ${
                clickBurst ? "opacity-100 scale-150 bg-cyan-300" : "opacity-60 animate-pulse scale-100"
              }`}
            />
          </div>

          {/* Crescent Staff Sapphire Crystal Glow (Positioned over staff head) */}
          <div
            className="absolute pointer-events-none"
            style={{
              top: "22%",
              left: "21%",
              transform: `translate3d(${mousePos.normX * 6}px, ${mousePos.normY * -4}px, 30px)`,
            }}
          >
            <div
              className={`w-10 h-10 rounded-full bg-cyan-400 blur-[12px] transition-all duration-300 ${
                clickBurst ? "opacity-100 scale-150" : "opacity-50 animate-pulse"
              }`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
