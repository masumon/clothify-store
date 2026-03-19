"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import AppIcon from "@/components/AppIcon";
import DeveloperCredit from "./DeveloperCredit";
import { getDictionary } from "@/lib/i18n";
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
  badge: string;
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

  const dict = getDictionary(lang);
  const addressParts = formatAddressParts(address || "");
  const paymentMethods: PaymentMethod[] = useMemo(
    () => [
      { key: "bkash", label: "bKash", badge: "BK", available: true, href: "/payment" },
      { key: "nagad", label: "Nagad", badge: "NG", available: true, href: "/checkout" },
      { key: "cod", label: dict.checkout.cod, badge: "COD", available: true, href: "/checkout" },
      { key: "card", label: "Visa/Mastercard", badge: "VM", available: false },
      { key: "paypal", label: "PayPal", badge: "PP", available: false },
      { key: "stripe", label: "Stripe", badge: "ST", available: false },
    ],
    [dict.checkout.cod]
  );

  const handlePaymentMethodClick = (method: PaymentMethod) => {
    if (method.available || method.href) return;
    setToast(`${method.label} ${dict.common.comingSoon.toLowerCase()}.`);
  };

  const footerCredit = `Designed & Developed by Sumon (Mumain Ahmed) | Powered by ${storeName} © 2026`;

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
              {dict.footer.description}
            </p>

            <p className="mt-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              {dict.footer.contact}
            </p>
            <p className="mt-1 text-sm text-slate-300">{phone || dict.footer.contactMissing}</p>

            <div className="mt-4 flex items-center gap-2">
              <a
                href="https://www.facebook.com/share/18u2zHzb6N/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-sm transition hover:bg-white/20"
                aria-label="Facebook"
              >
                <AppIcon name="facebook" className="h-4.5 w-4.5" />
              </a>
              <a
                href="https://wa.me/8801811314262"
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-emerald-500/40 bg-emerald-500/20 text-sm text-emerald-100 transition hover:bg-emerald-500/30"
                aria-label="WhatsApp"
              >
                <AppIcon name="whatsapp" className="h-4.5 w-4.5" />
              </a>
              <a
                href="https://www.instagram.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-sm transition hover:bg-white/20"
                aria-label="Instagram"
              >
                <AppIcon name="instagram" className="h-4.5 w-4.5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-base font-bold">{dict.footer.quickLinks}</h4>
            <ul className="mt-3 space-y-2 text-sm text-slate-300">
              <li><Link href="/" className="inline-flex items-center gap-2 transition hover:text-white"><AppIcon name="home" className="h-4 w-4" />{dict.common.home}</Link></li>
              <li><Link href="/fb" className="inline-flex items-center gap-2 transition hover:text-white"><AppIcon name="landing" className="h-4 w-4" />{dict.footer.landingPage}</Link></li>
              <li><Link href="/categories" className="inline-flex items-center gap-2 transition hover:text-white"><AppIcon name="categories" className="h-4 w-4" />{dict.common.categories}</Link></li>
              <li><Link href="/offers" className="inline-flex items-center gap-2 transition hover:text-white"><AppIcon name="offers" className="h-4 w-4" />{dict.common.offers}</Link></li>
              <li><Link href="/checkout" className="inline-flex items-center gap-2 transition hover:text-white"><AppIcon name="payment" className="h-4 w-4" />{dict.header.checkout}</Link></li>
              <li><Link href="/help" className="inline-flex items-center gap-2 transition hover:text-white"><AppIcon name="support" className="h-4 w-4" />{dict.common.support}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-base font-bold">{dict.footer.customerService}</h4>
            <ul className="mt-3 space-y-2 text-sm text-slate-300">
              <li><Link href="/legal#shipping" className="transition hover:text-white">{dict.footer.shipping}</Link></li>
              <li><Link href="/legal#refund" className="transition hover:text-white">{dict.footer.returns}</Link></li>
              <li><Link href="/legal#privacy" className="transition hover:text-white">{dict.footer.privacy}</Link></li>
              <li><Link href="/legal#terms" className="transition hover:text-white">{dict.footer.terms}</Link></li>
              <li><Link href="/size-guide" className="transition hover:text-white">{dict.header.sizeGuide}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-base font-bold">{dict.footer.paymentMethods}</h4>
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
                    title={method.available ? dict.common.active : dict.common.comingSoon}
                  >
                    <span className="mr-2 inline-flex rounded-full border border-white/15 bg-white/10 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em]">
                      {method.badge}
                    </span>
                    {method.label}
                  </Link>
                ) : (
                  <button
                    key={method.key}
                    type="button"
                    onClick={() => handlePaymentMethodClick(method)}
                    className="rounded-xl border border-white/15 bg-white/5 px-2.5 py-2 text-left text-xs font-semibold text-slate-200 transition hover:bg-white/10"
                    title={dict.common.comingSoon}
                  >
                    <span className="mr-2 inline-flex rounded-full border border-white/15 bg-white/10 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em]">
                      {method.badge}
                    </span>
                    {method.label}
                  </button>
                )
              )}
            </div>
            <p className="mt-2 text-xs text-slate-400">
              {dict.footer.paymentHint}
            </p>
          </div>
        </div>

        {addressParts.length > 0 ? (
          <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              {dict.footer.storeLocation}
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
          {uiMode === "abo" ? footerCredit : `© ${new Date().getFullYear()} ${storeName}. ${dict.footer.rightsReserved}`}
        </div>
      </div>
    </footer>
  );
}
