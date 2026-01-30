"use client";

import Image from "next/image";
import { useI18n } from "../../../contexts/i18n-context";
import { motion } from "framer-motion";
import { Mic, Phone, Volume2, LayoutGrid } from "lucide-react";

export default function AIVoiceAgentSection() {
  const { t } = useI18n();
  return (
    <section className="w-full bg-white py-12 md:py-16 lg:py-20">
      <div className="w-full max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8 xl:px-[100px]">
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 md:gap-12 lg:gap-16">
          {/* Left Section - Visual Demonstration */}
          <div className="w-full lg:w-1/2 flex justify-center lg:justify-start">
            <div className="w-full max-w-[500px] bg-zinc-900 rounded-2xl shadow-2xl overflow-hidden border border-zinc-800">
               {/* Call Header */}
               <div className="pt-8 pb-4 flex flex-col items-center z-20">
                  <div className="w-20 h-20 bg-indigo-500/20 rounded-full flex items-center justify-center mb-4">
                     <div className="w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center">
                        <Phone className="text-white w-6 h-6" />
                     </div>
                  </div>
                  <h3 className="text-white text-2xl font-semibold tracking-wide">IntellAgent Voice</h3>
                  <span className="text-emerald-400 text-sm font-mono flex items-center gap-2 mt-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    Connected • 00:42
                  </span>
               </div>
               
               {/* Audio Waveform Visualization */}
               <div className="flex items-center justify-center gap-1.5 h-24 my-6">
                 {[...Array(8)].map((_, i) => (
                   <motion.div
                     key={i}
                     className="w-1.5 bg-indigo-500 rounded-full"
                     animate={{
                       height: ["20%", "80%", "40%", "100%", "30%"],
                       backgroundColor: ["#6366f1", "#818cf8", "#a5b4fc"]
                     }}
                     transition={{
                       duration: 0.6,
                       repeat: Infinity,
                       repeatType: "reverse",
                       ease: "easeInOut",
                       delay: i * 0.08,
                     }}
                     style={{ height: "40%" }}
                   />
                 ))}
               </div>

               {/* Action Controls */}
               <div className="w-full bg-zinc-900/50 backdrop-blur-sm p-8 mt-auto">
                  <div className="flex items-center justify-between px-4">
                     <button className="flex flex-col items-center gap-2 group">
                        <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center group-hover:bg-zinc-700 transition-colors">
                           <Mic className="text-white w-5 h-5" />
                        </div>
                        <span className="text-zinc-500 text-xs">Mute</span>
                     </button>

                     <button className="flex flex-col items-center gap-2 group">
                        <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center group-hover:bg-zinc-700 transition-colors">
                           <LayoutGrid className="text-white w-5 h-5" />
                        </div>
                        <span className="text-zinc-500 text-xs">Keypad</span>
                     </button>

                     <button className="flex flex-col items-center gap-2 group">
                        <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center group-hover:bg-zinc-700 transition-colors">
                           <Volume2 className="text-white w-5 h-5" />
                        </div>
                        <span className="text-zinc-500 text-xs">Speaker</span>
                     </button>

                     <button className="flex flex-col items-center gap-2 group">
                        <div className="w-12 h-12 rounded-full bg-red-500 flex items-center justify-center hover:bg-red-600 transition-all shadow-lg shadow-red-500/30">
                           <Phone className="text-white w-6 h-6 rotate-[135deg]" />
                        </div>
                        <span className="text-zinc-500 text-xs">End</span>
                     </button>
                  </div>
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
              {t.aiVoiceAgent.heading}
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
              {t.aiVoiceAgent.description}
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
                {t.aiVoiceAgent.featureText}
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
                  alt={t.aiVoiceAgent.buttonAlt}
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
