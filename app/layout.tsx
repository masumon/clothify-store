import "./globals.css";

export const metadata = {
  title: "Clothify",
  description: "Find Your Fit"
};

export default function RootLayout({
  children,
}:{
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gray-100">

        {children}

      </body>
    </html>
  );
}
