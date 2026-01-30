"use client";

import { useI18n } from "../contexts/i18n-context";
import Image from "next/image";

const ResearchPage = () => {
  const { t } = useI18n();

  // Curated Unsplash IDs for technical/abstract research feel
  const researchImages = [
    "/research_images/image.png", // AI/Neural (AI x Music)
    "/research_images/image copy.png", // Amaze Venture (Games x AI)
    "/research_images/Generated Image January 20, 2026 - 10_57AM.png", // VR teaching assistant
    "https://images.unsplash.com/photo-1639322537228-f710d846310a?auto=format&fit=crop&q=80&w=800", // Digital architecture
  ];

  return (
    <main className="bg-white min-h-screen text-black relative selection:bg-black selection:text-white overflow-x-hidden pt-40 pb-32" 
          style={{ fontFamily: 'Georgia, "Times New Roman", Times, serif' }}>

      <div className="container mx-auto px-6 md:px-12 lg:px-20">
        {/* Academic Header Metadata */}
        <div className="border-t-4 border-black pt-4 mb-20 flex flex-col md:flex-row justify-between items-center text-[11px] font-mono tracking-wider font-bold">
           <div className="flex gap-10">
              <span className="uppercase tracking-widest">IntellAgent Execution Systems Journal</span>
              <span className="text-gray-400">|</span>
              <span className="uppercase tracking-widest">Volume 01, Issue 01</span>
           </div>
           <div className="mt-4 md:mt-0 uppercase tracking-widest">
              DOI: 10.IA/SYS_EXEC.2024.1.08
           </div>
        </div>

        {/* Paper Header: Title, Authors, Affiliations */}
        <div className="text-center mb-24 max-w-4xl mx-auto">
           <h1 className="text-4xl md:text-5xl font-bold mb-10 leading-tight">
              {t.research.heading}
           </h1>
           
           <div className="space-y-4">
              <p className="text-xl font-bold tracking-tight">IntellAgent R&D Collective</p>
              <p className="text-sm font-mono text-gray-500 uppercase tracking-widest italic pt-2">
                 Multimodal Agentic Systems Laboratory
              </p>
           </div>
        </div>

        {/* Paper Abstract */}
        <div className="mb-24 border-y border-black/10 py-16">
           <div className="max-w-3xl mx-auto px-6">
              <h2 className="text-[10px] font-black uppercase tracking-[0.5em] mb-8 text-center text-gray-400 font-mono">Abstract</h2>
              <p className="text-lg md:text-xl leading-relaxed text-justify indent-8 text-gray-900 italic">
                "{t.research.toneBlock}"
              </p>
              <div className="mt-12 flex justify-center gap-10 text-[9px] font-mono font-bold uppercase tracking-widest text-gray-400">
                 <span>Received: 10.01.2024</span>
                 <span>Accepted: 14.01.2024</span>
              </div>
           </div>
        </div>

        {/* Body Content: Two Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-20 items-start">
           
           {t.research.topics.map((topic: any, index: number) => (
             <section key={index} className="space-y-6">
                <div className="flex items-center gap-3 mb-4">
                   <h2 className="text-sm font-bold uppercase tracking-widest font-mono flex items-center gap-3">
                      {index + 1}. {topic.title}
                      {topic.status && (
                        <span className="text-[9px] border border-black px-1.5 py-0.5 rounded-full font-black animate-pulse">
                          {topic.status}
                        </span>
                      )}
                   </h2>
                   <div className="h-px flex-1 bg-black/10"></div>
                </div>

                <p className="text-base leading-relaxed text-justify text-gray-800 indent-8">
                   {topic.description}
                </p>

                {/* Figure Block */}
                <div className="py-8 space-y-4">
                   <div className="relative aspect-[4/3] w-full border border-black/10 grayscale">
                      <Image 
                        src={researchImages[index % researchImages.length]}
                        alt={`Fig ${index + 1}`}
                        fill
                        className="object-cover" 
                      />
                   </div>
                   <div className="p-4 border-l border-black/20 bg-gray-50/50">
                      <p className="text-[10px] font-mono leading-relaxed text-gray-600">
                         <span className="font-bold text-black uppercase mr-2 tracking-tighter">Fig 0{index + 1}:</span>
                        Conceptual visualization of the experimental 3D maze game, where a player navigates using voice commands to interact with adaptive, AI-driven NPCs that respond to player behavior in real-time.
                      </p>
                   </div>
                </div>

                <p className="text-base leading-relaxed text-justify text-gray-800 indent-8">
                   {topic.details}
                </p>
             </section>
           ))}

        </div>

        {/* Formal References Section */}
        <div className="mt-40 pt-16 border-t border-black/20">
           <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] mb-12 font-mono text-gray-400">References</h3>
           <ol className="space-y-6 list-decimal list-inside text-[10px] font-mono text-gray-600 leading-relaxed uppercase tracking-tighter">
              <li className="pl-4">INTELLAGENT COLLECTIVE. "SYSTEMIC VELOCITY IN MULTI-AGENT LOOP ORCHESTRATION." IA-R&D TR.2024.1.</li>
              <li className="pl-4">DOZIER, X. ET AL. "POST-ENTROPY DESIGN PATTERNS FOR GEN-Z DIRECTED AI STUDIOS." STUDIO EXEC PRESS, 2024.</li>
              <li className="pl-4">"THE SYNTHESIS OF SPEED AND STABILITY: A MANIFESTO FOR THE EXECUTION GENERATION." INTERNAL INTELLAGENT ARCHIVES.</li>
           </ol>
        </div>

        {/* Digital Signature */}
        <div className="mt-32 flex flex-col items-center gap-6 opacity-30">
           <div className="h-20 w-px bg-black/20"></div>
           <div className="text-[9px] font-mono uppercase tracking-[1.5em]">END_OF_DOCUMENT</div>
        </div>

      </div>
    </main>
  );
};

export default ResearchPage;
