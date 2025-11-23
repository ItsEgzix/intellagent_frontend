"use client";

import Image from "next/image";
import { useI18n } from "../../../contexts/i18n-context";

export default function PostGenerationSection() {
  const { t } = useI18n();
  return (
    <section className="w-full bg-white py-12 md:py-16 lg:py-20">
      <div className="w-full max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8 xl:px-[100px]">
        <div className="flex flex-col lg:flex-row-reverse items-center lg:items-start gap-8 md:gap-12 lg:gap-16">
          {/* Right Section - Visual Demonstration */}
          <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
            <div className="w-full max-w-[600px]">
              <Image
                src="/elements/socail media.svg"
                alt="Social Media Post Generation"
                width={600}
                height={600}
                className="w-full h-auto"
                loading="lazy"
              />
            </div>
          </div>

          {/* Left Section - Text Content */}
          <div className="w-full lg:w-1/2 flex flex-col">
            {/* Main Heading */}
            <h2
              className="text-black mb-4 md:mb-6"
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "48px",
                fontWeight: 600,
                lineHeight: "1.2",
              }}
            >
              {t.postGeneration.heading}
            </h2>

            {/* Description */}
            <p
              className="text-gray-600 mb-6 md:mb-8"
              style={{
                fontFamily: "Inter, sans-serif",
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
                  fontFamily: "Inter, sans-serif",
                  fontSize: "48px",
                  fontWeight: 700,
                  lineHeight: "1",
                }}
              >
                10x
              </div>
              <p
                className="text-black"
                style={{
                  fontFamily: "Inter, sans-serif",
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
