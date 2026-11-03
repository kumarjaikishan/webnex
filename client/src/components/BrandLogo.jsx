import React from "react";

/**
 * Circled Webnex Logo Mark (Geometric Petals)
 */
export function WebnexLogoIcon({
  className = "w-7 h-8.5",
  strokeColor = "#ffffff",
  fillColor = "#f5b842",
}) {
  return (
    <div className={`relative shrink-0 flex items-center justify-center ${className}`}>
      <svg
        viewBox="0 0 40 50"
        className="w-full h-full drop-shadow-[0_2px_8px_rgba(245,184,66,0.25)]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M5 25 C5 10, 20 5, 22 5 C22 20, 10 35, 5 25 Z"
          fill={fillColor}
        />
        <path
          d="M22 5 C25 5, 38 15, 35 30 C30 45, 12 45, 22 5 Z"
          fill="none"
          stroke={strokeColor}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

/**
 * Full Brand Logo (Icon + WEBNEX LABS typography + optional Tagline)
 */
export default function BrandLogo({
  className = "",
  iconSize = "w-7 h-8.5",
  textSize = "text-xl",
  taglineSize = "text-[9px]",
  showTagline = false,
  strokeColor = "#ffffff",
  goldColor = "#f5b842",
  textColor = "text-paper",
  align = "items-center",
}) {
  return (
    <div className={`flex ${align} gap-2.5 ${className}`}>
      <WebnexLogoIcon
        className={iconSize}
        strokeColor={strokeColor}
        fillColor={goldColor}
      />
      <div className="flex flex-col justify-center leading-none">
        <div className={`flex items-baseline gap-1.5 font-display font-black tracking-tight uppercase ${textSize}`}>
          <span className={textColor}>WEBNEX</span>
          <span style={{ color: goldColor }}>LABS</span>
        </div>
        {showTagline && (
          <p
            className={`${taglineSize} font-mono tracking-widest text-mist uppercase mt-1 select-none font-semibold`}
          >
            WEB • DESIGN • DEVELOPMENT
          </p>
        )}
      </div>
    </div>
  );
}

