"use client";

import React from "react";
import Image from "next/image";
import { useI18n } from "../../contexts/i18n-context";

export default function AboutUs() {
  const { t } = useI18n();
  
  return (
    <section 
      id="about" 
      className="relative w-full bg-black flex flex-col items-center justify-center h-[528px] overflow-hidden font-sans"
    >
      {/* Custom Grid Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/elements/grid_png.png"
          alt="Grid Background"
          fill
          className="object-cover"
          quality={100}
        />
      </div>

     {/* Checkerboard pattern on the left - Restored */}
      <div className="absolute left-0 top-0 hidden md:flex z-10">
        {/* Left column */}
        <div className="flex flex-col">
          <div className="bg-white w-[88px] h-[88px]"></div>
          <div className="bg-black w-[88px] h-[88px]"></div>
          <div className="bg-white w-[88px] h-[88px]"></div>
          <div className="bg-black w-[88px] h-[88px] "></div>
          <div className="bg-white w-[88px] h-[88px]"></div>
          <div className="bg-black w-[88px] h-[88px] "></div>
          <div className="bg-white w-[88px] h-[88px]"></div>
          <div className="bg-black w-[88px] h-[88px] "></div>
        </div>
        {/* Right column */}
        <div className="flex flex-col">
          <div className="bg-black w-[88px] h-[88px] "></div>
          <div className="bg-white w-[88px] h-[88px]"></div>
          <div className="bg-black w-[88px] h-[88px] "></div>
          <div className="bg-white w-[88px] h-[88px]"></div>
          <div className="bg-black w-[88px] h-[88px] "></div>
          <div className="bg-white w-[88px] h-[88px]"></div>
        </div>
      </div>

      <div className="container mx-auto px-6 z-20 flex justify-center items-center h-full">
        
        {/* Blueprint Card Container */}
        <div className="relative w-full max-w-4xl border border-white/20 bg-black/40 backdrop-blur-sm p-8 md:p-12">
            
            {/* Technical Corner Markers */}
            <div className="absolute -top-[1px] -left-[1px] w-4 h-4 border-t border-l border-white"></div>
            <div className="absolute -top-[1px] -right-[1px] w-4 h-4 border-t border-r border-white"></div>
            <div className="absolute -bottom-[1px] -left-[1px] w-4 h-4 border-b border-l border-white"></div>
            <div className="absolute -bottom-[1px] -right-[1px] w-4 h-4 border-b border-r border-white"></div>

            {/* Header / Meta */}
            <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
                <span className="text-white/50 text-xs font-mono uppercase tracking-[0.2em]">
                    // SYSTEM_MANIFESTO
                </span>
                <span className="text-white/30 text-xs font-mono uppercase tracking-[0.2em]">
                    V.1.0
                </span>
            </div>

            {/* Main Statement */}
            <div className="flex flex-col md:flex-row items-baseline gap-4 mb-8">
                <h2 
                    className="text-white text-4xl md:text-5xl lg:text-6xl tracking-tight"
                    style={{ fontFamily: "var(--font-beatrice-display)" }}
                >
                    Ideas
                </h2>
                
                {/* Arrow */}
                <div className="flex items-center gap-2 px-2 opacity-50">
                    <div className="h-[1px] w-8 md:w-16 bg-white"></div>
                    <span 
                        className="text-white text-xl" 
                        style={{ fontFamily: "var(--font-pixelify-sans)" }}
                    >
                        &gt;
                    </span>
                </div>

                <h2 
                    className="text-white text-4xl md:text-5xl lg:text-6xl tracking-tight"
                    style={{ fontFamily: "var(--font-beatrice-display)" }}
                >
                    Reality<span className="text-green-500">.</span>
                </h2>
            </div>

            {/* Description */}
            <div className="flex flex-col md:flex-row gap-8">
                 <div className="w-12 border-t border-white/30 mt-3 md:hidden"></div>
                 <p 
                    className="text-gray-300 font-light text-lg md:text-xl leading-relaxed max-w-2xl"
                    style={{ fontFamily: "var(--font-dm-sans)" }}
                 >
                    {t.aboutUs.description}
                 </p>
                 
                 {/* Decorative Technical Status */}
                 <div className="hidden md:flex flex-col justify-end ml-auto gap-2">
                      <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                          <span className="text-xs text-white/40 font-mono">SYSTEM_ONLINE</span>
                      </div>
                      <div className="text-xs text-white/20 font-mono">
                          LATENCY: 0ms
                      </div>
                 </div>
            </div>

        </div>

      </div>
    </section>
  );
}
