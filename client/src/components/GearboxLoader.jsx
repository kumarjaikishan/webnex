import React from "react";
import { Cog } from "lucide-react";

export default function GearboxLoader({ label = "Loading data..." }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 space-y-4 w-full">
      {/* Interlocking rotating gears */}
      <div className="relative w-20 h-20 flex items-center justify-center">
        {/* Large gear rotating clockwise */}
        <div className="absolute -left-1 -top-1 animate-spin [animation-duration:4s] text-[#7C6CFB] drop-shadow-[0_0_12px_rgba(124,108,251,0.45)]">
          <Cog size={46} strokeWidth={1.8} />
        </div>

        {/* Small gear interlocked and counter-rotating faster */}
        <div className="absolute right-0 bottom-0 animate-spin [animation-direction:reverse] [animation-duration:2.4s] text-[#00F0FF] drop-shadow-[0_0_10px_rgba(0,240,255,0.45)]">
          <Cog size={30} strokeWidth={2.2} />
        </div>

        {/* Micro accent pulse center */}
        <div className="w-2 h-2 rounded-full bg-white animate-ping opacity-75"></div>
      </div>

      {/* Futuristic status label */}
      <div className="flex flex-col items-center space-y-1">
        <p className="font-mono text-xs font-semibold text-paper tracking-wider uppercase">
          {label}
        </p>
        <p className="font-mono text-[10px] text-mist tracking-widest uppercase animate-pulse">
          SYNCING WEBNEX MODULE
        </p>
      </div>
    </div>
  );
}
