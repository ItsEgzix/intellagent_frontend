"use client";

import { useI18n } from "../../contexts/i18n-context";
import ContentSection from "../../../components/content-section";

export default function WorkingProcessSection() {
  const { t } = useI18n();
  return (
    <ContentSection
      id="process"
      heading={t.workingProcess.heading}
      description={t.workingProcess.description}
      items={t.workingProcess.steps}
      logo={{
        src: "/elements/process_logo.svg",
        alt: "Process Logo",
        width: 468,
        height: 384,
      }}
      highlightImage={{
        src: "/elements/process_highlight.svg",
        alt: "Highlight",
      }}
      highlightText={t.workingProcess.headingProcess}
    />
  );
}
