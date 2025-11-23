"use client";

import Image from "next/image";
import { useI18n } from "../../../contexts/i18n-context";

export default function LeftSidebar() {
  const { t } = useI18n();

  return (
    <>
      {/* Vertical Sidebar - Visible only at xl+ breakpoint (1280px+) */}
      <div className="hidden xl:flex absolute left-0 top-0 z-40">
        {/* Div with border on right side - extends to touch black box */}
        <div className="h-[780px] xl:h-[780px] 2xl:h-[962px] pl-10 xl:pl-12 pr-3 xl:pr-4 border-r-3 border-black flex flex-col justify-between items-center">
          {/* WATCH INTRO section - top */}
          <div className="flex flex-col items-center gap-2 pt-8 cursor-default pointer-events-none opacity-60">
            <div
              className="text-black uppercase font-sans font-medium text-lg leading-none"
              style={{
                writingMode: "vertical-rl",
                textOrientation: "mixed",
                transform: "rotate(180deg)",
              }}
            >
              {t.sidebar.watchIntro}
            </div>
            <Image
              src="/icons/video_play_icon.svg"
              alt="Play"
              width={24}
              height={24}
              className="w-6 h-6"
            />
          </div>

          {/* SCROLL DOWN section - bottom */}
          <div className="flex flex-col items-center gap-2 pb-8">
            <div
              className="text-black uppercase font-sans font-medium text-lg leading-none"
              style={{
                writingMode: "vertical-rl",
                textOrientation: "mixed",
                transform: "rotate(180deg)",
              }}
            >
              {t.sidebar.scrollDown}
            </div>
            <Image
              src="/icons/Arrow_icon.svg"
              alt="Scroll Down"
              width={32}
              height={32}
              className="w-8 h-8"
            />
          </div>
        </div>
      </div>
    </>
  );
}

// Horizontal Sidebar Component - to be used in hero section
export function HorizontalSidebar() {
  const { t } = useI18n();

  return (
    <div className="flex xl:hidden w-full justify-center items-center py-6 md:py-8 border-b-2 border-black bg-white">
      {/* WATCH INTRO section */}
      <div className="flex items-center gap-3 cursor-default pointer-events-none opacity-60">
        <div className="text-black uppercase font-sans font-medium text-base leading-none">
          {t.sidebar.watchIntro}
        </div>
        <Image
          src="/icons/video_play_icon.svg"
          alt="Play"
          width={24}
          height={24}
          className="w-6 h-6 rotate-180"
        />
      </div>
    </div>
  );
}
