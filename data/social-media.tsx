import React from "react";

export interface LoopItem {
  node: React.ReactNode;
  title: string;
  href: string;
}

// Social media items for header navigation
export interface SocialItem {
  label: string;
  link: string;
}

export const socialItems: SocialItem[] = [
  { label: "X", link: "https://X.com" },
  { label: "GitHub", link: "https://github.com" },
  { label: "LinkedIn", link: "https://linkedin.com" },
];

// Social media loop items for footer
export const socialLoopItems: LoopItem[] = [
  {
    node: (
      <span
        className="text-[64px] md:text-[80px] lg:text-[100px] font-normal text-white/50 hover:text-white transition-colors"
        style={{ fontFamily: "var(--font-dm-sans)" }}
      >
        Linkedin
      </span>
    ),
    title: "Linkedin",
    href: "#",
  },
  {
    node: (
      <span
        className="text-[64px] md:text-[80px] lg:text-[100px] font-normal text-white/50 hover:text-white transition-colors"
        style={{ fontFamily: "var(--font-dm-sans)" }}
      >
        Git Hub
      </span>
    ),
    title: "GitHub",
    href: "#",
  },
  {
    node: (
      <span
        className="text-[64px] md:text-[80px] lg:text-[100px] font-normal text-white/50 hover:text-white transition-colors"
        style={{ fontFamily: "var(--font-dm-sans)" }}
      >
        X
      </span>
    ),
    title: "X",
    href: "#",
  },
  {
    node: (
      <span
        className="text-[64px] md:text-[80px] lg:text-[100px] font-normal text-white/50 hover:text-white transition-colors"
        style={{ fontFamily: "var(--font-dm-sans)" }}
      >
        LinkedIn
      </span>
    ),
    title: "LinkedIn",
    href: "#",
  },
  {
    node: (
      <span
        className="text-[64px] md:text-[80px] lg:text-[100px] font-normal text-white/50 hover:text-white transition-colors"
        style={{ fontFamily: "var(--font-dm-sans)" }}
      >
        Discord
      </span>
    ),
    title: "Discord",
    href: "#",
  },
  {
    node: (
      <span
        className="text-[64px] md:text-[80px] lg:text-[100px] font-normal text-white/50 hover:text-white transition-colors"
        style={{ fontFamily: "var(--font-dm-sans)" }}
      >
        Instagram
      </span>
    ),
    title: "Instagram",
    href: "#",
  },
];
