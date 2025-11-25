"use client";

import Image from "next/image";
import Link from "next/link";
import { useI18n } from "../../contexts/i18n-context";
import { useState, useRef, useEffect, useMemo } from "react";
import StaggeredMenu from "@/components/StaggeredMenu";
import { Locale, fetchLanguageOptions, type LanguageOption } from "@/lib/i18n";
import { socialItems } from "@/data/social-media";
import { PdfViewerModal } from "@/components/ui/pdf-viewer-modal";
import { BookOpen } from "lucide-react";

export default function Header() {
  const { t, locale, setLocale } = useI18n();
  const [isDesktopDropdownOpen, setIsDesktopDropdownOpen] = useState(false);
  const [isMobileDropdownOpen, setIsMobileDropdownOpen] = useState(false);
  const [isRefreshingLanguages, setIsRefreshingLanguages] = useState(false);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const desktopDropdownRef = useRef<HTMLDivElement>(null);
  const mobileDropdownRef = useRef<HTMLDivElement>(null);
  // Start with only English, will be updated from database
  const [languageOptions, setLanguageOptions] = useState<LanguageOption[]>([
    {
      code: "en",
      nativeName: "English",
      englishName: "English",
    },
  ]);

  const handleRefreshLanguages = async () => {
    setIsRefreshingLanguages(true);
    try {
      const options = await fetchLanguageOptions(true);
      console.log("Languages refreshed from API:", options);
      setLanguageOptions(options);
    } catch (error) {
      console.error("Failed to refresh languages:", error);
    } finally {
      setIsRefreshingLanguages(false);
    }
  };

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

  // Fetch languages from API when dropdown is opened
  // Preload languages on mount so they're ready when dropdown opens
  useEffect(() => {
    fetchLanguageOptions(true)
      .then((options) => {
        console.log("Languages preloaded from API:", options);
        setLanguageOptions(options);
      })
      .catch((error) => {
        console.error("Failed to preload languages:", error);
      });
  }, []);

  const handleDropdownToggle = (isOpen: boolean, isDesktop: boolean) => {
    // Languages are already preloaded, just toggle the dropdown
    if (isDesktop) {
      setIsDesktopDropdownOpen(isOpen);
    } else {
      setIsMobileDropdownOpen(isOpen);
    }
  };

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

          {/* Booklet Button */}
          <button
            onClick={() => setIsPdfModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Open booklet"
          >
            <BookOpen className="h-5 w-5" />
            <span className="text-sm hidden sm:inline">Booklet</span>
          </button>

          {/* Globe Icon - Language Dropdown */}
          <div className="relative" ref={desktopDropdownRef}>
            <button
              onClick={() => handleDropdownToggle(!isDesktopDropdownOpen, true)}
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
                loading="lazy"
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
                {/* Refresh Button */}
                <button
                  onClick={handleRefreshLanguages}
                  disabled={isRefreshingLanguages}
                  className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors border-b border-gray-700 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg
                    className={`w-4 h-4 ${
                      isRefreshingLanguages ? "animate-spin" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  <span>
                    {isRefreshingLanguages
                      ? "Refreshing..."
                      : "Refresh Languages"}
                  </span>
                </button>
                {languageOptions.map((language) => (
                  <button
                    key={language.code}
                    onClick={() => {
                      setLocale(language.code as Locale);
                      setIsDesktopDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-3 text-sm transition-colors ${
                      locale === language.code
                        ? "bg-gray-800 text-white"
                        : "text-gray-300 hover:bg-gray-800 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{language.nativeName}</span>
                      <span className="text-xs text-gray-500">
                        {language.code.toUpperCase()}
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
            {/* Booklet Button */}
            <button
              onClick={() => setIsPdfModalOpen(true)}
              className="flex items-center justify-center p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              aria-label="Open booklet"
            >
              <BookOpen className="h-5 w-5" />
            </button>

            {/* Language Dropdown */}
            <div className="relative" ref={mobileDropdownRef}>
              <button
                onClick={() =>
                  handleDropdownToggle(!isMobileDropdownOpen, false)
                }
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
                  {/* Refresh Button */}
                  <button
                    onClick={handleRefreshLanguages}
                    disabled={isRefreshingLanguages}
                    className="w-full text-left px-3 py-2 text-xs text-gray-300 hover:bg-gray-800 hover:text-white transition-colors border-b border-gray-700 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg
                      className={`w-3 h-3 ${
                        isRefreshingLanguages ? "animate-spin" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                    <span>
                      {isRefreshingLanguages ? "Refreshing..." : "Refresh"}
                    </span>
                  </button>
                  {languageOptions.map((language) => (
                    <button
                      key={language.code}
                      onClick={() => {
                        setLocale(language.code as Locale);
                        setIsMobileDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                        locale === language.code
                          ? "bg-gray-800 text-white"
                          : "text-gray-300 hover:bg-gray-800 hover:text-white"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs">{language.nativeName}</span>
                        <span className="text-xs text-gray-500">
                          {language.code.toUpperCase()}
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

      {/* PDF Viewer Modal */}
      <PdfViewerModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
        pdfUrl="/booklet/IntellAgent booklet.pdf"
        title="IntellAgent Booklet"
        downloadFileName="IntellAgent-booklet.pdf"
      />
    </header>
  );
}
