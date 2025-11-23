"use client";

import Image from "next/image";
import Link from "next/link";
import { useI18n } from "../../contexts/i18n-context";
import { useState, useRef, useEffect, useMemo } from "react";
import { locales, type Locale } from "@/lib/i18n";
import StaggeredMenu from "@/components/StaggeredMenu";
import { languageNames } from "@/util/helpers/constants";
import { socialItems } from "@/data/social-media";

export default function Header() {
  const { t, locale, setLocale } = useI18n();
  const [isDesktopDropdownOpen, setIsDesktopDropdownOpen] = useState(false);
  const [isMobileDropdownOpen, setIsMobileDropdownOpen] = useState(false);
  const desktopDropdownRef = useRef<HTMLDivElement>(null);
  const mobileDropdownRef = useRef<HTMLDivElement>(null);

  const menuItems = useMemo(
    () => [
      {
        label: "Home",
        ariaLabel: "Go to home section",
        link: "#",
      },
      {
        label: t.header.aboutUs,
        ariaLabel: t.header.aboutUs,
        link: "#about",
      },
      {
        label: t.header.services,
        ariaLabel: t.header.services,
        link: "#services",
      },
      {
        label: t.header.useCases,
        ariaLabel: t.header.useCases,
        link: "#use-cases",
      },
      {
        label: t.header.process,
        ariaLabel: t.header.process,
        link: "#process",
      },
      {
        label: t.header.contactUs,
        ariaLabel: t.header.contactUs,
        link: "#contact",
      },
    ],
    [
      t.header.aboutUs,
      t.header.services,
      t.header.useCases,
      t.header.process,
      t.header.contactUs,
    ]
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        desktopDropdownRef.current &&
        !desktopDropdownRef.current.contains(event.target as Node)
      ) {
        setIsDesktopDropdownOpen(false);
      }
      if (
        mobileDropdownRef.current &&
        !mobileDropdownRef.current.contains(event.target as Node)
      ) {
        setIsMobileDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="absolute top-0 left-0 right-0 z-50">
      {/* Desktop Header */}
      <div className="hidden lg:block">
        <div className="absolute left-1/2 -translate-x-1/2 top-[22px] flex h-[72px] w-[90vw] max-w-[1248px] items-center justify-between rounded-[200px] bg-black px-6">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/logo/intellagent logo.svg"
              alt="IntellAgent"
              width={120}
              height={40}
              className="h-auto w-auto"
              priority
            />
          </Link>

          {/* Navigation Links */}
          <nav className="flex items-center gap-8">
            <Link
              href="#about"
              className="text-white transition-colors hover:text-gray-300"
            >
              {t.header.aboutUs}
            </Link>
            <Link
              href="#services"
              className="text-white transition-colors hover:text-gray-300"
            >
              {t.header.services}
            </Link>
            <Link
              href="#use-cases"
              className="text-white transition-colors hover:text-gray-300"
            >
              {t.header.useCases}
            </Link>
            <Link
              href="#process"
              className="text-white transition-colors hover:text-gray-300"
            >
              {t.header.process}
            </Link>
            <Link
              href="#contact"
              className="text-white transition-colors hover:text-gray-300"
            >
              {t.header.contactUs}
            </Link>
          </nav>

          {/* Globe Icon - Language Dropdown */}
          <div className="relative" ref={desktopDropdownRef}>
            <button
              onClick={() => setIsDesktopDropdownOpen(!isDesktopDropdownOpen)}
              className="flex items-center cursor-pointer hover:opacity-80 transition-opacity"
              aria-label="Select language"
              suppressHydrationWarning
            >
              <Image
                src="/icons/globe icon.svg"
                alt="Globe"
                width={24}
                height={24}
                className="h-6 w-6"
              />
              <span className="ml-2 text-white text-sm">
                {locale.toUpperCase()}
              </span>
              <svg
                className={`ml-1 w-4 h-4 text-white transition-transform ${
                  isDesktopDropdownOpen ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {isDesktopDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-black rounded-lg shadow-lg border border-gray-700 overflow-hidden z-50">
                {locales.map((lang) => (
                  <button
                    key={lang}
                    onClick={() => {
                      setLocale(lang);
                      setIsDesktopDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-3 text-sm transition-colors ${
                      locale === lang
                        ? "bg-gray-800 text-white"
                        : "text-gray-300 hover:bg-gray-800 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{languageNames[lang]}</span>
                      <span className="text-xs text-gray-500">
                        {lang.toUpperCase()}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="lg:hidden">
        <div className="fixed top-0 left-0 right-0 flex h-16 items-center justify-between bg-black px-4 z-50">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/logo/intellagent logo.svg"
              alt="IntellAgent"
              width={100}
              height={33}
              className="h-auto w-auto"
              priority
            />
          </Link>

          <div className="flex items-center gap-4">
            {/* Language Dropdown */}
            <div className="relative" ref={mobileDropdownRef}>
              <button
                onClick={() => setIsMobileDropdownOpen(!isMobileDropdownOpen)}
                className="flex items-center cursor-pointer hover:opacity-80 transition-opacity"
                aria-label="Select language"
                suppressHydrationWarning
              >
                <Image
                  src="/icons/globe icon.svg"
                  alt="Globe"
                  width={20}
                  height={20}
                  className="h-5 w-5"
                />
                <span className="ml-1 text-white text-xs">
                  {locale.toUpperCase()}
                </span>
              </button>

              {/* Dropdown Menu */}
              {isMobileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-black rounded-lg shadow-lg border border-gray-700 overflow-hidden z-50">
                  {locales.map((lang) => (
                    <button
                      key={lang}
                      onClick={() => {
                        setLocale(lang);
                        setIsMobileDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                        locale === lang
                          ? "bg-gray-800 text-white"
                          : "text-gray-300 hover:bg-gray-800 hover:text-white"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs">{languageNames[lang]}</span>
                        <span className="text-xs text-gray-500">
                          {lang.toUpperCase()}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <StaggeredMenu
              className="mobile-staggered-menu"
              position="right"
              items={menuItems}
              socialItems={socialItems}
              displaySocials
              displayItemNumbering
              menuButtonColor="#fff"
              openMenuButtonColor="#fff"
              changeMenuColorOnOpen
              colors={["#B19EEF", "#5227FF", "#000000", "#FFB400"]}
              logoUrl="/logo/intellagent logo.svg"
              accentColor="#ff6b6b"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
