"use client";

import dynamic from "next/dynamic";

const FloatingAIWidget = dynamic(
  () => import("./floating-ai-widget").then((mod) => mod.FloatingAIWidget),
  { ssr: false }
);

export function FloatingAIEntry() {
  return <FloatingAIWidget />;
}
