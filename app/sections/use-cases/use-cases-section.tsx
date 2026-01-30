"use client";

import AIVoiceAgentSection from "./components/ai-voice-agent-section";
import PostGenerationSection from "./components/post-generation-section";
import WebAutomationSection from "./components/web-automation-section";
import { useI18n } from "../../contexts/i18n-context";

export default function UseCasesSection() {
  const { t } = useI18n();
  return (
    <section id="use-cases" className="w-full bg-white relative">
      <div className="w-full max-w-[1600px] mx-auto relative">
        {/* Section Heading */}
        <div className="text-center py-12 px-4 mb-8">
          <h2
            className="text-black mb-4"
            style={{
              fontFamily: "var(--font-beatrice-display)",
              fontSize: "64px",
              fontWeight: 400,
              lineHeight: "1.1",
            }}
          >
            {t.useCases.heading}
          </h2>
          <p
            className="text-black max-w-2xl mx-auto"
            style={{
              fontFamily: "var(--font-dm-sans)",
              fontSize: "24px",
              fontWeight: 300,
              lineHeight: "1.5",
            }}
          >
            {t.useCases.subtext}
          </p>
        </div>

        {/* Content */}
        <div className="relative">


          <AIVoiceAgentSection />
          <WebAutomationSection />
          
          <div className="relative overflow-hidden">
            <div className="blur-[2px] opacity-80 pointer-events-none select-none transition duration-500">
               <PostGenerationSection />
            </div>
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-end pb-12 bg-gradient-to-t from-white via-white/60 to-transparent">
               <a 
                  href="/what-we-build" 
                  className="inline-flex items-center justify-center px-8 py-4 bg-black text-white text-lg font-medium rounded-full hover:bg-zinc-800 transition-all hover:scale-105 shadow-xl"
               >
                  See What We Built
               </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
