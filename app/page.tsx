"use client";

import HeroSection from "./sections/hero/hero-section";
import Image from "next/image";
import { useI18n } from "./contexts/i18n-context";
import { motion } from "framer-motion";
import ContactLoopSection from "./sections/contact-loop/contact-loop-section";
import FAQSection from "./sections/faq/faq-section";
import WorkingProcessSection from "./sections/working-process/working-process-section";
import UseCasesSection from "./sections/use-cases/use-cases-section";
import TextLoopSection from "./sections/text-loop/text-loop-section";
import ServicesSection from "./sections/services/services-section";
import AboutUs from "./sections/about-us/about-us";

export default function Home() {
  const { t } = useI18n();

  return (
    <div className="bg-white selection:bg-black selection:text-white overflow-hidden">
      <HeroSection />
      



      {/* Sections moved to dedicated pages */}
      <ServicesSection/>
      <UseCasesSection />
      <TextLoopSection />
      <WorkingProcessSection />
      <ContactLoopSection />
      <FAQSection />
     
    </div>
  );
}
