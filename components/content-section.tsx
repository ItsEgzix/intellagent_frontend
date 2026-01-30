"use client";

import { useI18n } from "../app/contexts/i18n-context";
import Image from "next/image";
import React, { useState, useRef } from "react";

export interface ContentItem {
  title: string;
  description: string;
  icon?: string;
  image?: string;
  useCases?: string;
}

interface ContentSectionProps {
  id: string;
  heading: string | React.ReactNode;
  description: string;
  items: ContentItem[];
  logo: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
  children?: React.ReactNode;
  highlightImage?: {
    src: string;
    alt: string;
    width?: number;
    height?: number;
  };
  highlightText?: string;
  variant?: "default" | "centered-light";
}

export default function ContentSection({
  id,
  heading,
  description,
  items = [],
  logo,
  children,
  highlightImage,
  highlightText,
  variant = "default",
}: ContentSectionProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  if (variant === "centered-light") {
    return (
      <section id={id} className="w-full flex flex-col items-center bg-black py-16 md:py-24 overflow-hidden">
        {/* Centered Header */}
        <div className="container mx-auto px-4 md:px-6 mb-12 md:mb-20 text-center">
          <h2
            className="text-white mb-6 tracking-tight"
            style={{
              fontFamily: "var(--font-beatrice-display)",
              fontSize: "clamp(2.5rem, 5vw, 4rem)",
              fontWeight: 500,
              lineHeight: "1.1",
            }}
          >
            {heading}
          </h2>
        </div>

        {/* Carousel Layout - Full Width */}
        <div 
          ref={carouselRef}
          className="w-full flex overflow-x-auto snap-x snap-mandatory gap-4 md:gap-8 px-4 md:px-[10vw] pb-12 scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']"
          onScroll={(e) => {
            const container = e.currentTarget;
            // Calculate center-based index
            const center = container.scrollLeft + (container.clientWidth / 2);
            /* 
              Approximate card width + gap. 
              We need to be precise or use IntersectionObserver for perfect index. 
              Simple scroll math: standard card width logic.
              Mobile: 90vw + 16px gap. Desktop: 80vw + 32px gap.
            */
            const children = container.children;
            let closestIndex = 0;
            let minDistance = Number.MAX_VALUE;

            for (let i = 0; i < children.length; i++) {
               const child = children[i] as HTMLElement;
               const childCenter = child.offsetLeft + (child.offsetWidth / 2);
               const distance = Math.abs(childCenter - center);
               if (distance < minDistance) {
                 minDistance = distance;
                 closestIndex = i;
               }
            }
            setActiveIndex(closestIndex);
          }}
        >
          {items.map((item, index) => (
            <div 
              key={index}
              className="flex-none w-[90vw] md:w-[80vw] lg:w-[70vw] snap-center group" // Adjusted width for "peek"
            >
              {/* Main Card Container */}
              <div className="flex flex-col md:flex-row w-full min-h-[500px] border border-white/10 rounded-none overflow-hidden relative bg-[#111] shadow-none h-full">
                  
                  {/* Left Column: Text (Slanted) */}
                  <div 
                      className="relative w-full md:w-[90%] lg:w-[60%] z-20 flex flex-col justify-between p-8 md:p-10 lg:p-12 bg-[#111] h-full" 
                      style={{ clipPath: "polygon(0 0, 100% 0, 88% 100%, 0 100%)" }}
                  >
                      <div className="mb-6">
                          {/* Logo/Icon Placeholder */}
                          <div className="mb-8 w-10 h-10 opacity-80">
                              {item.icon && <Image src={item.icon} alt="" width={40} height={40} className="object-contain" />}
                          </div>

                          <p
                          className="text-gray-300 text-lg md:text-xl lg:text-2xl leading-snug font-normal mb-6 max-w-xl"
                          style={{
                              fontFamily: "var(--font-dm-sans)",
                          }}
                          >
                          “{item.description}”
                          </p>

                          {item.useCases && (
                            <div className="mb-6">
                                <p className="text-gray-500 text-[10px] font-bold uppercase tracking-wider mb-2">
                                  Use cases
                                </p>
                                <p className="text-gray-400 text-xs md:text-sm font-medium">
                                  {item.useCases}
                                </p>
                            </div>
                          )}
                      </div>

                      <div className="mt-4">
                            <span 
                              className="inline-flex items-center gap-2 text-white text-xs font-bold hover:gap-4 transition-all cursor-pointer group/link"
                              style={{ fontFamily: "var(--font-dm-sans)" }}
                          >
                              Read more 
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="transition-transform group-hover/link:translate-x-1">
                                  <path d="M5 12H19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                  <path d="M12 5L19 12L12 19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                          </span>
                      </div>
                  </div>

                  {/* Right Column: Image (Underlay) */}
                  <div className="absolute inset-0 z-10 bg-[#1a1a1a] flex justify-end">
                        <div className="relative w-full md:w-[50%] h-full transition-transform duration-700"> {/* Added scale effect */}
                            {item.image && (
                              <Image 
                              src={item.image} 
                              alt={item.title} 
                              fill
                              className="object-cover object-right translate-x-10"
                              />
                          )}
                          
                          {/* Gradient for Text Readability */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                          {/* Title Overlay */}
                          <h3
                            className="absolute bottom-10 left-10 md:bottom-12 md:left-24 text-white z-20 max-w-[80%]"
                            style={{
                              fontFamily: "var(--font-beatrice-display)",
                              fontSize: "clamp(1.5rem, 2.5vw, 2.5rem)",
                              fontWeight: 500,
                              lineHeight: "1.1",
                            }}
                          >
                            {item.title}
                          </h3>
                        </div>
                  </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Progress Bar Navigation */}
        <div className="container mx-auto px-4 md:px-6 max-w-[1600px] mt-8 flex justify-center"> {/* Centered underneath */}
            <div className="w-full max-w-[200px] md:max-w-md flex relative h-[2px] bg-white/10 overflow-hidden"> {/* Sharp corners for bar too? Or keep rounded? Usually bars are rounded, but user said "sharp corners". I'll default to removing 'rounded-full' here too for consistency, or keeping it minimal. 'rounded-full' removed. */}
               {/* Animated Indicator */}
               <div 
                  className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300 ease-out pointer-events-none z-10"
                  style={{ 
                      width: `${100 / items.length}%`,
                      transform: `translateX(${activeIndex * 100}%)`
                  }}
               />
               
               {/* Clickable Segments Overlay */}
               <div className="absolute inset-0 flex w-full h-full z-20">
                  {items.map((_, index) => (
                    <div 
                      key={index}
                      className="flex-1 h-[20px] -mt-[10px] cursor-pointer" // Larger hit area
                      onClick={() => {
                        if (carouselRef.current) {
                          const container = carouselRef.current;
                          const child = container.children[index] as HTMLElement;
                          if (child) {
                             // Scroll to center the child
                             const scrollLeft = child.offsetLeft - (container.clientWidth - child.offsetWidth) / 2;
                             container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
                          }
                        }
                      }}
                      role="button"
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
               </div>
            </div>
        </div>

        {children}
      </section>
    );
  }

  return (
    <section id={id} className="w-full flex justify-center bg-black relative overflow-hidden">
      
      <div className="w-full max-w-full relative z-10 px-4 md:px-6 lg:px-8 py-8 md:py-12 lg:py-16">
        <div className="flex flex-row items-start justify-between gap-8 md:gap-12 lg:gap-16 xl:ml-[100px] xl:mr-[100px] pr-4 md:pr-6 lg:pr-8 border-b border-white/10 pb-12 mb-12">
          {/* Text Content */}
          <div className="flex flex-col items-start flex-1">
            {/* Heading */}
            <h2
              className="text-white mb-4 md:mb-6"
              style={{
                fontFamily: "var(--font-dm-sans)",
                fontSize: "64px",
                fontWeight: 400,
                lineHeight: "1.2",
              }}
            >
              {typeof heading === "string" ? (
                <>
                  {heading}
                  {highlightText && highlightImage && (
                    <span className="relative inline-block ml-4">
                      <span className="relative z-10 text-[#02B6D7]">{highlightText}</span>
                    </span>
                  )}
                </>
              ) : (
                heading
              )}
            </h2>

            {/* Sub text */}
            <p
              className="text-gray-300 max-w-2xl"
              style={{
                fontFamily: "var(--font-dm-sans)",
                fontSize: "24px",
                fontWeight: 300,
                lineHeight: "1.5",
              }}
            >
              {description}
            </p>

            {children}
          </div>

          {/* Grid Logo */}
          <div className="hidden xl:block shrink-0 ml-auto opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            <Image
              src={logo.src}
              alt={logo.alt}
              width={logo.width}
              height={logo.height}
              className="h-auto w-auto"
            />
          </div>
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 xl:ml-[100px] xl:mr-[100px] border-t border-l border-white/10">
          {items.map((item, index) => (
            <div
              key={index}
              className="flex flex-col relative p-6 md:p-8 cursor-pointer group bg-transparent min-h-[280px] border-r border-b border-white/10 hover:border-[#02B6D7]/30 transition-colors duration-300"
            >
              <div className="absolute inset-0 bg-[#02B6D7] transform scale-y-0 origin-bottom group-hover:scale-y-100 transition-transform duration-500 ease-out z-0 opacity-10"></div>
              
              <div className="relative z-10 flex flex-col h-full">
                <h3
                  className="text-white mb-4"
                  style={{
                    fontFamily: "var(--font-dm-sans)",
                    fontSize: "24px",
                    fontWeight: 600,
                  }}
                >
                  {item.title}
                </h3>
                
                <div className="w-full h-px bg-white/20 mb-6 group-hover:bg-[#02B6D7] transition-colors"></div>

                <div className="flex flex-col gap-6">
                  <div className="pt-4">
                     <p className="text-gray-300 text-sm leading-relaxed" style={{ fontFamily: "var(--font-dm-sans)" }}>
                        {item.description}
                     </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
