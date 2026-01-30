"use client";

import Image from "next/image";
import { useI18n } from "../../../contexts/i18n-context";
import { motion } from "framer-motion";
import { Terminal, CheckCircle2, Loader2 } from "lucide-react";
import React from "react";

export default function WebAutomationSection() {
  const { t } = useI18n();
  return (
    <section className="w-full bg-white py-12 md:py-16 lg:py-20">
      <div className="w-full max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8 xl:px-[100px]">
        <div className="flex flex-col lg:flex-row-reverse items-center lg:items-start gap-8 md:gap-12 lg:gap-16">
          {/* Left Section - Visual Demonstration */}
          <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
            <div className="w-full max-w-[500px] bg-[#1e1e1e] rounded-xl shadow-2xl overflow-hidden border border-gray-800">
               {/* Terminal Header */}
               <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-700 bg-[#2d2d2d]">
                  <div className="flex gap-1.5">
                     <div className="w-3 h-3 rounded-full bg-red-500/80" />
                     <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                     <div className="w-3 h-3 rounded-full bg-green-500/80" />
                  </div>
                  <div className="flex-1 text-center">
                     <span className="text-xs font-mono text-gray-400 flex items-center justify-center gap-2">
                        <Terminal className="w-3 h-3" />
                        agent-worker-01
                     </span>
                  </div>
               </div>

               {/* Terminal Content */}
               <div className="p-6 font-mono text-sm h-[320px] flex flex-col gap-3">
                  <ConsoleLines />
               </div>
            </div>
          </div>

          {/* Right Section - Text Content */}
          <div className="w-full lg:w-1/2 flex flex-col">
            {/* Main Heading */}
            <h2
              className="text-black mb-4 md:mb-6"
              style={{
                fontFamily: "var(--font-beatrice-display)",
                fontSize: "48px",
                fontWeight: 400,
                lineHeight: "1.2",
              }}
            >
              {t.webAutomation.heading} {t.webAutomation.headingChromium}
            </h2>

            {/* Description */}
            <p
              className="text-gray-600 mb-6 md:mb-8"
              style={{
                fontFamily: "var(--font-dm-sans)",
                fontSize: "18px",
                fontWeight: 400,
                lineHeight: "1.5",
              }}
            >
              {t.webAutomation.description}
            </p>

            {/* Divider Line */}
            <div className="w-full h-px bg-gray-300 mb-6 md:mb-8"></div>

            {/* 24/7 Feature */}
            <div className="mb-6 md:mb-8 flex items-center gap-4">
              <div
                className="text-black"
                style={{
                  fontFamily: "var(--font-beatrice-display)",
                  fontSize: "48px",
                  fontWeight: 500,
                  lineHeight: "1",
                }}
              >
                24/7
              </div>
              <p
                className="text-black"
                style={{
                  fontFamily: "var(--font-dm-sans)",
                  fontSize: "18px",
                  fontWeight: 400,
                  lineHeight: "1.4",
                }}
              >
                {t.webAutomation.featureText}
              </p>
            </div>

            {/* Call to Action Button */}
            <div className="mt-auto">
              <a
                href="https://wa.me/601139282725"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block"
              >
                <Image
                  src="/elements/yellow lets have a chat.svg"
                  alt={t.webAutomation.buttonAlt}
                  width={170}
                  height={55}
                  className="h-auto cursor-pointer hover:opacity-80 transition-opacity"
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ConsoleLines() {
  const [lines, setLines] = React.useState<Array<{ id: number; text: string; status: 'pending' | 'running' | 'done' }>>([]);
  
  const steps = React.useMemo(() => [
     "Initializing headless browser...",
     "Navigating to target portal...",
     "SOLVING_CAPTCHA_V3...",
     "Extracting table data (428 rows)...",
     "Formatting payload...",
     "Pushing to database..."
  ], []);

  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  React.useEffect(() => {
     let currentIndex = 0;
     
     const addLine = () => {
        if (currentIndex >= steps.length) {
           timeoutRef.current = setTimeout(() => {
              setLines([]);
              currentIndex = 0;
              addLine();
           }, 2000);
           return;
        }

        setLines(prev => [...prev, { id: Date.now() + Math.random(), text: steps[currentIndex], status: 'running' }]);
        
        // Mark previous as done
        if (currentIndex > 0) {
           setLines(prev => prev.map((l, i) => i === prev.length - 2 ? { ...l, status: 'done' } : l));
        }

        currentIndex++;
        timeoutRef.current = setTimeout(addLine, 1200);
     };

     addLine();

     return () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
     };
  }, [steps]);

  return (
     <div className="flex flex-col gap-3">
        {lines.map((line, i) => (
           <motion.div 
             key={line.id} 
             initial={{ opacity: 0, x: -10 }}
             animate={{ opacity: 1, x: 0 }}
             className="flex items-center gap-3 text-gray-300"
           >
              {i === lines.length - 1 ? (
                 <Loader2 className="w-4 h-4 animate-spin text-blue-400 shrink-0" />
              ) : (
                 <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
              )}
              <span className={i === lines.length - 1 ? "text-blue-300" : "text-gray-300"}>
                 <span className="text-gray-500 mr-2">{`>`}</span>
                 {line.text}
              </span>
           </motion.div>
        ))}
     </div>
  );
}
