"use client";

import { useEffect, useState } from "react";

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

async function fetchImageAsDataUrl(url: string) {
  const response = await fetch(url);
  const blob = await response.blob();

  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("Failed to read image"));
    reader.readAsDataURL(blob);
  });
}

export default function InvoiceAutoDownload({
  storeName,
  logoUrl,
  storeAddress,
  storePhone,
}: Props) {
  const [invoice, setInvoice] = useState<InvoicePayload | null>(null);
  const [status, setStatus] = useState("Preparing invoice PDF...");

  useEffect(() => {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) {
      setStatus("Invoice data not found. Please place a new order.");
      return;
    }

    try {
      const parsed = JSON.parse(raw) as InvoicePayload;
      setInvoice(parsed);
    } catch {
      setStatus("Invoice data is invalid.");
    }
  }, []);

  useEffect(() => {
    if (!invoice) return;

    let cancelled = false;

    const run = async () => {
      try {
        const [{ default: jsPDF }, { default: autoTable }] = await Promise.all([
          import("jspdf"),
          import("jspdf-autotable"),
        ]);

        const doc = new jsPDF();
        doc.setFillColor(15, 118, 110);
        doc.rect(0, 0, 210, 34, "F");

        if (logoUrl) {
          try {
            const logoData = await fetchImageAsDataUrl(logoUrl);
            if (logoData) {
              doc.addImage(logoData, "PNG", 14, 8, 18, 18);
            }
          } catch {
            // Ignore logo failures.
          }
        }

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(18);
        doc.text(storeName, logoUrl ? 38 : 14, 16);
        doc.setFontSize(10);
        doc.text("Order Invoice", logoUrl ? 38 : 14, 23);

        doc.setTextColor(31, 41, 55);
        doc.setFontSize(11);
        doc.text(`Invoice ID: ${invoice.orderId}`, 14, 44);
        doc.text(`Date: ${new Date(invoice.createdAt).toLocaleString()}`, 14, 51);
        doc.text(`Customer: ${invoice.customerName}`, 14, 58);
        doc.text(`Phone: ${invoice.phone}`, 14, 65);
        doc.text(`Address: ${invoice.address}`, 14, 72);
        doc.text(`Delivery: ${invoice.deliveryMethod}`, 14, 79);
        doc.text(`Courier: ${invoice.courierName || "N/A"}`, 14, 86);
        doc.text(`Payment: ${invoice.paymentMethod}`, 14, 93);
        doc.text(
          `Reference: ${invoice.paymentMethod === "Cash on Delivery" ? "Cash on Delivery" : invoice.trxId || "N/A"}`,
          14,
          100
        );

        doc.setFontSize(10);
        doc.text(`Store Contact: ${storePhone || "N/A"}`, 125, 51);
        doc.text(`Store Address: ${storeAddress || "N/A"}`, 125, 58);

        autoTable(doc, {
          startY: 108,
          head: [["Product", "Size", "Qty", "Unit Price", "Subtotal"]],
          body: invoice.items.map((item) => [
            item.name,
            item.selectedSize,
            String(item.quantity),
            `৳${item.price}`,
            `৳${item.price * item.quantity}`,
          ]),
          styles: { fontSize: 10 },
          headStyles: { fillColor: [15, 118, 110] },
        });

        const finalY = (doc as jsPDF & { lastAutoTable?: { finalY?: number } }).lastAutoTable?.finalY || 130;
        doc.setFontSize(13);
        doc.text(`Total Amount: ৳${invoice.total}`, 14, finalY + 12);
        doc.setFontSize(10);
        doc.text("Thank you for shopping with Clothify.", 14, finalY + 20);

        if (cancelled) return;
        doc.save(`clothify-invoice-${invoice.orderId}.pdf`);
        setStatus("Invoice PDF downloaded automatically.");
        sessionStorage.removeItem(STORAGE_KEY);
      } catch {
        if (!cancelled) {
          setStatus("Invoice তৈরি করা যায়নি। আবার অর্ডার করে চেষ্টা করুন।");
        }
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [invoice, logoUrl, storeAddress, storeName, storePhone]);

  return <p className="mt-4 text-sm text-slate-500">{status}</p>;
}
