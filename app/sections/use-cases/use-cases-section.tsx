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
        {/* Heading for smaller screens - black text */}
        <div className="2xl:hidden text-center py-8 px-4">
          <h2
            className="text-black mb-2"
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "32px",
              fontWeight: 600,
            }}
          >
            {t.useCases.heading}
          </h2>
          <p
            className="text-black"
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "clamp(14px, 2vw, 24px)",
              fontWeight: 300,
              lineHeight: "1.5",
            }}
          >
            {t.useCases.subtext}
          </p>
        </div>

        {/* Content */}
        <div className="relative">
          {/* Left decorative line */}
          <div
            className="absolute top-0 bg-black z-10 hidden 2xl:block"
            style={{
              left: "40px",
              width: "30px",
              bottom: "70px",
            }}
          ></div>

          {/* Right decorative line */}
          <div
            className="absolute top-0 bg-black z-10 hidden 2xl:block"
            style={{
              right: "40px",
              width: "30px",
              bottom: "90px",
            }}
          ></div>

          <AIVoiceAgentSection />
          <PostGenerationSection />
          <WebAutomationSection />
        </div>
      </div>
    </section>
  );
}
