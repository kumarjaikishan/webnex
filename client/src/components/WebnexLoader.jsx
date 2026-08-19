import React, { useState, useEffect } from "react";

export default function WebnexLoader({ onFinish, duration = 2200 }) {
  const [progress, setProgress] = useState(0);
  const [isFading, setIsFading] = useState(false);
  const [statusText, setStatusText] = useState("INITIALIZING SYSTEM");

  useEffect(() => {
    const statuses = [
      { at: 15, text: "CONNECTING TO WEBNEX ENGINE" },
      { at: 45, text: "LOADING INTERACTIVE MODULES" },
      { at: 75, text: "SYNCING NEURAL ASSETS" },
      { at: 95, text: "PREPARING STUDIO EXPERIENCE" },
    ];

    const startTime = performance.now();

    const updateInterval = setInterval(() => {
      const elapsed = performance.now() - startTime;
      const calculatedProgress = Math.min(100, Math.floor((elapsed / duration) * 100));
      setProgress(calculatedProgress);

      const currentStatus = [...statuses].reverse().find(s => calculatedProgress >= s.at);
      if (currentStatus) {
        setStatusText(currentStatus.text);
      }

      if (elapsed >= duration) {
        clearInterval(updateInterval);
        setIsFading(true);
        setTimeout(() => {
          if (onFinish) onFinish();
        }, 600);
      }
    }, 25);

    return () => clearInterval(updateInterval);
  }, [duration, onFinish]);

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#06060B] transition-all duration-700 select-none ${
        isFading ? "opacity-0 pointer-events-none scale-105" : "opacity-100"
      }`}
    >
      {/* Dynamic Background Halo Glows */}
      <div className="absolute w-96 h-96 bg-[#7C6CFB]/15 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>
      <div className="absolute w-72 h-72 bg-[#00F0FF]/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="relative z-10 flex flex-col items-center max-w-sm w-full px-6">
        {/* Animated Brand Logo Symbol */}
        <div className="relative mb-8 flex items-center justify-center">
          {/* Outer rotating neon ring */}
          <div className="w-24 h-24 rounded-2xl border border-[#7C6CFB]/30 animate-spin [animation-duration:8s] bg-[#13131F]/40 backdrop-blur-md flex items-center justify-center shadow-[0_0_30px_rgba(124,108,251,0.2)]"></div>
          
          {/* Inner pulsating counter-rotating square */}
          <div className="absolute w-16 h-16 rounded-xl border border-[#00F0FF]/40 animate-spin [animation-direction:reverse] [animation-duration:5s]"></div>

          {/* Central Logo Hexagon / Emblem */}
          <div className="absolute w-12 h-12 rounded-xl bg-gradient-to-tr from-[#7C6CFB] to-[#00F0FF] flex items-center justify-center shadow-[0_0_20px_rgba(0,240,255,0.4)]">
            <svg
              className="w-6 h-6 text-black"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
        </div>

        {/* Brand Title */}
        <div className="flex items-center gap-1.5 mb-2">
          <span className="text-3xl font-extrabold tracking-widest text-white font-mono">
            WEBNEX
          </span>
          <span className="text-3xl font-extrabold text-[#00F0FF] font-mono animate-pulse">
            .
          </span>
        </div>

        {/* Dynamic Status Subtitle */}
        <div className="h-5 flex items-center justify-center mb-6">
          <p className="text-[11px] font-mono tracking-wider text-[#94A3B8] uppercase transition-all duration-300">
            {statusText}
          </p>
        </div>

        {/* Futuristic Progress Bar */}
        <div className="w-full bg-[#13131F] rounded-full h-1.5 p-0.5 overflow-hidden border border-[#232333]/80 relative shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-[#7C6CFB] via-[#00F0FF] to-[#7C6CFB] rounded-full transition-all duration-75 relative"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute right-0 top-0 bottom-0 w-2 bg-white rounded-full shadow-[0_0_8px_#ffffff]"></div>
          </div>
        </div>

        {/* Progress Counter & Tech Specs */}
        <div className="w-full flex justify-between items-center mt-2.5 text-[10px] font-mono text-[#64748B]">
          <span>VER 2.4.0</span>
          <span className="text-[#00F0FF] font-bold">{progress}%</span>
        </div>
      </div>
    </div>
  );
}
