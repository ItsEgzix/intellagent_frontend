"use client";

import { useI18n } from "../../contexts/i18n-context";
import ContentSection from "../../../components/content-section";

interface ServicesSectionProps {
  children?: React.ReactNode;
}

export default function ServicesSection({ children }: ServicesSectionProps) {
  const { t } = useI18n();
  return (
    <ContentSection
      id="services"
      heading={
        <>
          {t.services.heading}{" "}
          <span style={{ fontFamily: "var(--font-pixelify-sans)" }}>
            {t.services.headingSmart}
          </span>{" "}
          {t.services.headingSystems}
        </>
      }
      description={t.services.description} // Keeping description as prop but it might not be rendered in this variant if we chose to hide it, or we can update ContentSection to render it if needed.
      items={t.services.services.map((service, index) => ({
        ...service,
        // Map abstract geometric assets to services
        icon: "/elements/grid_logo.svg",
        // Map specific images
        image: [
          "/services/1592.jpg", // Custom AI Agents
          "/services/2062.jpg",     // Agentic Systems
          "/services/broccoli-silhouette-isolated-black.jpg", // Automation
          "/services/1527.jpg",     // Web Automation
          "/services/scientist-scrutinizes.jpg" // Research
        ][index]
      }))}
      logo={{
        src: "/elements/grid_logo.svg",
        alt: "Grid Logo",
        width: 468,
        height: 384,
      }}
      variant="centered-light"
    />
  );
}
