"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { isChatbotEnabled } from "@/util/api/settings";
import { WhatsAppButton } from "./whatsapp-button";

const FloatingAIWidget = dynamic(
  () => import("./floating-ai-widget").then((mod) => mod.FloatingAIWidget),
  { ssr: false }
);

export function FloatingAIEntry() {
  const [enabled, setEnabled] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkChatbotStatus = async () => {
      try {
        const chatbotEnabled = await isChatbotEnabled();
        setEnabled(chatbotEnabled);
      } catch (error) {
        console.error("Failed to check chatbot status:", error);
        // Default to enabled if check fails
        setEnabled(true);
      } finally {
        setIsLoading(false);
      }
    };

    checkChatbotStatus();
  }, []);

  // Show loading state - don't render anything while checking
  if (isLoading) {
    return null;
  }

  // If chatbot is disabled, show WhatsApp button instead
  if (!enabled) {
    return <WhatsAppButton />;
  }

  // If chatbot is enabled, show AI widget
  return <FloatingAIWidget />;
}
