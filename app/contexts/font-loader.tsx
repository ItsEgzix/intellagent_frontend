"use client";

import { useEffect } from "react";

export default function FontLoader() {
  useEffect(() => {
    // Check if link already exists
    const existingLink = document.querySelector(
      'link[href*="fonts.googleapis.com/css2?family=DM+Sans"]'
    );
    if (existingLink) return;

    const link = document.createElement("link");
    link.href =
      "https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);

  return null;
}
