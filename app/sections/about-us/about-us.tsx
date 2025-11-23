"use client";

import { useI18n } from "../../contexts/i18n-context";

export default function AboutUs() {
  const { t } = useI18n();
  return (
    <div
      id="about"
      className="relative bg-black w-screen overflow-hidden mt-0 py-[60px] z-10"
      style={{
        minHeight: "380px",
        backgroundImage: "url('/elements/Grid.svg')",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "0 0",
      }}
    >
      {/* Checkerboard pattern on the left */}
      <div className="absolute left-0 top-0 hidden md:flex">
        {/* Left column */}
        <div className="flex flex-col">
          <div className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 bg-white"></div>
          <div className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 bg-black"></div>
          <div className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 bg-white"></div>
          <div className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 bg-black"></div>
        </div>
        {/* Right column */}
        <div className="flex flex-col">
          <div className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 bg-black"></div>
          <div className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 bg-white"></div>
          <div className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 bg-black"></div>
          <div className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 bg-white"></div>
        </div>
      </div>

      {/* Text content */}
      <div className="relative flex flex-col justify-center px-4 md:pl-[170px] md:pr-6 lg:pl-[210px] lg:pr-8 xl:pl-[250px] xl:pr-12 2xl:pl-[200px] 2xl:pr-0">
        <div className="flex flex-col max-w-6xl mx-auto 2xl:mx-0 2xl:left-[calc(50%-630px)] 2xl:relative">
          {/* Heading */}
          <h2
            className="font-sans font-semibold text-white mb-3 md:mb-4 text-start"
            style={{
              fontSize: "clamp(32px, 6vw, 80px)",
              lineHeight: "1.1",
            }}
          >
            {t.aboutUs.heading}
          </h2>

          {/* Paragraph */}
          <p
            className="font-sans font-light text-white text-start max-w-[90vw] md:max-w-[80vw] lg:max-w-none"
            style={{
              fontSize: "clamp(14px, 2vw, 24px)",
              lineHeight: "1.5",
            }}
          >
            {t.aboutUs.description}
          </p>
        </div>
      </div>
    </div>
  );
}
