import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Space_Grotesk } from "next/font/google";
import "./globals.css";
import CookieConsent from "@/components/CookieConsent";

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta" });
const space = Space_Grotesk({ subsets: ["latin"], variable: "--font-space" });

export const metadata: Metadata = {
  title: "Rush Technomedia | Premier SEO, Web Development & Digital Media in Africa",
  description: "Founded by Aliyu Abdulkareem, Rush Technomedia combines strategic SEO consulting, modern web development, and digital media publishing to scale African businesses globally.",
  keywords: "SEO consultant Nigeria, web development Lagos, digital media publishing Africa, Rush Technomedia, Aliyu Abdulkareem",
  robots: "index, follow",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className={`${jakarta.variable} ${space.variable} bg-background text-on-surface antialiased font-sans selection:bg-primary-container selection:text-white`}>
        {children}
        <CookieConsent />
      </body>
    </html>
  );
}
