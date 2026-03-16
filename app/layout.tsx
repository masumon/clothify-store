import "./globals.css";
import type { Metadata } from "next";

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
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bn">
      <body className="bg-gray-100 text-slate-900">{children}</body>
    </html>
  );
}
