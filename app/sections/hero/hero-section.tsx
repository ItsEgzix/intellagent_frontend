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
      <section className="relative pt-16 md:pt-20 lg:pt-0 pb-0">
        <div className="mx-auto max-w-[1920px] relative w-full px-4 md:px-6 lg:px-0">
          {/* Hero text section */}
          <div
            className="relative w-full"
            style={{
              height: "clamp(300px, 50vw, 962px)",
            }}
          >
            <div
              className="absolute flex flex-col z-20 hero-text-section left-4 md:left-6 lg:left-8 xl:left-[100px] 2xl:left-[calc(50%-630px)]"
              style={{
                top: "clamp(110px, 20vw, 420px)",
                width: "clamp(95vw, 90vw, 1000px)",
                maxWidth: "clamp(95vw, 90vw, 1000px)",
                paddingRight: "clamp(16px, 2vw, 32px)",
              }}
            >
              {/* Top line */}
              <div
                className="flex flex-wrap items-center mb-2 md:mb-3"
                style={{
                  gap: "clamp(8px, 1.5vw, 16px)",
                }}
              >
                <span
                  className="text-black"
                  style={{
                    fontFamily:
                      "var(--font-beatrice-display), 'Microsoft YaHei', 'PingFang SC', sans-serif",
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
                    className="h-auto cursor-pointer hover:opacity-80 transition-opacity"
                    style={{
                      width: "clamp(120px, 15vw, 249px)",
                    }}
                  />
                </a>
                <span
                  className="text-black"
                  style={{
                    fontFamily:
                      "var(--font-beatrice-display), 'Microsoft YaHei', 'PingFang SC', sans-serif",
                    fontSize: "clamp(28px, 5vw, 80px)",
                    fontWeight: 400,
                  }}
                >
                  {t.hero.buildYour}
                </span>
              </div>

              {/* Second line */}
              <div
                className="flex flex-wrap items-center mb-4 md:mb-6"
                style={{
                  gap: "clamp(8px, 1.5vw, 16px)",
                }}
              >
                <span
                  className="text-black"
                  style={{
                    fontFamily:
                      "var(--font-beatrice-display), 'Microsoft YaHei', 'PingFang SC', sans-serif",
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
                    className="h-auto"
                    style={{
                      width: "clamp(80px, 10vw, 156px)",
                    }}
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
            <div
              className="w-full overflow-hidden"
              style={{
                height: "clamp(260px, 50vw, 360px)",
              }}
            >
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
          <div
            className="hidden lg:block absolute right-0 bottom-0"
            style={{
              top: "clamp(100px, 15vw, 300px)",
              width: "clamp(300px, 32vw, 620px)",
            }}
          >
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
