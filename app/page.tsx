"use client";

import Header from "./sections/header/header";
import HeroSection from "./sections/hero/hero-section";
import ServicesSection from "./sections/services/services-section";
import IPhoneSection from "./sections/iphone/iphone-section";
import UseCasesSection from "./sections/use-cases/use-cases-section";
import WorkingProcessSection from "./sections/working-process/working-process-section";
import TextLoopSection from "./sections/text-loop/text-loop-section";
import ContactLoopSection from "./sections/contact-loop/contact-loop-section";
import FAQSection from "./sections/faq/faq-section";
import Footer from "./sections/footer/footer";

export default function Home() {
  return (
    <div>
      <Header />
      <HeroSection />

      {/* Services Section */}
      <ServicesSection/>

      {/* Custom Section */}
      <IPhoneSection />

      {/* Use Cases Section */}
      <UseCasesSection />

      {/* Text Loop Section */}
      <TextLoopSection />

      {/* Working Process Section */}
      <WorkingProcessSection />

      {/* Contact Loop Section */}
      <ContactLoopSection />

      {/* FAQ Section */}
      <FAQSection />

      {/* Footer */}
      <Footer />
    </div>
  );
}
