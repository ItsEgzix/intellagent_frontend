"use client";

import Image from "next/image";
import React from "react";

export interface ContentItem {
  title: string;
  description: string;
}

interface ContentSectionProps {
  id: string;
  heading: string | React.ReactNode;
  description: string;
  items: ContentItem[];
  logo: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
  children?: React.ReactNode;
  highlightImage?: {
    src: string;
    alt: string;
  };
  highlightText?: string;
}

export default function ContentSection({
  id,
  heading,
  description,
  items,
  logo,
  children,
  highlightImage,
  highlightText,
}: ContentSectionProps) {
  return (
    <section id={id} className="w-full flex justify-center">
      <div className="w-full max-w-full bg-black px-4 md:px-6 lg:px-8 py-8 md:py-12 lg:py-16">
        <div className="flex flex-row items-start justify-between gap-8 md:gap-12 lg:gap-16 xl:ml-[100px] xl:mr-[100px] pr-4 md:pr-6 lg:pr-8">
          {/* Text Content */}
          <div className="flex flex-col items-start flex-1">
            {/* Heading */}
            <h2
              className="text-white mb-4 md:mb-6"
              style={{
                fontFamily: "var(--font-dm-sans)",
                fontSize: "64px",
                fontWeight: 400,
                lineHeight: "1.2",
              }}
            >
              {typeof heading === "string" ? (
                <>
                  {heading}
                  {highlightText && highlightImage && (
                    <span className="relative inline-block">
                      <Image
                        src={highlightImage.src}
                        alt={highlightImage.alt}
                        fill
                        className="object-contain scale-125"
                        style={{
                          zIndex: 0,
                          top: "5px",
                        }}
                      />
                      <span className="relative z-10">{highlightText}</span>
                    </span>
                  )}
                </>
              ) : (
                heading
              )}
            </h2>

            {/* Arrow Circle SVG */}
            <div className="mb-4 md:mb-6 pr-8 md:pr-12 lg:pr-16 xl:pr-20">
              <Image
                src="/elements/arrow_circle_1920.svg"
                alt="Arrow Circle"
                width={134}
                height={53}
                className="h-auto w-auto"
              />
            </div>

            {/* Sub text */}
            <p
              className="text-gray-300"
              style={{
                fontFamily: "var(--font-dm-sans)",
                fontSize: "24px",
                fontWeight: 300,
                lineHeight: "1.5",
              }}
            >
              {description}
            </p>

            {children}
          </div>

          {/* Grid Logo */}
          <div className="hidden xl:block shrink-0 ml-auto">
            <Image
              src={logo.src}
              alt={logo.alt}
              width={logo.width}
              height={logo.height}
              className="h-auto w-auto"
            />
          </div>
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 lg:gap-16 mt-12 md:mt-16 lg:mt-20 xl:ml-[100px] xl:mr-[100px]">
          {items.map((item, index) => (
            <div
              key={index}
              className="flex flex-col relative overflow-hidden p-4 md:p-6 cursor-pointer group bg-transparent"
            >
              <div className="absolute inset-0 bg-[#02B6D7] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-in-out z-0"></div>
              <div className="relative z-10">
                <h3
                  className="text-white mb-2 md:mb-3"
                  style={{
                    fontFamily: "var(--font-dm-sans)",
                    fontSize: "32px",
                    fontWeight: 600,
                  }}
                >
                  {item.title}
                </h3>
                <p
                  className="text-white mb-4"
                  style={{
                    fontFamily: "var(--font-dm-sans)",
                    fontSize: "16px",
                    fontWeight: 400,
                    lineHeight: "1.5",
                  }}
                >
                  {item.description}
                </p>
                <div className="w-full h-px bg-white"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
