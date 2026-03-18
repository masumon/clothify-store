"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import DeveloperCredit from "./DeveloperCredit";
import {
  type Language,
  PREFERENCE_EVENT,
  readSitePreferences,
  type UiMode,
} from "@/lib/site-preferences";

type Props = {
  storeName?: string;
  address?: string;
  phone?: string;
};

type PaymentMethod = {
  key: string;
  label: string;
  logo: string;
  available: boolean;
  href?: string;
};

function formatAddressParts(address: string) {
  return address
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
}

export default function Footer({
  storeName = "Clothify",
  address = "",
  phone = "",
}: Props) {
  const [lang, setLang] = useState<Language>("bn");
  const [uiMode, setUiMode] = useState<UiMode>("default");
  const [toast, setToast] = useState("");

  useEffect(() => {
    const sync = () => {
      const prefs = readSitePreferences();
      setLang(prefs.language);
      setUiMode(prefs.uiMode);
    };
    sync();
    window.addEventListener(PREFERENCE_EVENT, sync);
    return () => window.removeEventListener(PREFERENCE_EVENT, sync);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const id = window.setTimeout(() => setToast(""), 2200);
    return () => window.clearTimeout(id);
  }, [toast]);

  const isBn = lang === "bn";
  const addressParts = formatAddressParts(address || "");
  const paymentMethods: PaymentMethod[] = useMemo(
    () => [
      { key: "bkash", label: "bKash", logo: "💳", available: true, href: "/payment" },
      { key: "nagad", label: "Nagad", logo: "🧡", available: true, href: "/checkout" },
      { key: "cod", label: isBn ? "Cash on Delivery" : "Cash on Delivery", logo: "📦", available: true, href: "/checkout" },
      { key: "card", label: "Visa/Mastercard", logo: "💠", available: false },
      { key: "paypal", label: "PayPal", logo: "🅿️", available: false },
      { key: "stripe", label: "Stripe", logo: "💜", available: false },
    ],
    [isBn]
  );

  const handlePaymentMethodClick = (method: PaymentMethod) => {
    if (method.available || method.href) return;
    setToast(
      isBn
        ? `${method.label} ফিচার শীঘ্রই যুক্ত হচ্ছে।`
        : `${method.label} is coming soon.`
    );
  };

  return (
    <footer className="mt-16 border-t border-white/10 bg-gradient-to-br from-slate-950 via-slate-900 to-teal-950 text-white">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-8 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2.5">
              <Image
                src="/icons/icon-192.png"
                alt={storeName}
                width={40}
                height={40}
                className="h-10 w-10 rounded-full border border-white/20 object-cover"
              />
              <h3 className="text-xl font-extrabold">{storeName}</h3>
            </div>

            <p className="mt-3 text-sm leading-6 text-slate-300">
              {isBn
                ? "প্রিমিয়াম পোশাক, নিরাপদ পেমেন্ট, দ্রুত ডেলিভারি এবং সহজ রিটার্ন সুবিধাসহ সম্পূর্ণ ই-কমার্স অভিজ্ঞতা।"
                : "Premium apparel, secure payments, fast delivery, and easy returns in one ecommerce experience."}
            </p>

            <p className="mt-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              {isBn ? "যোগাযোগ" : "Contact"}
            </p>
            <p className="mt-1 text-sm text-slate-300">{phone || (isBn ? "ফোন নাম্বার যোগ করা হয়নি" : "Phone not added yet")}</p>

            <div className="mt-4 flex items-center gap-2">
              <a
                href="https://www.facebook.com/share/18u2zHzb6N/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-sm transition hover:bg-white/20"
                aria-label="Facebook"
              >
                <i className="fa-brands fa-facebook-f" aria-hidden="true" />
              </a>
              <a
                href="https://wa.me/8801811314262"
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-emerald-500/40 bg-emerald-500/20 text-sm text-emerald-100 transition hover:bg-emerald-500/30"
                aria-label="WhatsApp"
              >
                <i className="fa-brands fa-whatsapp" aria-hidden="true" />
              </a>
              <a
                href="https://www.instagram.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-sm transition hover:bg-white/20"
                aria-label="Instagram"
              >
                <i className="fa-brands fa-instagram" aria-hidden="true" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-base font-bold">{isBn ? "দ্রুত লিংক" : "Quick Links"}</h4>
            <ul className="mt-3 space-y-2 text-sm text-slate-300">
              <li><Link href="/" className="transition hover:text-white">{isBn ? "🏠 হোম" : "🏠 Home"}</Link></li>
              <li><Link href="/fb" className="transition hover:text-white">{isBn ? "📣 ল্যান্ডিং পেজ" : "📣 Landing Page"}</Link></li>
              <li><Link href="/categories" className="transition hover:text-white">{isBn ? "🧭 ক্যাটাগরি" : "🧭 Categories"}</Link></li>
              <li><Link href="/offers" className="transition hover:text-white">{isBn ? "🏷️ অফার" : "🏷️ Offers"}</Link></li>
              <li><Link href="/checkout" className="transition hover:text-white">{isBn ? "✅ চেকআউট" : "✅ Checkout"}</Link></li>
              <li><Link href="/help" className="transition hover:text-white">{isBn ? "💬 সাপোর্ট" : "💬 Support"}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-base font-bold">{isBn ? "কাস্টমার সার্ভিস" : "Customer Service"}</h4>
            <ul className="mt-3 space-y-2 text-sm text-slate-300">
              <li><Link href="/legal#shipping" className="transition hover:text-white">{isBn ? "Shipping & Delivery" : "Shipping & Delivery"}</Link></li>
              <li><Link href="/legal#refund" className="transition hover:text-white">{isBn ? "Returns & Exchanges" : "Returns & Exchanges"}</Link></li>
              <li><Link href="/legal#privacy" className="transition hover:text-white">{isBn ? "Privacy Policy" : "Privacy Policy"}</Link></li>
              <li><Link href="/legal#terms" className="transition hover:text-white">{isBn ? "Terms of Service" : "Terms of Service"}</Link></li>
              <li><Link href="/size-guide" className="transition hover:text-white">{isBn ? "Size Guide" : "Size Guide"}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-base font-bold">{isBn ? "পেমেন্ট মেথড" : "Payment Methods"}</h4>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {paymentMethods.map((method) =>
                method.href ? (
                  <Link
                    key={method.key}
                    href={method.href}
                    className={`rounded-xl border px-2.5 py-2 text-left text-xs font-semibold transition ${
                      method.available
                        ? "border-emerald-400/40 bg-emerald-500/10 text-emerald-100 hover:bg-emerald-500/20"
                        : "border-white/15 bg-white/5 text-slate-200 hover:bg-white/10"
                    }`}
                    title={method.available ? (isBn ? "সক্রিয়" : "Active") : (isBn ? "শীঘ্রই আসছে" : "Coming soon")}
                  >
                    <span className="mr-1">{method.logo}</span>
                    {method.label}
                  </Link>
                ) : (
                  <button
                    key={method.key}
                    type="button"
                    onClick={() => handlePaymentMethodClick(method)}
                    className="rounded-xl border border-white/15 bg-white/5 px-2.5 py-2 text-left text-xs font-semibold text-slate-200 transition hover:bg-white/10"
                    title={isBn ? "শীঘ্রই আসছে" : "Coming soon"}
                  >
                    <span className="mr-1">{method.logo}</span>
                    {method.label}
                  </button>
                )
              )}
            </div>
            <p className="mt-2 text-xs text-slate-400">
              {isBn
                ? "যে পেমেন্ট এখন চালু নেই, ক্লিক করলে 'শীঘ্রই আসছে' দেখাবে।"
                : "Unavailable methods show a coming soon message on click."}
            </p>
          </div>
        </div>

        {addressParts.length > 0 ? (
          <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              {isBn ? "স্টোর লোকেশন" : "Store Location"}
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {addressParts.map((part, index) => (
                <span
                  key={`${part}-${index}`}
                  className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-medium text-slate-200"
                >
                  {part}
                </span>
              ))}
            </div>
          </div>
        ) : null}

        <DeveloperCredit storeAddress={address || ""} />

        {toast ? (
          <div className="mt-5 rounded-xl border border-amber-300/30 bg-amber-500/10 px-3 py-2 text-xs font-semibold text-amber-200">
            {toast}
          </div>
        ) : null}

        <div className="mt-8 border-t border-white/10 pt-6 text-center text-xs text-slate-400">
          {uiMode === "abo"
            ? "Designed & Developed by Sumon (Mumain Ahmed) | Powered by ABO Enterprise © 2026"
            : `© ${new Date().getFullYear()} ${storeName}. ${isBn ? "সর্বস্বত্ব সংরক্ষিত।" : "All rights reserved."}`}
        </div>
      </div>
    </footer>
  );
}
