"use client";

import PageHeader from "../components/ui/page-header";
import Image from "next/image";
import { useI18n } from "../contexts/i18n-context";
import { motion } from "framer-motion";
import { useState } from "react";

const projectImages = [
  "/mock_image/project-1.jpg",
  "/mock_image/project-2.jpg",
  "/mock_image/project-3.jpg",
];

export default function WhatWeBuildPage() {
  const { t } = useI18n();

  return (
    <main className="bg-white min-h-screen text-black font-sans selection:bg-black selection:text-white">
      
      <div className="pt-40 pb-20 px-6 md:px-12 lg:px-20 container mx-auto">
        {/* Page Header */}
        <PageHeader 
          title="What we build" 
          description={t.whatWeBuild.subheading} 
        />

        <div className="flex flex-col gap-40">
          {t.whatWeBuild.projects.map((project: any, index: number) => (
            <ProjectItem key={index} project={project} index={index} />
          ))}
        </div>
      </div>
    </main>
  );
}

function ProjectItem({ project, index }: { project: any, index: number }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col lg:grid lg:grid-cols-12 gap-12 lg:gap-24 items-center group"
    >
        {/* Visual Content */}
        <div className={`lg:col-span-7 relative aspect-[4/3] w-full ${index % 2 === 1 ? 'lg:order-2' : 'lg:order-1'}`}>
          <div className="absolute inset-0 bg-gray-100 rounded-sm overflow-hidden group/image cursor-crosshair">
            <Image 
              src={projectImages[index % projectImages.length]}
              alt={project.title}
              fill
              className="object-cover transition-all duration-1000 filter contrast-125" 
            />
            
            {/* Permanent Overlay for Readability */}
            <div className="absolute inset-0 bg-black/20 group-hover/image:bg-black/30 transition-colors duration-500" />

            {/* Centered Title */}
            <div className="absolute inset-0 p-8 flex items-center justify-center pointer-events-none z-10">
               <h3 className="text-white text-2xl md:text-4xl font-bold tracking-tighter text-center uppercase drop-shadow-2xl" 
                   style={{ fontFamily: 'var(--font-dm-sans)' }}>
                 {project.title}
               </h3>
            </div>

            {/* Technical Metadata Stamp - Floating Full Width */}
            <div className="absolute bottom-4 left-4 right-4">
              <div className="bg-black text-white p-2 rounded-md border border-white/20 shadow-2xl backdrop-blur-md w-full">
                
                {/* Inner Border Container */}
                <div className="border border-white/20 rounded-sm p-4 flex flex-col md:flex-row gap-6 relative overflow-hidden">
                  
                  {/* Left Section: Main Info */}
                  <div className="flex-1 flex flex-col justify-between gap-6">
                    <div>
                      <h4 className="text-[10px] font-mono text-gray-400 uppercase tracking-[0.2em] mb-1">
                        PROJECT / INTELLAGENT LABS
                      </h4>
                      <h3 className="text-xl md:text-3xl font-bold tracking-tight text-white uppercase leading-none" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                        {project.category || "INTELLAGENT // SYSTEM"}
                      </h3>
                    </div>

                    <div className="grid grid-cols-3 gap-4 border-t border-white/10 pt-4 mt-auto">
                      <div>
                        <span className="block text-[8px] text-gray-500 font-mono uppercase tracking-wider mb-1">CATALOG</span>
                        <span className="block text-xs font-mono text-gray-300">00{557 + index}</span>
                        <span className="block text-[8px] font-mono text-gray-500">8720623451608</span>
                      </div>
                      <div>
                        <span className="block text-[8px] text-gray-500 font-mono uppercase tracking-wider mb-1">LABEL</span>
                        <span className="block text-xs font-mono text-gray-300">INTELLAGENT REC</span>
                        <span className="block text-[8px] font-mono text-gray-500">AI / SYSTEM</span>
                      </div>
                      <div>
                         <span className="block text-[8px] text-gray-500 font-mono uppercase tracking-wider mb-1">RELEASE DATE</span>
                         <span className="block text-xs font-mono text-gray-300">2026-05-13</span>
                      </div>
                    </div>
                  </div>

                  {/* Vertical Divider (Hidden on mobile) */}
                  <div className="hidden md:block w-px bg-white/20 self-stretch"></div>

                  {/* Right Section: Visuals & Barcode */}
                  <div className="w-full md:w-auto flex flex-row gap-4 items-stretch">
                    
                    {/* Logo Section */}
                    <div className="flex items-center justify-center border border-white/10 rounded-sm p-4 w-24 aspect-square">
                      <Image 
                        src="/logo/A logo.svg" 
                        alt="IntellAgent Logo" 
                        width={48} 
                        height={48}
                        className="w-full h-full opacity-80"
                      />
                    </div>

                    {/* Barcode Section */}
                    <div className="relative w-16 aspect-square bg-white opacity-90 rounded-sm overflow-hidden flex flex-col justify-between"
                         style={{
                           maskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)',
                         }}>
                      {/* Barcode Lines */}
                      <div className="w-full h-full"
                           style={{
                             backgroundImage: `repeating-linear-gradient(0deg, 
                               transparent 0px, transparent 2px, 
                               black 2px, black 4px, 
                               transparent 4px, transparent 5px, 
                               black 5px, black 8px,
                               transparent 8px, transparent 9px,
                               black 9px, black 11px,
                               transparent 11px, transparent 14px,
                               black 14px, black 16px
                             )`
                           }}>
                      </div>
                      
                      {/* Vertical text alongside barcode */}
                      <div className="absolute right-0 top-0 bottom-0 w-4 flex items-center justify-center z-10">
                         <span className="text-[6px] text-black font-mono -rotate-90 whitespace-nowrap tracking-wide bg-white/0">
                           8 720623 451608
                         </span>
                      </div>
                    </div>

                  </div>

                </div>
              </div>
            </div>
          </div>
          {/* Subtle Glow Behind - The "Wow" */}
          <div className={`absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 blur-3xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 transform scale-110 ${index % 2 === 1 ? 'translate-x-12' : '-translate-x-12'}`} />
        </div>

        {/* Text Content */}
        <div className={`lg:col-span-5 flex flex-col justify-center h-full ${index % 2 === 1 ? 'lg:order-1' : 'lg:order-2'}`}>
          <div className="mb-8">
             <span className="text-xs font-mono text-gray-400 uppercase tracking-widest mb-2 block">0{index + 1}</span>
             <h2 className="text-3xl md:text-5xl font-medium tracking-tight group-hover:text-gray-600 transition-colors duration-500">
               {project.title}
             </h2>
          </div>

          <div className="space-y-10">
            <div className="group/item">
                <span className="text-xs font-bold text-black uppercase tracking-wider mb-2 block border-l-2 border-transparent group-hover/item:border-black pl-0 group-hover/item:pl-3 transition-all duration-300">The Problem</span>
                <p className={`text-lg text-gray-600 leading-relaxed font-light ${!isExpanded ? 'line-clamp-3' : ''}`}>
                  {project.problem}
                </p>
            </div>

            <motion.div 
              initial={false}
              animate={{ height: isExpanded ? 'auto' : 0, opacity: isExpanded ? 1 : 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              <div className="space-y-10 pt-10">
                <div className="group/item">
                    <span className="text-xs font-bold text-black uppercase tracking-wider mb-2 block border-l-2 border-transparent group-hover/item:border-black pl-0 group-hover/item:pl-3 transition-all duration-300">The Solution</span>
                    <p className="text-lg text-gray-600 leading-relaxed font-light">
                      {project.solution}
                    </p>
                </div>
                <div className="group/item">
                    <span className="text-xs font-bold text-black uppercase tracking-wider mb-2 block border-l-2 border-transparent group-hover/item:border-black pl-0 group-hover/item:pl-3 transition-all duration-300">Impact</span>
                    <p className="text-lg text-gray-600 leading-relaxed font-light">
                      {project.impact}
                    </p>
                </div>
              </div>
            </motion.div>

            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className="group/btn flex items-center gap-2 text-sm font-medium text-black uppercase tracking-widest hover:text-gray-600 transition-colors cursor-pointer"
            >
              <span>{isExpanded ? 'Read Less' : 'Read More'}</span>
              <svg 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
                strokeLinecap="round" 
                strokeLinejoin="round"
                className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : 'group-hover/btn:translate-x-1'}`}
              >
                <path d="M5 12h14" />
                <path d="M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
    </motion.div>
  );
}
