"use client";

import Image from "next/image";
import { useState } from "react";

type Props = {
  name?: string;
  role?: string;
  business?: string;
  email1?: string;
  email2?: string;
  whatsapp?: string;
  phone?: string;
  address?: string;
  storeAddress?: string;
  developerFacebook?: string;
  storeFacebook?: string;
};

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-3.5 w-3.5 fill-current">
      <path d="M13.5 21v-7h2.4l.4-3h-2.8V9.3c0-.9.2-1.5 1.5-1.5h1.4V5.1c-.2 0-1-.1-2-.1-2 0-3.4 1.2-3.4 3.6V11H9v3h2v7h2.5z" />
    </svg>
  );
}

function MapPinIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-3.5 w-3.5 fill-current">
      <path d="M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-3.5 w-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
      <polyline points="22,6 12,13 2,6"/>
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-3.5 w-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
    </svg>
  );
}

export default function DeveloperCredit({
  name = "Mumain Ahmed",
  role = "AI Solutions Architect & Full Stack Developer",
  business = "ABO ENTERPRISE",
  email1 = "abo.enterprise@gmail.com",
  email2 = "m.a.sumon92@gmail.com",
  whatsapp = "+8801825007977",
  phone = "+8801885411007",
  address = "Kashir Abdullahpur, Bairagi Bazar, Beanibazar, Sylhet, Bangladesh",
  storeAddress = "",
  developerFacebook = "https://www.facebook.com/sumon.mumain",
  storeFacebook = "https://www.facebook.com/share/18u2zHzb6N/",
}: Props) {
  const [showMap, setShowMap] = useState(false);
  const locationText = (storeAddress || address).trim();

  const isGoogleMapsLink = (() => {
    try {
      const url = new URL(locationText);
      const { hostname } = url;
      return (
        hostname === "maps.google.com" ||
        hostname === "maps.app.goo.gl" ||
        hostname === "goo.gl"
      );
    } catch {
      return false;
    }
  })();

  const mapsUrl = isGoogleMapsLink
    ? locationText
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(locationText)}`;

  function buildMapsEmbedUrl(location: string, isGoogleLink: boolean): string {
    if (!isGoogleLink) {
      return `https://www.google.com/maps?q=${encodeURIComponent(location)}&output=embed`;
    }
    // Short links (maps.app.goo.gl) cannot be converted to embed URLs by domain replacement.
    // Pass the short URL as a search query so Maps shows the nearest result.
    if (location.includes("maps.app.goo.gl")) {
      return `https://maps.google.com/maps?q=${encodeURIComponent(location)}&output=embed&hl=bn&z=15`;
    }
    // Full Google Maps share links: swap host to the embed endpoint.
    return location.replace("maps.app.goo.gl", "www.google.com/maps/embed");
  }

  const mapsEmbedUrl = buildMapsEmbedUrl(locationText, isGoogleMapsLink);

  return (
    <div className="mt-8 border-t border-white/10 pt-6">
      <p className="mb-3 text-[10px] uppercase tracking-[0.2em] text-slate-500">
        Developed & Managed By
      </p>

      <div className="grid gap-3 sm:grid-cols-2">
        {/* Developer card */}
        <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-3 backdrop-blur">
          <Image
            src="/abo-logo.png"
            alt="ABO Enterprise"
            width={44}
            height={44}
            className="h-11 w-11 shrink-0 rounded-xl border border-white/20 object-cover"
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-white">{name}</p>
            <p className="truncate text-[11px] text-slate-400">{role}</p>
            <p className="mt-0.5 text-[11px] font-semibold text-emerald-400">{business}</p>

          <p className="mt-2 space-y-0.5 text-[10px] text-slate-500">
            <span className="flex items-center gap-1 truncate"><MailIcon />{email1}</span>
            <span className="flex items-center gap-1 truncate"><PhoneIcon />WhatsApp: {whatsapp}</span>
          </p>

            <a
              href={developerFacebook}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-flex items-center gap-1.5 rounded-lg border border-blue-300/30 bg-blue-500/10 px-2.5 py-1.5 text-[10px] font-semibold text-blue-200 transition hover:bg-blue-500/20"
            >
              <FacebookIcon />
              Facebook
            </a>
          </div>
        </div>

        {/* Store location card */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3 backdrop-blur">
          <p className="mb-1.5 text-[10px] uppercase tracking-[0.2em] text-slate-500">
            Store Location
          </p>
          <p className="line-clamp-2 text-[11px] leading-5 text-slate-400">{locationText}</p>

          <div className="mt-2 flex flex-wrap gap-1.5">
            <a
              href={mapsUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 rounded-lg border border-emerald-300/30 bg-emerald-400/10 px-2.5 py-1.5 text-[10px] font-semibold text-emerald-200 transition hover:bg-emerald-400/20"
            >
              <MapPinIcon />
              Maps
            </a>
            <a
              href={storeFacebook}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 rounded-lg border border-blue-300/30 bg-blue-500/10 px-2.5 py-1.5 text-[10px] font-semibold text-blue-200 transition hover:bg-blue-500/20"
            >
              <FacebookIcon />
              Shop Page
            </a>
            {!showMap && (
              <button
                type="button"
                onClick={() => setShowMap(true)}
                className="inline-flex items-center gap-1 rounded-lg border border-white/10 px-2.5 py-1.5 text-[10px] font-semibold text-slate-300 transition hover:bg-white/5"
              >
                🗺️ Mini Map
              </button>
            )}
          </div>

          {showMap && (
            <div className="mt-2 overflow-hidden rounded-xl border border-white/10">
              <iframe
                title="Store location map"
                src={mapsEmbedUrl}
                width="100%"
                height="140"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="block"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

