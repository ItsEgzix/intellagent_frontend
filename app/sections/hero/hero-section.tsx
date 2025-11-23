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

  // Memoize subtitle rendering to prevent hydration mismatches
  const subtitleContent = useMemo(() => {
    const subtitle = t.hero.subtitle;
    // Only apply Pixelify Sans to "Smart" in English
    if (subtitle.includes("Smart")) {
      const parts = subtitle.split("Smart");
      return parts.map((part, index) => (
        <span key={index}>
          {part}
          {index < parts.length - 1 && (
            <span
              style={{
                fontFamily: "var(--font-pixelify-sans)",
              }}
            >
              Smart
            </span>
          )}
        </span>
      ));
    }
    return subtitle;
  }, [t.hero.subtitle]);

  return (
    <>
      <LeftSidebar />
      <section className="relative pt-16 md:pt-20 lg:pt-0">
        <div className="mx-auto max-w-[1920px] relative w-full px-4 md:px-6 lg:px-0">
          {/* Hero text section */}
          <div className="relative w-full h-[300px] md:h-[400px] lg:h-[640px] xl:h-[780px] 2xl:h-[962px]">
            <div className="absolute flex flex-col left-4 md:left-6 lg:left-8 xl:left-[100px] 2xl:left-[calc(50%-630px)] top-[110px] md:top-[180px] lg:top-[320px] xl:top-[380px] 2xl:top-[420px] w-full max-w-[95vw] md:max-w-[90vw] lg:max-w-[750px] xl:max-w-[850px] 2xl:max-w-[1000px] z-20 pr-4 md:pr-6 lg:pr-8 hero-text-section">
              {/* Top line */}
              <div className="flex flex-wrap items-center gap-2 md:gap-3 lg:gap-4 mb-2 md:mb-3">
                <span
                  className="text-black"
                  style={{
                    fontFamily: "var(--font-beatrice-display)",
                    fontSize: "clamp(28px, 5vw, 80px)",
                    fontWeight: 400,
                  }}
                >
                  {t.hero.letUs}
                </span>
                <a
                  href="https://wa.me/601139282725"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block"
                >
                  <Image
                    src="/elements/Lets_have_chat_1920.svg"
                    alt="Let's have a Chát"
                    width={249}
                    height={77}
                    className="h-auto w-[120px] md:w-[160px] lg:w-[200px] xl:w-[249px] cursor-pointer hover:opacity-80 transition-opacity"
                  />
                </a>
                <span
                  className="text-black"
                  style={{
                    fontFamily: "var(--font-beatrice-display)",
                    fontSize: "clamp(28px, 5vw, 80px)",
                    fontWeight: 400,
                  }}
                >
                  {t.hero.buildYour}
                </span>
              </div>

              {/* Second line */}
              <div className="flex flex-wrap items-center gap-2 md:gap-3 lg:gap-4 mb-4 md:mb-6">
                <span
                  className="text-black"
                  style={{
                    fontFamily: "var(--font-beatrice-display)",
                    fontSize: "clamp(32px, 5.5vw, 80px)",
                    fontWeight: 600,
                  }}
                >
                  {t.hero.customAIAgent}
                </span>
                {/* Slider element */}
                <div className="flex items-center gap-2">
                  <Image
                    src="/elements/yellow_circle_1920.svg"
                    alt="Slider"
                    width={156}
                    height={56}
                    className="h-auto w-[80px] md:w-[110px] lg:w-[130px] xl:w-[156px]"
                  />
                </div>
              </div>

              {/* Sub text */}
              <p
                className="text-gray-600 font-sans max-w-[90vw] md:max-w-[80vw] lg:max-w-none mb-16 md:mb-0"
                style={{
                  fontSize: "clamp(14px, 2vw, 24px)",
                  fontWeight: 300,
                  lineHeight: "1.5",
                }}
              >
                {subtitleContent}
              </p>
            </div>
          </div>
          {/* Yellow box - mobile/tablet */}
          <div
            className="block lg:hidden w-screen relative left-1/2 -translate-x-1/2"
            style={{
              marginTop: "clamp(64px, 15vw, 0px)",
            }}
          >
            <div className="w-full h-[260px] md:h-[360px] overflow-hidden">
              <Image
                src="/elements/Yellow squar 1920px.svg"
                alt="Yellow Square"
                width={620}
                height={662}
                className="h-full w-full object-cover"
                priority
              />
            </div>
          </div>

          {/* Yellow box - desktop */}
          <div className="hidden lg:block absolute right-0 xl:right-0 2xl:right-[calc(40%-1000px)] top-[100px] lg:top-[200px] xl:top-[250px] 2xl:top-[300px] w-[300px] lg:w-[400px] xl:w-[500px] 2xl:w-[620px] h-[320px] lg:h-[425px] xl:h-[530px] 2xl:h-[662px]">
            <Image
              src="/elements/Yellow squar 1920px.svg"
              alt="Yellow Square"
              width={620}
              height={662}
              className="h-full w-full object-cover"
              priority
            />
          </div>
        </div>
      </section>
      {/* Black box positioned directly below yellow box - outside container for full width */}
      <AboutUs />
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
    </>
  );
}
