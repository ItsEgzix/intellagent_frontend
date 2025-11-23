"use client";

import React from "react";
import Image from "next/image";
import SocialLoop from "../footer/components/social-loop";
import { useI18n } from "../../contexts/i18n-context";

export default function ContactLoopSection() {
  const { t } = useI18n();

  const items = Array(6).fill({
    node: (
      <div className="flex items-center gap-12">
        <span
          className="text-white whitespace-nowrap"
          style={{
            fontFamily: "var(--font-dm-sans)",
            fontSize: "64px",
            fontWeight: 600,
          }}
        >
          Let's talk
        </span>
        <Image
          src="/elements/dot.svg"
          alt="Dot"
          width={43}
          height={40}
          className="h-10 w-auto"
        />
        <span
          className="text-white whitespace-nowrap"
          style={{
            fontFamily: "var(--font-dm-sans)",
            fontSize: "64px",
            fontWeight: 600,
          }}
        >
          Contact Us
        </span>
        <Image
          src="/elements/dot.svg"
          alt="Dot"
          width={43}
          height={40}
          className="h-10 w-auto"
        />
      </div>
    ),
    title: "Contact Us",
    href: "#",
  });

  return (
    <section className="w-full bg-black py-8 border-t border-b border-white overflow-hidden">
      <SocialLoop
        items={items}
        speed={40}
        direction="left"
        logoHeight={80}
        gap={48}
        hoverSpeed={40}
        scaleOnHover={false}
        ariaLabel="Contact Loop"
        fullWidth={false}
      />
    </section>
  );
}
