"use client";

import { useI18n } from "../../contexts/i18n-context";

export default function AboutUs() {
  const { t } = useI18n();
  return (
    <div
      id="about"
      className="relative bg-black w-screen overflow-hidden mt-0 pb-[60px] z-10"
      style={{
        height: "348px",
        marginTop: "0",
        paddingTop: "0",
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
          <div
            className="bg-white"
            style={{ width: "87px", height: "87px" }}
          ></div>
          <div
            className="bg-black"
            style={{ width: "87px", height: "87px" }}
          ></div>
          <div
            className="bg-white"
            style={{ width: "87px", height: "87px" }}
          ></div>
          <div
            className="bg-black"
            style={{ width: "87px", height: "87px" }}
          ></div>
        </div>
        {/* Right column */}
        <div className="flex flex-col">
          <div
            className="bg-black"
            style={{ width: "87px", height: "87px" }}
          ></div>
          <div
            className="bg-white"
            style={{ width: "87px", height: "87px" }}
          ></div>
          <div
            className="bg-black"
            style={{ width: "87px", height: "87px" }}
          ></div>
          <div
            className="bg-white"
            style={{ width: "87px", height: "87px" }}
          ></div>
        </div>
      </div>

      {/* Text content */}
      <div className="relative flex flex-col justify-center items-center h-full px-4">
        <div className="flex flex-col items-center max-w-6xl mx-auto text-center">
          {/* Heading */}
          <h2
            className="font-sans font-semibold text-white mb-3 md:mb-4"
            style={{
              fontSize: "clamp(32px, 6vw, 80px)",
              lineHeight: "1.1",
            }}
          >
            {t.aboutUs.heading}
          </h2>

          {/* Paragraph */}
          <p
            className="font-sans font-light text-white max-w-[90vw] md:max-w-[80vw] lg:max-w-4xl"
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
