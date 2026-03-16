import "./globals.css";

export const metadata = {
  title: "Clothify CMS",
  description: "Find Your Fit - Dynamic E-commerce Store",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-100 text-slate-900">{children}</body>
    </html>
  );
}
