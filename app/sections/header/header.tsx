"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useI18n } from "../../contexts/i18n-context";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
  const { t } = useI18n();
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  // Navigation Items according to en.json
  const navItems = [
    { label: t.header.aboutUs, href: "/#about" },
    { label: t.header.services, href: "/#services" },
    { label: t.header.useCases, href: "/#use-cases" },
  ];

  // Handle Scroll Effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
        isScrolled 
          ? "bg-white/90 backdrop-blur-md border-black py-4" 
          : "bg-transparent border-transparent py-6"
      }`}
    >
      <div className="container mx-auto px-6 max-w-7xl flex items-center justify-between">
        
        {/* Logo / System ID */}
        <Link href="/" className="group flex flex-col">
          <div className="flex items-center gap-2">
            <Image 
              src="/logo/intellagent_logo_png.png" 
              alt="IntellAgent Logo" 
              width={180} 
              height={40} 
              className="h-8 w-auto object-contain"
              priority
            />
            <span className="px-1.5 py-0.5 rounded border border-black text-[10px] font-mono font-medium hover:bg-black hover:text-white transition-colors">
              OS
            </span>
          </div>
        </Link>

        {/* Desktop Navigation - System Links */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link 
              key={item.href} 
              href={item.href}
              className="relative text-sm font-medium tracking-wide text-gray-600 hover:text-black transition-colors"
              style={{ fontFamily: "var(--font-dm-sans)" }}
            >
              <span className="relative z-10">{item.label}</span>
              {/* Hover Underline Animation */}
              <span className="absolute left-0 bottom-[-4px] w-0 h-[1px] bg-black transition-all duration-300 group-hover:w-full"></span>
            </Link>
          ))}
        </nav>

        {/* CTA / Status */}
        <div className="hidden md:flex items-center gap-6">
           {/* Decorative Status */}
           <div className="flex items-center gap-2 text-[10px] font-mono text-gray-400">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
              SYSTEM READY
           </div>

           <a
             href="#contact"
             className="px-5 py-2.5 bg-black text-white text-xs font-mono uppercase tracking-widest hover:bg-[#FFD700] hover:text-black transition-all duration-300"
           >
             Initialize
           </a>
        </div>

        {/* Mobile Menu Button (Hamburger) */}
        <button className="md:hidden flex flex-col gap-1.5 p-2">
           <div className="w-6 h-[2px] bg-black"></div>
           <div className="w-6 h-[2px] bg-black"></div>
           <div className="w-4 h-[2px] bg-black ml-auto"></div>
        </button>

      </div>
    </header>
  );
}
