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
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-4 w-4 fill-current"
    >
      <path d="M13.5 21v-7h2.4l.4-3h-2.8V9.3c0-.9.2-1.5 1.5-1.5h1.4V5.1c-.2 0-1-.1-2-.1-2 0-3.4 1.2-3.4 3.6V11H9v3h2v7h2.5z" />
    </svg>
  );
}

function MapPinIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-4 w-4 fill-current"
    >
      <path d="M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z" />
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

  // Check if the location is already a Google Maps link
  const isGoogleMapsLink = locationText.startsWith('http') &&
    (locationText.includes('maps.google.com') ||
     locationText.includes('maps.app.goo.gl') ||
     locationText.includes('goo.gl/maps'));

  // If it's a Google Maps link, use it directly, otherwise encode as a search query
  const mapsUrl = isGoogleMapsLink ? locationText : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(locationText)}`;

  // For embedding, we need to extract location or use a placeholder
  // Google Maps shortened links don't work well in iframes, so we keep the original encoding for non-link addresses
  const mapsEmbedUrl = isGoogleMapsLink
    ? locationText.replace('maps.app.goo.gl', 'www.google.com/maps/embed')
    : `https://www.google.com/maps?q=${encodeURIComponent(locationText)}&output=embed`;

  return (
    <div className="mt-10 border-t border-white/10 pt-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur">
          <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">
            Developed & Managed By
          </p>

          <div className="mt-3 flex items-start gap-3">
            <Image
              src="/abo-logo.png"
              alt="ABO Enterprise"
              width={56}
              height={56}
              className="h-14 w-14 rounded-xl border border-white/20 object-cover shadow"
            />

            <div>
              <h4 className="text-sm font-bold text-white">{name}</h4>
              <p className="mt-0.5 text-xs text-slate-300">{role}</p>
              <p className="mt-1 text-[11px] font-semibold tracking-wide text-emerald-300">
                {business}
              </p>
            </div>
          </div>

          <div className="mt-3 space-y-1 text-[11px] text-slate-400">
            <p>{email1}</p>
            <p>{email2}</p>
            <p>WhatsApp: {whatsapp}</p>
            <p>Phone: {phone}</p>
          </div>

          <a
            href={developerFacebook}
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-blue-300/40 bg-blue-500/15 px-4 py-2.5 text-xs font-semibold text-blue-100 transition hover:bg-blue-500/30 sm:w-auto"
          >
            <FacebookIcon />
            Developer Facebook
          </a>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur">
          <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">
            Live Store Location
          </p>
          <p className="mt-2 text-xs leading-5 text-slate-300">{locationText}</p>

          <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            <a
              href={mapsUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-300/50 bg-emerald-400/15 px-4 py-2.5 text-xs font-semibold text-emerald-100 transition hover:bg-emerald-400/30 sm:w-auto"
            >
              <MapPinIcon />
              Google Maps Location
            </a>

            <a
              href={storeFacebook}
              target="_blank"
              rel="noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-blue-300/40 bg-blue-500/15 px-4 py-2.5 text-xs font-semibold text-blue-100 transition hover:bg-blue-500/30 sm:w-auto"
            >
              <FacebookIcon />
              Shop Facebook Page
            </a>
          </div>

          {showMap ? (
            <div className="mt-3 overflow-hidden rounded-xl border border-white/10">
              <iframe
                title="Store live location map"
                src={mapsEmbedUrl}
                width="100%"
                height="170"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="block"
              />
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowMap(true)}
              className="mt-3 inline-flex w-full items-center justify-center rounded-xl border border-white/20 px-4 py-2.5 text-xs font-semibold text-slate-200 transition hover:bg-white/10"
            >
              🗺️ Load Mini Map
            </button>
          )}
        </div>
      </div>
    </div>

  );
}
