"use client";

import { useState, useEffect } from "react";
import { useI18n } from "../../contexts/i18n-context";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

export default function FAQSection() {
  const { t } = useI18n();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  // Set initial state after mount to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
    setOpenIndex(0); // Open first item after hydration
  }, []);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // Prevent hydration mismatch by not rendering interactive state until mounted
  if (!mounted) {
    return (
      <section className="w-full flex justify-center py-12 md:py-16 lg:py-20 bg-white">
        <div className="w-full max-w-[1600px] px-4 md:px-6 lg:px-8">
          <h2
            className="text-center text-black mb-12 md:mb-16"
            style={{
              fontFamily: "var(--font-dm-sans)",
              fontSize: "48px",
              fontWeight: 700,
            }}
          >
            {t.faq.heading}
          </h2>

          <div className="flex flex-col gap-4">
            {t.faq.questions.map((item, index) => (
              <div
                key={index}
                className="border border-black bg-white"
                style={{
                  boxShadow: "4px 4px 0px 0px rgba(0,0,0,1)",
                }}
              >
                <button
                  className="w-full flex items-center justify-between p-6 text-left"
                  disabled
                >
                  <span
                    className="text-black"
                    style={{
                      fontFamily: "var(--font-dm-sans)",
                      fontSize: "28px",
                      fontWeight: 500,
                    }}
                  >
                    {item.question}
                  </span>
                  <FaChevronDown className="text-black w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full flex justify-center py-12 md:py-16 lg:py-20 bg-white">
      <div className="w-full max-w-[1600px] px-4 md:px-6 lg:px-8">
        <h2
          className="text-center text-black mb-12 md:mb-16"
          style={{
            fontFamily: "var(--font-dm-sans)",
            fontSize: "48px",
            fontWeight: 700,
          }}
        >
          {t.faq.heading}
        </h2>

        <div className="flex flex-col gap-4">
          {t.faq.questions.map((item, index) => (
            <div
              key={index}
              className="border border-black bg-white"
              style={{
                boxShadow: "4px 4px 0px 0px rgba(0,0,0,1)",
              }}
            >
              <button
                className="w-full flex items-center justify-between p-6 text-left"
                onClick={() => toggleAccordion(index)}
                type="button"
              >
                <span
                  className="text-black"
                  style={{
                    fontFamily: "var(--font-dm-sans)",
                    fontSize: "28px",
                    fontWeight: 500,
                  }}
                >
                  {item.question}
                </span>
                {openIndex === index ? (
                  <FaChevronUp className="text-black w-5 h-5" />
                ) : (
                  <FaChevronDown className="text-black w-5 h-5" />
                )}
              </button>
              {openIndex === index && (
                <div className="px-6 pb-6">
                  <p
                    className="text-gray-600"
                    style={{
                      fontFamily: "var(--font-dm-sans)",
                      fontSize: "18px",
                      lineHeight: "1.6",
                    }}
                  >
                    {item.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
