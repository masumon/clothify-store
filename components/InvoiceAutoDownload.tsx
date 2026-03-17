"use client";

import { useEffect, useRef, useState } from "react";

type InvoiceItem = {
  name: string;
  selectedSize: string;
  quantity: number;
  price: number;
};

type InvoicePayload = {
  orderId: string;
  customerName: string;
  phone: string;
  address: string;
  deliveryMethod: string;
  courierName: string;
  paymentMethod: string;
  trxId: string;
  total: number;
  items: InvoiceItem[];
  createdAt: string;
};

type Props = {
  storeName: string;
  logoUrl?: string;
  storeAddress?: string;
  storePhone?: string;
};

const STORAGE_KEY = "clothify-latest-invoice";

async function fetchImageAsDataUrl(url: string): Promise<string> {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(String(reader.result || ""));
      reader.onerror = () => reject(new Error("Failed to read image"));
      reader.readAsDataURL(blob);
    });
  } catch {
    return "";
  }
}

function buildInvoiceHTML(
  invoice: InvoicePayload,
  storeName: string,
  logoUrl: string,
  storeAddress: string,
  storePhone: string,
  logoDataUrl: string
): string {
  const orderDate = new Date(invoice.createdAt).toLocaleString("bn-BD", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const itemRows = invoice.items
    .map(
      (item, idx) => `
      <tr class="${idx % 2 === 0 ? "row-even" : "row-odd"}">
        <td class="td-name">${item.name}</td>
        <td class="td-center">${item.selectedSize}</td>
        <td class="td-center">${item.quantity}</td>
        <td class="td-right">৳${item.price.toLocaleString("bn-BD")}</td>
        <td class="td-right total-cell">৳${(item.price * item.quantity).toLocaleString("bn-BD")}</td>
      </tr>`
    )
    .join("");

  const logoHtml = logoDataUrl
    ? `<img src="${logoDataUrl}" alt="${storeName} logo" class="logo-img" />`
    : `<div class="logo-placeholder">${storeName.charAt(0).toUpperCase()}</div>`;

  const paymentRef =
    invoice.paymentMethod === "Cash on Delivery"
      ? "ক্যাশ অন ডেলিভারি"
      : invoice.trxId || "N/A";

  return `<!DOCTYPE html>
<html lang="bn">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>ইনভয়েস — ${invoice.orderId}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="" />
  <link href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&family=Noto+Sans+Bengali:wght@400;500;600;700&display=swap" rel="stylesheet" />
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Hind Siliguri', 'Noto Sans Bengali', 'Noto Sans', Arial, sans-serif; background: #f8fafc; color: #1e293b; font-size: 14px; line-height: 1.6; }
    .page { width: 210mm; min-height: 297mm; margin: 0 auto; background: #ffffff; box-shadow: 0 0 40px rgba(0,0,0,0.08); position: relative; overflow: hidden; }
    .blob-tl { position: absolute; top: -60px; left: -60px; width: 240px; height: 240px; background: radial-gradient(circle, rgba(20,184,166,0.12) 0%, transparent 70%); border-radius: 50%; }
    .blob-br { position: absolute; bottom: -80px; right: -80px; width: 280px; height: 280px; background: radial-gradient(circle, rgba(16,185,129,0.10) 0%, transparent 70%); border-radius: 50%; }
    .header { background: linear-gradient(135deg, #0f766e 0%, #0d9488 50%, #14b8a6 100%); padding: 24px 32px 20px; display: flex; align-items: center; justify-content: space-between; position: relative; z-index: 1; }
    .header-left { display: flex; align-items: center; gap: 14px; }
    .logo-img { width: 52px; height: 52px; border-radius: 12px; border: 2px solid rgba(255,255,255,0.3); object-fit: cover; background: #fff; }
    .logo-placeholder { width: 52px; height: 52px; border-radius: 12px; border: 2px solid rgba(255,255,255,0.3); background: rgba(255,255,255,0.15); display: flex; align-items: center; justify-content: center; font-size: 24px; font-weight: 700; color: #fff; }
    .store-name { font-size: 22px; font-weight: 700; color: #ffffff; letter-spacing: -0.3px; }
    .store-sub { font-size: 11px; color: rgba(255,255,255,0.80); margin-top: 2px; font-weight: 500; }
    .header-right { text-align: right; }
    .invoice-label { font-size: 11px; font-weight: 600; color: rgba(255,255,255,0.75); text-transform: uppercase; letter-spacing: 0.12em; }
    .invoice-id { font-size: 15px; font-weight: 700; color: #ffffff; margin-top: 2px; }
    .invoice-date { font-size: 11px; color: rgba(255,255,255,0.75); margin-top: 3px; }
    .body { padding: 28px 32px; position: relative; z-index: 1; }
    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px; }
    .info-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 14px 16px; }
    .info-box-title { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.15em; color: #64748b; margin-bottom: 8px; }
    .info-row { display: flex; gap: 6px; font-size: 12px; color: #334155; margin-bottom: 4px; align-items: flex-start; }
    .info-label { font-weight: 600; color: #475569; min-width: 80px; flex-shrink: 0; }
    .info-value { color: #1e293b; }
    .section-title { font-size: 13px; font-weight: 700; color: #0f766e; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 10px; padding-bottom: 6px; border-bottom: 2px solid #0f766e; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
    thead tr { background: linear-gradient(135deg, #0f766e, #0d9488); }
    thead th { color: #ffffff; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; padding: 10px 12px; text-align: left; }
    thead th:not(:first-child) { text-align: center; }
    thead th:last-child { text-align: right; }
    .td-name { padding: 9px 12px; font-size: 12.5px; font-weight: 500; }
    .td-center { padding: 9px 12px; text-align: center; font-size: 12px; }
    .td-right { padding: 9px 12px; text-align: right; font-size: 12px; }
    .total-cell { font-weight: 600; color: #0f766e; }
    .row-even { background: #f8fafc; }
    .row-odd { background: #ffffff; }
    tbody tr { border-bottom: 1px solid #f1f5f9; }
    .total-section { display: flex; justify-content: flex-end; margin-bottom: 24px; }
    .total-box { background: linear-gradient(135deg, #0f766e, #0d9488); border-radius: 14px; padding: 16px 24px; min-width: 200px; text-align: right; }
    .total-label { font-size: 11px; color: rgba(255,255,255,0.80); font-weight: 600; }
    .total-amount { font-size: 26px; font-weight: 700; color: #ffffff; margin-top: 4px; }
    .footer-note { background: linear-gradient(135deg, #f0fdf4, #ecfdf5); border: 1px solid #bbf7d0; border-radius: 12px; padding: 14px 18px; text-align: center; margin-bottom: 16px; }
    .footer-note p { font-size: 12px; color: #166534; font-weight: 600; }
    .footer-note small { font-size: 10px; color: #4ade80; margin-top: 4px; display: block; }
    .footer-bar { background: #f8fafc; border-top: 1px solid #e2e8f0; padding: 12px 32px; display: flex; justify-content: space-between; align-items: center; }
    .footer-bar span { font-size: 10px; color: #94a3b8; }
    @media print { @page { size: A4; margin: 0; } body { background: #fff !important; } .page { box-shadow: none !important; } }
  </style>
</head>
<body>
  <div class="page">
    <div class="blob-tl"></div>
    <div class="blob-br"></div>
    <div class="header">
      <div class="header-left">
        ${logoHtml}
        <div>
          <div class="store-name">${storeName}</div>
          <div class="store-sub">অর্ডার ইনভয়েস</div>
        </div>
      </div>
      <div class="header-right">
        <div class="invoice-label">ইনভয়েস নম্বর</div>
        <div class="invoice-id">#${invoice.orderId}</div>
        <div class="invoice-date">${orderDate}</div>
      </div>
    </div>
    <div class="body">
      <div class="info-grid">
        <div class="info-box">
          <div class="info-box-title">ক্রেতার তথ্য</div>
          <div class="info-row"><span class="info-label">নাম:</span><span class="info-value">${invoice.customerName}</span></div>
          <div class="info-row"><span class="info-label">ফোন:</span><span class="info-value">${invoice.phone}</span></div>
          <div class="info-row"><span class="info-label">ঠিকানা:</span><span class="info-value">${invoice.address}</span></div>
        </div>
        <div class="info-box">
          <div class="info-box-title">ডেলিভারি ও পেমেন্ট</div>
          <div class="info-row"><span class="info-label">ডেলিভারি:</span><span class="info-value">${invoice.deliveryMethod}</span></div>
          <div class="info-row"><span class="info-label">কুরিয়ার:</span><span class="info-value">${invoice.courierName || "N/A"}</span></div>
          <div class="info-row"><span class="info-label">পেমেন্ট:</span><span class="info-value">${invoice.paymentMethod}</span></div>
          <div class="info-row"><span class="info-label">রেফারেন্স:</span><span class="info-value">${paymentRef}</span></div>
          ${storePhone ? '<div class="info-row"><span class="info-label">স্টোর ফোন:</span><span class="info-value">' + storePhone + '</div>' : ""}
          ${storeAddress ? '<div class="info-row"><span class="info-label">স্টোর ঠিকানা:</span><span class="info-value">' + storeAddress + '</div>' : ""}
        </div>
      </div>
      <div class="section-title">অর্ডার আইটেম</div>
      <table>
        <thead>
          <tr>
            <th>পণ্যের নাম</th>
            <th>সাইজ</th>
            <th>পরিমাণ</th>
            <th>একক মূল্য</th>
            <th>মোট</th>
          </tr>
        </thead>
        <tbody>${itemRows}</tbody>
      </table>
      <div class="total-section">
        <div class="total-box">
          <div class="total-label">সর্বমোট পরিমাণ</div>
          <div class="total-amount">৳${invoice.total.toLocaleString("bn-BD")}</div>
        </div>
      </div>
      <div class="footer-note">
        <p>🙏 ${storeName}-এ কেনাকাটার জন্য আন্তরিক ধন্যবাদ!</p>
        <small>SUMONIX AI কমার্স অটোমেশন দ্বারা পরিচালিত</small>
      </div>
    </div>
    <div class="footer-bar">
      <span>${storeName} — অর্ডার ইনভয়েস</span>
      <span>Invoice #${invoice.orderId}</span>
    </div>
  </div>
  <script>
    if (document.fonts && document.fonts.ready) {
      // Wait 400 ms after fonts load — gives the layout engine time to reflow with Bengali glyphs
      document.fonts.ready.then(function() { setTimeout(function() { window.print(); }, 400); });
    } else {
      // Fallback: browsers without document.fonts — wait 1800 ms for Google Fonts to download
      setTimeout(function() { window.print(); }, 1800);
    }
  </script>
</body>
</html>`;
}

export default function InvoiceAutoDownload({
  storeName,
  logoUrl,
  storeAddress,
  storePhone,
}: Props) {
  const [invoice, setInvoice] = useState<InvoicePayload | null>(null);
  const [status, setStatus] = useState("ইনভয়েস প্রস্তুত হচ্ছে…");
  const [printed, setPrinted] = useState(false);
  const popupRef = useRef<Window | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) {
      setStatus("ইনভয়েস ডেটা পাওয়া যায়নি। নতুন অর্ডার করুন।");
      return;
    }
    try {
      setInvoice(JSON.parse(raw) as InvoicePayload);
    } catch {
      setStatus("ইনভয়েস ডেটা ত্রুটিপূর্ণ।");
    }
  }, []);

  useEffect(() => {
    if (!invoice || printed) return;

    let cancelled = false;

    const run = async () => {
      try {
        setStatus("ইনভয়েস তৈরি হচ্ছে…");

        const logoDataUrl = logoUrl ? await fetchImageAsDataUrl(logoUrl) : "";

        if (cancelled) return;

        const html = buildInvoiceHTML(
          invoice,
          storeName,
          logoUrl || "",
          storeAddress || "",
          storePhone || "",
          logoDataUrl
        );

        const popup = window.open("", "_blank", "width=900,height=1100,scrollbars=yes");
        if (popup) {
          popupRef.current = popup;
          popup.document.open();
          popup.document.write(html);
          popup.document.close();
          setPrinted(true);
          sessionStorage.removeItem(STORAGE_KEY);
          setStatus("ইনভয়েস উইন্ডো খুলেছে — প্রিন্ট বা PDF হিসেবে সেভ করুন।");
        } else {
          setStatus("পপআপ ব্লক হয়েছে। নিচের বাটনে ক্লিক করে ইনভয়েস দেখুন।");
        }
      } catch {
        if (!cancelled) {
          setStatus("ইনভয়েস তৈরি করতে সমস্যা হয়েছে।");
        }
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [invoice, logoUrl, storeAddress, storeName, storePhone, printed]);

  const handleManualPrint = async () => {
    if (!invoice) return;
    setStatus("ইনভয়েস তৈরি হচ্ছে…");
    const logoDataUrl = logoUrl ? await fetchImageAsDataUrl(logoUrl) : "";
    const html = buildInvoiceHTML(
      invoice,
      storeName,
      logoUrl || "",
      storeAddress || "",
      storePhone || "",
      logoDataUrl
    );
    const popup = window.open("", "_blank", "width=900,height=1100,scrollbars=yes");
    if (popup) {
      popup.document.open();
      popup.document.write(html);
      popup.document.close();
      sessionStorage.removeItem(STORAGE_KEY);
      setStatus("ইনভয়েস উইন্ডো খুলেছে।");
    }
  };

  return (
    <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4 text-center">
      <p className="text-sm text-slate-600">{status}</p>
      {invoice && (
        <button
          type="button"
          onClick={handleManualPrint}
          className="mt-3 inline-flex items-center gap-2 rounded-full bg-teal-700 px-5 py-2 text-sm font-semibold text-white transition hover:bg-teal-800"
        >
          🖨️ ইনভয়েস প্রিন্ট / PDF সেভ করুন
        </button>
      )}
    </div>
  );
}
