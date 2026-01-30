"use client";

import Image from "next/image";
import { useI18n } from "../../../contexts/i18n-context";
import { motion, animate } from "framer-motion";
import { Heart, MessageCircle, Share2 } from "lucide-react";
import React, { useState, useEffect } from "react";

export default function PostGenerationSection() {
  const { t } = useI18n();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const postText = "Just deployed our new AI Agent swarm. Efficiency up 400% overnight. The future is automated. 🚀 #AI #Automation";

  return (
    <section className="w-full bg-white py-12 md:py-16 lg:py-20">
      <div className="w-full max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8 xl:px-[100px]">
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 md:gap-12 lg:gap-16">
          {/* Right Section - Visual Demonstration */}
          <div className="w-full lg:w-1/2 flex justify-center lg:justify-start">
            <div className="w-full max-w-[500px] bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden">
               {/* Post Header */}
               <div className="p-4 flex items-center gap-3 border-b border-gray-100">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center font-bold text-white">IA</div>
                  <div className="flex flex-col">
                     <span className="font-bold text-sm text-black">IntellAgent Bot</span>
                     <span className="text-xs text-gray-500">Just now • Automated</span>
                  </div>
               </div>
               
               {/* Post Content */}
               <div className="p-4 min-h-[120px]">
                  <p className="text-gray-800 text-lg leading-relaxed">
                    {isMounted ? (
                      postText.split("").map((char, index) => (
                        <motion.span
                          key={index}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0, delay: index * 0.05 }}
                        >
                          {char}
                        </motion.span>
                      ))
                    ) : (
                      <span className="opacity-0">{postText}</span>
                    )}
                  </p>
                  <motion.div
                     initial={{ opacity: 0, y: 10 }}
                     animate={{ opacity: isMounted ? 1 : 0, y: isMounted ? 0 : 10 }}
                     transition={{ delay: 2.5, duration: 0.5 }}
                     className="mt-4 rounded-lg overflow-hidden"
                  >
                     <Image 
                        src="/services/2062.jpg" 
                        alt="AI Swarm Visualization" 
                        width={500} 
                        height={300}
                        className="w-full h-64 object-cover hover:scale-105 transition-transform duration-700"
                     />
                  </motion.div>
               </div>

               {/* Post Stats/Actions */}
               <div className="p-4 border-t border-gray-100 bg-gray-50">
                  <div className="flex items-center gap-6 text-gray-500">
                     <div className="flex items-center gap-2 group cursor-pointer hover:text-red-500 transition-colors">
                        <Heart className="w-5 h-5 group-hover:fill-current" />
                        <motion.span 
                           className="text-sm font-medium"
                           animate={{ opacity: [1, 0.5, 1] }} // subtle pulse
                        >
                           <Counter from={0} to={842} />
                        </motion.span>
                     </div>
                     <div className="flex items-center gap-2 cursor-pointer hover:text-blue-500 transition-colors">
                        <MessageCircle className="w-5 h-5" />
                        <span className="text-sm font-medium">128</span>
                     </div>
                     <div className="flex items-center gap-2 cursor-pointer hover:text-green-500 transition-colors">
                        <Share2 className="w-5 h-5" />
                        <span className="text-sm font-medium">Share</span>
                     </div>
                  </div>
               </div>
            </div>
          </div>

          {/* Left Section - Text Content */}
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
              {t.postGeneration.heading}
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
              {t.postGeneration.description}
            </p>

            {/* Divider Line */}
            <div className="w-full h-px bg-gray-300 mb-6 md:mb-8"></div>

            {/* 10x Feature */}
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
                10x
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
                {t.postGeneration.featureText}
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
                  alt={t.postGeneration.buttonAlt}
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

function Counter({ from, to }: { from: number; to: number }) {
  const [count, setCount] = React.useState(from);

  React.useEffect(() => {
    const controls = animate(from, to, {
      duration: 2,
      onUpdate(value) {
        setCount(Math.floor(value));
      },
    });
    return () => controls.stop();
  }, [from, to]);

  return <>{count}</>;
}
