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
      description={t.services.description}
      items={t.services.services}
      logo={{
        src: "/elements/grid_logo.svg",
        alt: "Grid Logo",
        width: 468,
        height: 384,
      }}
    >
      {children}
    </ContentSection>
  );
}
