import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Hind_Siliguri, Outfit, Plus_Jakarta_Sans } from "next/font/google";
import { cookies } from "next/headers";
import TrafficTracker from "@/components/TrafficTracker";
import SumonixAIWidget from "@/components/SumonixAIWidget";
import PWAInstallPrompt from "@/components/PWAInstallPrompt";
import PreferenceSync from "@/components/PreferenceSync";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import CartToast from "@/components/CartToast";
import SentryInit from "@/components/SentryInit";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-ui",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-abo",
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
  applicationName: "CLOTHIFY",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "CLOTHIFY",
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

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const initialLang = cookieStore.get("clothfy-lang")?.value === "en" ? "en" : "bn";

  return (
    <html lang={initialLang} suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var d=document.documentElement;var rawLang=localStorage.getItem("clothfy-lang")||localStorage.getItem("clothify-language")||d.lang||"bn";var lang=rawLang==="en"?"en":"bn";localStorage.setItem("clothfy-lang",lang);localStorage.setItem("clothify-language",lang);document.cookie="clothfy-lang="+lang+"; path=/; max-age=31536000; samesite=lax";d.lang=lang;var rawTheme=localStorage.getItem("clothfy-theme")||localStorage.getItem("clothify-theme")||"system";var theme=(rawTheme==="light"||rawTheme==="dark"||rawTheme==="system")?rawTheme:"system";var dark=theme==="dark"||(theme==="system"&&window.matchMedia("(prefers-color-scheme: dark)").matches);localStorage.setItem("clothfy-theme",theme);localStorage.setItem("clothify-theme",theme);document.cookie="clothfy-theme="+theme+"; path=/; max-age=31536000; samesite=lax";var uiMode=(localStorage.getItem("clothfy-ui-mode")==="abo")?"abo":"default";localStorage.setItem("clothfy-ui-mode",uiMode);document.cookie="clothfy-ui-mode="+uiMode+"; path=/; max-age=31536000; samesite=lax";d.setAttribute("data-theme",theme);d.classList.toggle("dark-theme",dark);d.classList.toggle("dark",dark);d.classList.toggle("abo-premium",uiMode==="abo");d.classList.toggle("text-size-large",localStorage.getItem("clothify-text-size")==="large");d.classList.toggle("high-contrast",localStorage.getItem("clothify-contrast")==="high");d.classList.toggle("reduce-motion",localStorage.getItem("clothify-motion")==="reduced");}catch(e){}})();`,
          }}
        />
      </head>
      <body
        className={`${plusJakarta.variable} ${outfit.variable} ${hindSiliguri.variable} overflow-x-hidden antialiased`}
      >
        <PreferenceSync />
        <SentryInit />
        <TrafficTracker />
        <CartToast />
        <SumonixAIWidget />
        <PWAInstallPrompt />
        <FloatingWhatsApp />
        {children}
      </body>
    </html>
  );
}
