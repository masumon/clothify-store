import Image from "next/image";

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
  const locationText = (storeAddress || address).trim();
  const mapsQuery = encodeURIComponent(locationText);
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`;
  const mapsEmbedUrl = `https://www.google.com/maps?q=${mapsQuery}&output=embed`;

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
            className="mt-3 inline-flex items-center gap-2 rounded-full border border-blue-300/40 bg-blue-500/10 px-4 py-2 text-xs font-semibold text-blue-200 transition hover:bg-blue-500/20"
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

          <a
            href={mapsUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-flex items-center gap-2 rounded-full border border-emerald-300/50 bg-emerald-400/10 px-4 py-2 text-xs font-semibold text-emerald-200 transition hover:bg-emerald-400/20"
          >
            📍 Google Maps এ দোকানের লোকেশন খুলুন
          </a>

          <a
            href={storeFacebook}
            target="_blank"
            rel="noreferrer"
            className="mt-2 inline-flex items-center gap-2 rounded-full border border-blue-300/40 bg-blue-500/10 px-4 py-2 text-xs font-semibold text-blue-200 transition hover:bg-blue-500/20"
          >
            <FacebookIcon />
            Shop Facebook Page
          </a>

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
        </div>
      </div>
    </div>

  );
}
