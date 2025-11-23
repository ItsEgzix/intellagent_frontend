"use client";

import React from "react";
// @ts-ignore - LogoLoop is a JSX component
import LogoLoop from "@/components/LogoLoop";
import { socialLoopItems, type LoopItem } from "@/data/social-media";

export { socialLoopItems, type LoopItem };

export interface SocialLoopProps {
  items?: LoopItem[];
  speed?: number;
  direction?: "left" | "right";
  logoHeight?: number;
  gap?: number;
  hoverSpeed?: number;
  scaleOnHover?: boolean;
  ariaLabel?: string;
  className?: string;
  fullWidth?: boolean;
}

export default function SocialLoop({
  items = socialLoopItems,
  speed = 50,
  direction = "left",
  logoHeight = 150,
  gap = 100,
  hoverSpeed = 0,
  scaleOnHover = false,
  ariaLabel,
  className = "",
  fullWidth = true,
}: SocialLoopProps) {
  const wrapperClassName = fullWidth
    ? "w-screen relative left-1/2 -translate-x-1/2"
    : "w-full";

  return (
    <div className={`${wrapperClassName} ${className}`}>
      {/* @ts-ignore - LogoLoop is a JSX component without TypeScript definitions */}
      {React.createElement(LogoLoop as any, {
        logos: items,
        speed,
        direction,
        logoHeight,
        gap,
        hoverSpeed,
        scaleOnHover,
        ariaLabel,
      })}
    </div>
  );
}
