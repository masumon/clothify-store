"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createRoot, type Root } from "react-dom/client";

type InvoiceItem = {
  name: string;
  selectedSize: string;
  quantity: number;
  price: number;
};

type InvoicePayload = {
  orderId: string;
  invoiceNumber?: string;
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
const PRINT_DELAY_MS = 500;

const INVOICE_WINDOW_STYLES = `
  *, *::before, *::after { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; }
  body {
    background: #f8fafc;
    color: #1e293b;
    font-family: "Hind Siliguri", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    font-size: 14px;
    line-height: 1.6;
  }
  .invoice-page {
    width: 210mm;
    min-height: 297mm;
    margin: 0 auto;
    background: #ffffff;
    box-shadow: 0 0 40px rgba(0, 0, 0, 0.08);
    position: relative;
    overflow: hidden;
  }
  .invoice-blob-tl {
    position: absolute;
    top: -60px;
    left: -60px;
    width: 240px;
    height: 240px;
    background: radial-gradient(circle, rgba(20, 184, 166, 0.12) 0%, transparent 70%);
    border-radius: 9999px;
  }
  .invoice-blob-br {
    position: absolute;
    right: -80px;
    bottom: -80px;
    width: 280px;
    height: 280px;
    background: radial-gradient(circle, rgba(16, 185, 129, 0.10) 0%, transparent 70%);
    border-radius: 9999px;
  }
  .invoice-header {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding: 24px 32px 20px;
    background: linear-gradient(135deg, #0f766e 0%, #0d9488 50%, #14b8a6 100%);
  }
  .invoice-header-left {
    display: flex;
    align-items: center;
    gap: 14px;
  }
  .invoice-logo,
  .invoice-logo-placeholder {
    width: 52px;
    height: 52px;
    border-radius: 12px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    background: #ffffff;
    object-fit: cover;
  }
  .invoice-logo-placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.15);
    color: #ffffff;
    font-size: 24px;
    font-weight: 700;
  }
  .invoice-store-name {
    font-size: 22px;
    font-weight: 700;
    color: #ffffff;
    letter-spacing: -0.3px;
  }
  .invoice-store-sub {
    margin-top: 2px;
    font-size: 11px;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.8);
  }
  .invoice-header-right {
    text-align: right;
  }
  .invoice-label {
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: rgba(255, 255, 255, 0.75);
  }
  .invoice-id {
    margin-top: 2px;
    font-size: 15px;
    font-weight: 700;
    color: #ffffff;
  }
  .invoice-date,
  .invoice-order-ref {
    margin-top: 3px;
    font-size: 11px;
    color: rgba(255, 255, 255, 0.75);
  }
  .invoice-order-ref {
    font-size: 10px;
    margin-top: 2px;
  }
  .invoice-body {
    position: relative;
    z-index: 1;
    padding: 28px 32px;
  }
  .invoice-meta-strip {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 10px;
    margin-bottom: 16px;
  }
  .invoice-meta-pill {
    border: 1px solid #99f6e4;
    border-radius: 10px;
    padding: 8px 10px;
    background: #f0fdfa;
  }
  .invoice-meta-key {
    display: block;
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #0f766e;
  }
  .invoice-meta-value {
    display: block;
    margin-top: 2px;
    font-size: 12px;
    font-weight: 700;
    color: #134e4a;
  }
  .invoice-info-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    margin-bottom: 24px;
  }
  .invoice-info-box {
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    padding: 14px 16px;
    background: #f8fafc;
  }
  .invoice-info-title {
    margin-bottom: 8px;
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.15em;
    color: #64748b;
  }
  .invoice-info-row {
    display: flex;
    gap: 6px;
    align-items: flex-start;
    margin-bottom: 4px;
    font-size: 12px;
    color: #334155;
  }
  .invoice-info-label {
    min-width: 80px;
    flex-shrink: 0;
    font-weight: 600;
    color: #475569;
  }
  .invoice-info-value {
    color: #1e293b;
  }
  .invoice-section-title {
    margin-bottom: 10px;
    padding-bottom: 6px;
    border-bottom: 2px solid #0f766e;
    font-size: 13px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #0f766e;
  }
  .invoice-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 20px;
  }
  .invoice-table thead tr {
    background: linear-gradient(135deg, #0f766e, #0d9488);
  }
  .invoice-table th {
    padding: 10px 12px;
    font-size: 11px;
    font-weight: 600;
    text-align: left;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #ffffff;
  }
  .invoice-table th:not(:first-child) {
    text-align: center;
  }
  .invoice-table th:last-child,
  .invoice-table td:last-child {
    text-align: right;
  }
  .invoice-table td {
    padding: 9px 12px;
    font-size: 12px;
    color: #1e293b;
  }
  .invoice-table tbody tr {
    border-bottom: 1px solid #f1f5f9;
  }
  .invoice-table tbody tr:nth-child(odd) {
    background: #f8fafc;
  }
  .invoice-name-cell {
    font-weight: 500;
    font-size: 12.5px;
  }
  .invoice-table td:not(:first-child) {
    text-align: center;
  }
  .invoice-line-total {
    font-weight: 600;
    color: #0f766e;
  }
  .invoice-total-section {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 24px;
  }
  .invoice-total-box {
    min-width: 200px;
    border-radius: 14px;
    padding: 16px 24px;
    text-align: right;
    background: linear-gradient(135deg, #0f766e, #0d9488);
  }
  .invoice-total-label {
    font-size: 11px;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.8);
  }
  .invoice-total-amount {
    margin-top: 4px;
    font-size: 26px;
    font-weight: 700;
    color: #ffffff;
  }
  .invoice-note {
    margin-bottom: 16px;
    border: 1px solid #bbf7d0;
    border-radius: 12px;
    padding: 14px 18px;
    text-align: center;
    background: linear-gradient(135deg, #f0fdf4, #ecfdf5);
  }
  .invoice-note-title {
    font-size: 12px;
    font-weight: 600;
    color: #166534;
  }
  .invoice-note-sub {
    margin-top: 4px;
    font-size: 10px;
    color: #16a34a;
  }
  .invoice-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
    padding: 12px 32px;
    border-top: 1px solid #e2e8f0;
    background: #f8fafc;
  }
  .invoice-footer span {
    font-size: 10px;
    color: #94a3b8;
  }
  @media (max-width: 760px) {
    .invoice-meta-strip,
    .invoice-info-grid {
      grid-template-columns: 1fr;
    }
  }
  @media print {
    @page { size: A4; margin: 0; }
    body { background: #ffffff !important; }
    .invoice-page { box-shadow: none !important; }
  }
`;

function hashToSerial(value: string, max = 9999) {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) % max;
  }
  return String(Math.max(1, hash)).padStart(4, "0");
}

function resolveInvoiceNumber(invoice: InvoicePayload) {
  if (invoice.invoiceNumber && invoice.invoiceNumber.trim()) {
    return invoice.invoiceNumber.trim();
  }

  const date = new Date(invoice.createdAt || Date.now());
  const year = String(date.getFullYear());
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const serial = hashToSerial(invoice.orderId || `${Date.now()}`);
  return `INV-${year}${month}${day}-${serial}`;
}

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

function PrintableInvoiceDocument({
  invoice,
  storeName,
  storeAddress,
  storePhone,
  logoDataUrl,
}: {
  invoice: InvoicePayload;
  storeName: string;
  storeAddress: string;
  storePhone: string;
  logoDataUrl: string;
}) {
  const invoiceNumber = resolveInvoiceNumber(invoice);
  const orderTokenTail = (invoice.orderId || "").slice(-8).toUpperCase() || "N/A";
  const orderDate = new Date(invoice.createdAt).toLocaleString("bn-BD", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  const paymentReference =
    invoice.paymentMethod === "Cash on Delivery" ? "ক্যাশ অন ডেলিভারি" : invoice.trxId || "N/A";

  return (
    <div className="invoice-page">
      <div className="invoice-blob-tl" />
      <div className="invoice-blob-br" />

      <header className="invoice-header">
        <div className="invoice-header-left">
          {logoDataUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logoDataUrl} alt={`${storeName} logo`} className="invoice-logo" />
          ) : (
            <div className="invoice-logo-placeholder">{storeName.charAt(0).toUpperCase()}</div>
          )}
          <div>
            <div className="invoice-store-name">{storeName}</div>
            <div className="invoice-store-sub">অর্ডার ইনভয়েস</div>
          </div>
        </div>

        <div className="invoice-header-right">
          <div className="invoice-label">ইনভয়েস নম্বর</div>
          <div className="invoice-id">#{invoiceNumber}</div>
          <div className="invoice-date">{orderDate}</div>
          <div className="invoice-order-ref">Order Ref: {invoice.orderId}</div>
        </div>
      </header>

      <div className="invoice-body">
        <div className="invoice-meta-strip">
          <div className="invoice-meta-pill">
            <span className="invoice-meta-key">Invoice No</span>
            <span className="invoice-meta-value">{invoiceNumber}</span>
          </div>
          <div className="invoice-meta-pill">
            <span className="invoice-meta-key">Order Token</span>
            <span className="invoice-meta-value">{orderTokenTail}</span>
          </div>
          <div className="invoice-meta-pill">
            <span className="invoice-meta-key">Status</span>
            <span className="invoice-meta-value">Pending Confirmation</span>
          </div>
        </div>

        <div className="invoice-info-grid">
          <section className="invoice-info-box">
            <div className="invoice-info-title">ক্রেতার তথ্য</div>
            <div className="invoice-info-row">
              <span className="invoice-info-label">নাম:</span>
              <span className="invoice-info-value">{invoice.customerName}</span>
            </div>
            <div className="invoice-info-row">
              <span className="invoice-info-label">ফোন:</span>
              <span className="invoice-info-value">{invoice.phone}</span>
            </div>
            <div className="invoice-info-row">
              <span className="invoice-info-label">ঠিকানা:</span>
              <span className="invoice-info-value">{invoice.address}</span>
            </div>
          </section>

          <section className="invoice-info-box">
            <div className="invoice-info-title">ডেলিভারি ও পেমেন্ট</div>
            <div className="invoice-info-row">
              <span className="invoice-info-label">ডেলিভারি:</span>
              <span className="invoice-info-value">{invoice.deliveryMethod}</span>
            </div>
            <div className="invoice-info-row">
              <span className="invoice-info-label">কুরিয়ার:</span>
              <span className="invoice-info-value">{invoice.courierName || "N/A"}</span>
            </div>
            <div className="invoice-info-row">
              <span className="invoice-info-label">পেমেন্ট:</span>
              <span className="invoice-info-value">{invoice.paymentMethod}</span>
            </div>
            <div className="invoice-info-row">
              <span className="invoice-info-label">রেফারেন্স:</span>
              <span className="invoice-info-value">{paymentReference}</span>
            </div>
            {storePhone ? (
              <div className="invoice-info-row">
                <span className="invoice-info-label">স্টোর ফোন:</span>
                <span className="invoice-info-value">{storePhone}</span>
              </div>
            ) : null}
            {storeAddress ? (
              <div className="invoice-info-row">
                <span className="invoice-info-label">স্টোর ঠিকানা:</span>
                <span className="invoice-info-value">{storeAddress}</span>
              </div>
            ) : null}
          </section>
        </div>

        <div className="invoice-section-title">অর্ডার আইটেম</div>

        <table className="invoice-table">
          <thead>
            <tr>
              <th>পণ্যের নাম</th>
              <th>সাইজ</th>
              <th>পরিমাণ</th>
              <th>একক মূল্য</th>
              <th>মোট</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item, index) => (
              <tr key={`${item.name}-${item.selectedSize}-${index}`}>
                <td className="invoice-name-cell">{item.name}</td>
                <td>{item.selectedSize}</td>
                <td>{item.quantity}</td>
                <td>৳{item.price.toLocaleString("bn-BD")}</td>
                <td className="invoice-line-total">
                  ৳{(item.price * item.quantity).toLocaleString("bn-BD")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="invoice-total-section">
          <div className="invoice-total-box">
            <div className="invoice-total-label">সর্বমোট পরিমাণ</div>
            <div className="invoice-total-amount">৳{invoice.total.toLocaleString("bn-BD")}</div>
          </div>
        </div>

        <div className="invoice-note">
          <div className="invoice-note-title">🙏 {storeName}-এ কেনাকাটার জন্য আন্তরিক ধন্যবাদ!</div>
          <div className="invoice-note-sub">SUMONIX AI কমার্স অটোমেশন দ্বারা পরিচালিত</div>
        </div>
      </div>

      <footer className="invoice-footer">
        <span>{storeName} — অর্ডার ইনভয়েস</span>
        <span>Invoice #{invoiceNumber}</span>
      </footer>
    </div>
  );
}

function setupPrintWindow(
  popup: Window,
  container: HTMLElement,
  title: string
) {
  popup.document.title = title;
  popup.document.documentElement.lang = "bn";
  popup.document.body.replaceChildren();
  popup.document.head.replaceChildren();

  const charsetMeta = popup.document.createElement("meta");
  charsetMeta.setAttribute("charset", "utf-8");
  popup.document.head.appendChild(charsetMeta);

  const viewportMeta = popup.document.createElement("meta");
  viewportMeta.name = "viewport";
  viewportMeta.content = "width=device-width, initial-scale=1.0";
  popup.document.head.appendChild(viewportMeta);

  const style = popup.document.createElement("style");
  style.textContent = INVOICE_WINDOW_STYLES;
  popup.document.head.appendChild(style);

  popup.document.body.appendChild(container);
}

export default function InvoiceAutoDownload({
  storeName,
  logoUrl,
  storeAddress,
  storePhone,
}: Props) {
  const [invoice, setInvoice] = useState<InvoicePayload | null>(null);
  const [status, setStatus] = useState("ইনভয়েস প্রস্তুত হচ্ছে…");
  const [printed, setPrinted] = useState(false);
  const popupRef = useRef<Window | null>(null);
  const rootRef = useRef<Root | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) {
      setStatus("ইনভয়েস ডেটা পাওয়া যায়নি। নতুন অর্ডার করুন।");
      return;
    }

    try {
      setInvoice(JSON.parse(raw) as InvoicePayload);
    } catch {
      setStatus("ইনভয়েস ডেটা ত্রুটিপূর্ণ।");
    }
  }, []);

  useEffect(() => {
    return () => {
      rootRef.current?.unmount();
      if (popupRef.current && !popupRef.current.closed) {
        popupRef.current.close();
      }
    };
  }, []);

  const openPrintableInvoice = useCallback(
    async (currentInvoice: InvoicePayload, autoPrint: boolean) => {
      setStatus("ইনভয়েস তৈরি হচ্ছে…");

      const popup = window.open("", "_blank", "width=900,height=1100,scrollbars=yes");
      if (!popup) {
        setStatus("পপআপ ব্লক হয়েছে। নিচের বাটনে ক্লিক করে আবার চেষ্টা করুন।");
        return;
      }

      const logoDataUrl = logoUrl ? await fetchImageAsDataUrl(logoUrl) : "";
      const title = `ইনভয়েস — ${resolveInvoiceNumber(currentInvoice)}`;
      const container = popup.document.createElement("div");

      setupPrintWindow(popup, container, title);

      rootRef.current?.unmount();
      const root = createRoot(container);
      rootRef.current = root;
      popupRef.current = popup;

      root.render(
        <PrintableInvoiceDocument
          invoice={currentInvoice}
          storeName={storeName}
          storeAddress={storeAddress || ""}
          storePhone={storePhone || ""}
          logoDataUrl={logoDataUrl}
        />
      );

      const cleanup = () => {
        root.unmount();
        if (rootRef.current === root) {
          rootRef.current = null;
        }
      };

      popup.addEventListener("beforeunload", cleanup, { once: true });

      if (autoPrint) {
        window.setTimeout(() => {
          if (!popup.closed) {
            popup.focus();
            popup.print();
          }
        }, PRINT_DELAY_MS);
      }

      sessionStorage.removeItem(STORAGE_KEY);
      setStatus(
        autoPrint
          ? "ইনভয়েস উইন্ডো খুলেছে — প্রিন্ট বা PDF হিসেবে সেভ করুন।"
          : "ইনভয়েস উইন্ডো খুলেছে।"
      );
    },
    [logoUrl, storeAddress, storeName, storePhone]
  );

  useEffect(() => {
    if (!invoice || printed) return;

    let cancelled = false;

    const run = async () => {
      try {
        if (cancelled) return;
        await openPrintableInvoice(invoice, true);
        if (!cancelled) {
          setPrinted(true);
        }
      } catch {
        if (!cancelled) {
          setStatus("ইনভয়েস তৈরি করতে সমস্যা হয়েছে।");
        }
      }
    };

    void run();

    return () => {
      cancelled = true;
    };
  }, [invoice, openPrintableInvoice, printed]);

  const handleManualPrint = async () => {
    if (!invoice) return;

    try {
      await openPrintableInvoice(invoice, false);
    } catch {
      setStatus("ইনভয়েস তৈরি করতে সমস্যা হয়েছে।");
    }
  };

  return (
    <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4 text-center">
      <p className="text-sm text-slate-600">{status}</p>
      {invoice ? (
        <button
          type="button"
          onClick={handleManualPrint}
          className="mt-3 inline-flex items-center gap-2 rounded-full bg-teal-700 px-5 py-2 text-sm font-semibold text-white transition hover:bg-teal-800"
        >
          🖨️ ইনভয়েস প্রিন্ট / PDF সেভ করুন
        </button>
      ) : null}
    </div>
  );
}
