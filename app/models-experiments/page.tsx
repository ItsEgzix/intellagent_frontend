"use client";

import { useI18n } from "../contexts/i18n-context";
import Image from "next/image";

const ModelsExperimentsPage = () => {
  const { t } = useI18n();

  return (
    <main className="bg-[#050505] min-h-screen text-cyan-50 relative selection:bg-[#02B6D7] selection:text-black overflow-hidden font-mono">
      
      {/* Retro Scanline Overlay */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] pointer-events-none" />
      
      {/* CRT Flicker & Orbit Animation */}
      <style jsx global>{`
        @keyframes flicker {
          0% { opacity: 0.97; }
          5% { opacity: 0.95; }
          10% { opacity: 0.9; }
          15% { opacity: 0.95; }
          20% { opacity: 0.99; }
          25% { opacity: 0.95; }
          30% { opacity: 0.9; }
          35% { opacity: 0.96; }
          40% { opacity: 0.98; }
          45% { opacity: 0.95; }
          50% { opacity: 0.99; }
          55% { opacity: 0.93; }
          60% { opacity: 0.9; }
          65% { opacity: 0.96; }
          70% { opacity: 1; }
          75% { opacity: 0.97; }
          80% { opacity: 0.95; }
          85% { opacity: 0.92; }
          90% { opacity: 0.96; }
          95% { opacity: 0.99; }
          100% { opacity: 0.94; }
        }
        @keyframes slowOrbit {
          0% { transform: scale(1.1) translate(-10px, -10px); }
          25% { transform: scale(1.1) translate(10px, -10px); }
          50% { transform: scale(1.1) translate(10px, 10px); }
          75% { transform: scale(1.1) translate(-10px, 10px); }
          100% { transform: scale(1.1) translate(-10px, -10px); }
        }
        .animate-flicker {
          animation: flicker 0.15s infinite;
        }
        .animate-orbit {
          animation: slowOrbit 40s linear infinite;
        }
      `}</style>

      <div className="relative z-10">
        {/* Full Width System Header - Spanning to Top under Navbar */}
        <div className="relative w-full h-[700px] md:h-[800px] flex flex-col justify-end group border-b border-[#02B6D7]/30 overflow-hidden">
            <Image 
                src="/mock_image/lab-header.jpg" 
                alt="Lab Header" 
                fill 
                className="object-cover opacity-60 animate-orbit" 
                priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-transparent h-40" /> {/* Top fade for navbar readability */}
            
            <div className="relative z-10 w-full max-w-[1700px] mx-auto px-4 md:px-8 pb-12 pt-40">
                <div className="flex flex-col md:flex-row justify-between items-end gap-8 w-full border-t border-[#02B6D7]/30 pt-8">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-xs md:text-sm text-[#02B6D7] font-bold tracking-widest uppercase">
                            <span className="w-2 h-2 bg-[#02B6D7] rounded-full animate-pulse"></span>
                            <span>System Status: EXPERIMENTAL</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl leading-none text-white animate-flicker" 
                            style={{ fontFamily: 'var(--font-pixelify-sans)' }}>
                            INTELLAGENT LAB_
                            <span className="block text-3xl md:text-5xl text-white/30 mt-2">// PROTOTYPES</span>
                        </h1>
                    </div>
                    <div className="text-right max-w-lg">
                        <p className="text-[#02B6D7]/80 text-base md:text-lg font-light leading-relaxed font-mono w-full md:w-auto">
                        {t.modelsExperiments.subheading}
                        </p>
                        <div className="mt-4 flex justify-end gap-1">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className={`h-1 w-8 ${i < 3 ? 'bg-[#02B6D7]' : 'bg-[#02B6D7]/20'}`}></div>
                        ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div className="py-20 px-4 md:px-8 max-w-[1700px] mx-auto">
            {/* Experiment Modules Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-32">
            {t.modelsExperiments.experiments.map((experiment: any, index: number) => (
                <div key={index} 
                    className="group relative bg-[#02B6D7]/5 border border-[#02B6D7]/20 hover:border-[#02B6D7] transition-all duration-300 p-6 flex flex-col h-full hover:shadow-[0_0_30px_-5px_#02B6D740] hover:scale-[1.02]">
                
                {/* Decorative module corners */}
                <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#02B6D7] opacity-50 group-hover:opacity-100 transition-opacity"></div>
                <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[#02B6D7] opacity-50 group-hover:opacity-100 transition-opacity"></div>
                <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-[#02B6D7] opacity-50 group-hover:opacity-100 transition-opacity"></div>
                <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#02B6D7] opacity-50 group-hover:opacity-100 transition-opacity"></div>

                <div className="flex justify-between items-center mb-6 text-[10px] text-[#02B6D7] font-bold tracking-widest uppercase group-hover:text-[#02B6D7] transition-colors">
                    <span>EXP_0{index + 1}</span>
                    <span>[ R&D ]</span>
                </div>

                <h3 className="text-2xl mb-4 text-[#FFB400] group-hover:text-white transition-colors" 
                    style={{ fontFamily: 'var(--font-pixelify-sans)' }}>
                    {experiment.title}
                </h3>
                
                <p className="text-base text-cyan-100/90 mb-6 font-medium leading-normal">
                    {experiment.description}
                </p>

                <div className="mt-auto pt-6 border-t border-[#02B6D7]/20">
                    <p className="text-sm text-[#02B6D7]/70 leading-relaxed font-light">
                        <span className="text-[#02B6D7] font-bold mr-2">&gt;</span>
                        {experiment.details}
                    </p>
                </div>
                </div>
            ))}
            </div>

            {/* System Core / Philosophy Block */}
            <div className="relative border border-dashed border-[#02B6D7]/40 p-8 md:p-16 text-center max-w-4xl mx-auto overflow-hidden">
                
                {/* Background Matrix Rain or just decoration */}
                <div className="absolute inset-0 opacity-[0.03]" 
                    style={{ backgroundImage: 'radial-gradient(#02B6D7 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
                </div>

                <div className="relative z-10">
                    <span className="inline-block px-3 py-1 bg-[#02B6D7]/10 text-[#02B6D7] text-xs tracking-widest font-bold uppercase mb-6 rounded">
                        Core Directive
                    </span>
                    <p className="text-2xl md:text-4xl font-bold leading-tight text-white mb-2"
                    style={{ fontFamily: 'var(--font-pixelify-sans)' }}>
                    "{t.modelsExperiments.philosophy.text}"
                    </p>
                    <p className="text-[#02B6D7] text-sm mt-4 uppercase tracking-[0.3em]">
                    // End of Line
                    </p>
                </div>
            </div>
        </div>
      </div>
      <div className="relative z-10 bg-[#050505]">
      </div>
    </main>
  );
};

export default ModelsExperimentsPage;
