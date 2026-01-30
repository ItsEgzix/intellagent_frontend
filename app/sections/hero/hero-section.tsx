"use client";

import Image from "next/image";
import { useI18n } from "../../contexts/i18n-context";
import React, { useMemo } from "react";
import LeftSidebar, { HorizontalSidebar } from "./components/left-sidebar";
import AboutUs from "../about-us/about-us";
import SocialLoop from "../footer/components/social-loop";
import { techLogos } from "@/data/technologies";

export default function HeroSection() {
  const { t } = useI18n();

  return (
    <>
      <LeftSidebar />
      <section className="relative w-full h-[90vh] min-h-[700px] flex flex-col justify-center items-center bg-white overflow-hidden border-b-2 border-black">
        
        {/* Abstract Background Elements */}
        <div className="absolute inset-0 z-0 pointer-events-none">
            {/* Grid Texture */}
             <div 
                className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)",
                    backgroundSize: "40px 40px"
                }}
             />
             
             {/* Large 'A' Logo Background */}
             <div className="absolute right-[-5%] bottom-[-10%] w-[50vw] h-[70vh] pointer-events-none">
                <Image
                  src="/logo/A logo yellow.svg"
                  alt="A Logo Background"
                  fill
                  className="object-contain"
                  priority
                />
             </div>
        </div>

        {/* Main Content Container - Blueprint/Manifesto Style */}
        <div className="relative z-10 container mx-auto px-6 max-w-7xl">
            
            {/* Top Meta Labels */}
            <div className="flex justify-between items-end border-b-2 border-black pb-4 mb-12">
                <div className="flex flex-col">
                    <span className="font-mono text-xs font-bold tracking-widest uppercase mb-1">AGENCY_OS</span>
                    <span className="font-mono text-xs tracking-widest text-gray-500">V.1.0 // SYSTEM_ACTIVE</span>
                </div>
                <div className="hidden md:flex gap-8">
                     <span className="font-mono text-xs tracking-widest text-gray-500">LATENCY: 0ms</span>
                     <span className="font-mono text-xs tracking-widest text-gray-500 text-green-600">● ONLINE</span>
                </div>
            </div>

            {/* Main Headline Block */}
            <div className="flex flex-col gap-2">
                <h1 
                    className="text-8xl md:text-[9rem] lg:text-[11rem] leading-[0.85] tracking-tighter text-black uppercase"
                    style={{ fontFamily: "var(--font-beatrice-display)" }}
                >
                    Build
                </h1>
                
                <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-12">
                    <h1 
                        className="text-8xl md:text-[9rem] lg:text-[11rem] leading-[0.85] tracking-tighter text-black uppercase"
                        style={{ fontFamily: "var(--font-beatrice-display)" }}
                    >
                         What&apos;s Next
                    </h1>

                </div>
                
                 <div className="flex items-center gap-4 mt-4">
                     <div className="h-2 w-24 bg-black"></div>
                     <h1 
                        className="text-4xl md:text-6xl tracking-tight text-gray-400 italic"
                        style={{ fontFamily: "var(--font-beatrice-display)" }}
                    >
                        into working reality.
                    </h1>
                 </div>
            </div>

            {/* Subtitle / Mission */}
            <div className="mt-16 max-w-2xl border-l-2 border-black pl-8 ml-2">
                <p className="font-mono text-lg md:text-xl text-gray-800 leading-relaxed">
                   {t.hero.subtitle}
                </p>
                <div className="mt-8 flex items-center gap-4">
                     <a
                        href="https://wa.me/601139282725"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center gap-4 hover:opacity-80 transition-opacity duration-300"
                      >
                        <Image
                          src="/elements/Lets_have_chat_1920.svg"
                          alt="Let's have a chat"
                          width={249}
                          height={77}
                          className="h-16 w-auto"
                        />
                      </a>
                </div>
            </div>

        </div>

        {/* Absolute Decorative Tech Elements */}
        <div className="absolute top-1/3 right-12 hidden lg:block">
            <div className="flex flex-col gap-2 opacity-20">
                <div className="w-16 h-[2px] bg-black"></div>
                 <div className="w-8 h-[2px] bg-black"></div>
                  <div className="w-24 h-[2px] bg-black"></div>
            </div>
        </div>

      </section>

      {/* Horizontal Sidebar - appears under black box at md-xl breakpoint */}
      <HorizontalSidebar />
       
      {/* Logo Loop - appears under horizontal sidebar */}
      
      <div className="w-full py-8 md:py-12 bg-white">
        <SocialLoop
          items={techLogos}
          speed={60}
          direction="left"
          logoHeight={48}
          gap={250}
          hoverSpeed={0}
          scaleOnHover={true}
          ariaLabel="Technology partners"
          fullWidth={false}
        />
      </div>
      <AboutUs/>
      

     
    </>
  );
}
