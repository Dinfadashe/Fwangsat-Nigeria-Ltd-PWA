import type { Metadata } from "next";
import "@fontsource/space-grotesk/400.css";
import "@fontsource/space-grotesk/500.css";
import "@fontsource/space-grotesk/600.css";
import "@fontsource/space-grotesk/700.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "@fontsource/jetbrains-mono/400.css";
import "@fontsource/jetbrains-mono/500.css";
import "./globals.css";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: `${SITE.name} — Real Estate & Swan Water`,
  description: SITE.tagline,
  icons: { icon: "/logo-icon.png" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      style={
        {
          "--font-space-grotesk": "'Space Grotesk', sans-serif",
          "--font-inter": "'Inter', sans-serif",
          "--font-jetbrains": "'JetBrains Mono', monospace",
        } as React.CSSProperties
      }
    >
      <body>{children}</body>
    </html>
  );
}