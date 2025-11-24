import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { I18nProvider } from "./contexts/i18n-context";
import { AuthProvider } from "./contexts/auth-context";
import { AutomationProvider } from "./contexts/automation-context";
import { FloatingAIEntry } from "@/components/floating-ai-entry";
import { ToastProvider } from "./contexts/toast-context";

const dmSans = localFont({
  src: [
    {
      path: "./fonts/dm-sans-font-family-1763780361-0/DMSans-Regular-BF64376d323f095.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/dm-sans-font-family-1763780361-0/DMSans-Medium-BF64376d329a539.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/dm-sans-font-family-1763780361-0/DMSans-Bold-BF64376d32191f2.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-dm-sans",
});

const beatriceDisplay = localFont({
  src: [
    {
      path: "./fonts/beatrice-display-trial-cufonfonts/BeatriceDisplayTRIAL-Thin-BF64829e8c9169f.otf",
      weight: "100",
      style: "normal",
    },
    {
      path: "./fonts/beatrice-display-trial-cufonfonts/BeatriceDisplayTRIAL-Light-BF64829e8d63557.otf",
      weight: "300",
      style: "normal",
    },
    {
      path: "./fonts/beatrice-display-trial-cufonfonts/BeatriceDisplayTRIAL-Regular-BF64829e8d35fac.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/beatrice-display-trial-cufonfonts/BeatriceDisplayTRIAL-Medium-BF64829e8d3123e.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/beatrice-display-trial-cufonfonts/BeatriceDisplayTRIAL-Semibold-BF64829e8cd8b7f.otf",
      weight: "600",
      style: "normal",
    },
    {
      path: "./fonts/beatrice-display-trial-cufonfonts/BeatriceDisplayTRIAL-Bold-BF64829e8d7b173.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "./fonts/beatrice-display-trial-cufonfonts/BeatriceDisplayTRIAL-Extrabold-BF64829e8d3ee44.otf",
      weight: "800",
      style: "normal",
    },
    {
      path: "./fonts/beatrice-display-trial-cufonfonts/BeatriceDisplayTRIAL-Black-BF64829e8dc400a.otf",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-beatrice-display",
});

const spaceGrotesk = localFont({
  src: [
    {
      path: "./fonts/SpaceGrotesk-2.0.0/woff2/static/SpaceGrotesk-Light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "./fonts/SpaceGrotesk-2.0.0/woff2/static/SpaceGrotesk-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/SpaceGrotesk-2.0.0/woff2/static/SpaceGrotesk-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/SpaceGrotesk-2.0.0/woff2/static/SpaceGrotesk-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-space-grotesk",
});

const pixelifySans = localFont({
  src: [
    {
      path: "./fonts/pixelify-sans/Font/ttf/PixelifySans-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/pixelify-sans/Font/ttf/PixelifySans-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/pixelify-sans/Font/ttf/PixelifySans-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "./fonts/pixelify-sans/Font/ttf/PixelifySans-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-pixelify-sans",
});

export const metadata: Metadata = {
  title: "IntellAgent",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${dmSans.variable} ${beatriceDisplay.variable} ${spaceGrotesk.variable} ${pixelifySans.variable}`}
        suppressHydrationWarning
      >
        <I18nProvider>
          <AuthProvider>
            <AutomationProvider>
              <ToastProvider>
                {children}
                <FloatingAIEntry />
              </ToastProvider>
            </AutomationProvider>
          </AuthProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
