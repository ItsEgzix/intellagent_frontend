"use client";

import { useI18n } from "../../contexts/i18n-context";

export default function IPhoneSection() {
  const { t } = useI18n();
  return (
    <section className="w-full hidden 2xl:flex justify-center">
      <div
        className="mx-auto flex items-end justify-center bg-black"
        style={{
          width: "100%",
          height: "300px",
        }}
      >
        <div
          className="relative flex items-center justify-center bg-white"
          style={{
            width: "1460px",
            height: "250px",
            borderTopLeftRadius: "400px",
            borderTopRightRadius: "400px",
          }}
        >
          {/* iPhone notch */}
          <div
            className="absolute bg-black hidden 2xl:flex items-center justify-center"
            style={{
              width: "400px",
              height: "100px",
              borderRadius: "100px",
              top: "15px",
              left: "50%",
              transform: "translateX(-50%)",
            }}
          >
            {/* Heading inside notch - white text */}
            <h2
              className="text-white text-center"
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "32px",
                fontWeight: 600,
              }}
            >
              {t.useCases.heading}
            </h2>
          </div>

          {/* Subtext below notch */}
          <div
            className="absolute hidden 2xl:block text-center"
            style={{
              top: "130px",
              left: "50%",
              transform: "translateX(-50%)",
              width: "100%",
            }}
          >
            <p
              className="text-black"
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "clamp(14px, 2vw, 24px)",
                fontWeight: 300,
                lineHeight: "1.5",
              }}
            >
              {t.useCases.subtext}
            </p>
          </div>

          {/* Content goes here */}
        </div>
      </div>
    </section>
  );
}
