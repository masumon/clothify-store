import "./globals.css";

export const metadata = {
  title: "Clothify",
  description: "Find Your Fit",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <header style={{background:"black",color:"white",padding:"20px",textAlign:"center"}}>
          <h1>Clothify</h1>
          <p>Find Your Fit</p>
        </header>

        {children}

      </body>
    </html>
  );
}
