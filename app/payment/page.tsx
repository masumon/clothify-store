export default function PaymentPage() {
  return (
    <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8fafc", padding: "24px" }}>
      <div style={{ maxWidth: "600px", width: "100%", background: "white", border: "1px solid #e2e8f0", borderRadius: "24px", padding: "32px", textAlign: "center", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
        <h1 style={{ fontSize: "32px", fontWeight: 700, color: "#0f172a", marginBottom: "12px" }}>
          Payment Page
        </h1>

        <p style={{ fontSize: "16px", color: "#475569", marginBottom: "24px" }}>
          This payment page route is now active.
        </p>

        <a
          href="/"
          style={{
            display: "inline-block",
            background: "black",
            color: "white",
            textDecoration: "none",
            padding: "12px 24px",
            borderRadius: "9999px",
            fontWeight: 600
          }}
        >
          Back to Home
        </a>
      </div>
    </main>
  );
}
