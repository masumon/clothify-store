import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Hind_Siliguri, Plus_Jakarta_Sans } from "next/font/google";
import TrafficTracker from "@/components/TrafficTracker";
import SumonixAIWidget from "@/components/SumonixAIWidget";
import PWAInstallPrompt from "@/components/PWAInstallPrompt";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-ui",
  display: "swap",
});

const hindSiliguri = Hind_Siliguri({
  subsets: ["bengali", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-bn",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Clothify | ঈদ কালেকশন ২০২৬ – Premium Fashion Store",
  description:
    "Shop exclusive Eid 2026 fashion collection at Clothify. Premium fabrics, stylish designs, fast bKash payment. Limited stock — order now!",
  keywords: [
    "Eid collection 2026",
    "ঈদ কালেকশন",
    "fashion store Bangladesh",
    "Clothify",
    "premium clothing",
    "bKash payment",
    "panjabi",
    "salwar kameez",
    "Eid fashion",
  ],
  openGraph: {
    title: "Clothify | ঈদ কালেকশন ২০২৬ – Premium Fashion Store",
    description:
      "Shop exclusive Eid 2026 fashion at Clothify. Premium fabrics, fast bKash payment, limited stock.",
    type: "website",
    locale: "en_BD",
    siteName: "Clothify",
  },
  twitter: {
    card: "summary_large_image",
    title: "Clothify | ঈদ কালেকশন ২০২৬",
    description:
      "Shop exclusive Eid fashion at Clothify – Premium fabrics, fast delivery, bKash payment.",
  },
  robots: { index: true, follow: true },
  manifest: "/manifest.webmanifest",
  applicationName: "CLOTHFY",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "CLOTHFY",
  },
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#0F172A",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bn">
      <body
        className={`${plusJakarta.variable} ${hindSiliguri.variable} bg-gray-100 text-slate-900 antialiased`}
      >
        <TrafficTracker />
        <SumonixAIWidget />
        <PWAInstallPrompt />
        {children}
      </body>
    </html>
  );
}
