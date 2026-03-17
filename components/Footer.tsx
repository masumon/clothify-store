import Link from "next/link";
import DeveloperCredit from "./DeveloperCredit";

type Props = {
  storeName?: string;
  address?: string;
  phone?: string;
};

// Social Media Icon Components with Brand Colors
function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="#1877F2">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5">
      <defs>
        <linearGradient id="instagram-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FD5949"/>
          <stop offset="50%" stopColor="#D6249F"/>
          <stop offset="100%" stopColor="#285AEB"/>
        </linearGradient>
      </defs>
      <path fill="url(#instagram-gradient)" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
    </svg>
  );
}

function YouTubeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="#FF0000">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5">
      <defs>
        <linearGradient id="tiktok-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00f2ea"/>
          <stop offset="100%" stopColor="#ff0050"/>
        </linearGradient>
      </defs>
      <path fill="url(#tiktok-gradient)" d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="#25D366">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  );
}

// Payment Method Logo Components with Brand Accurate Designs
function BkashIcon() {
  return (
    <div className="flex h-12 w-20 items-center justify-center rounded-lg bg-gradient-to-br from-pink-600 to-pink-700 shadow-md">
      <svg viewBox="0 0 100 30" className="h-6 w-16">
        <text x="50" y="20" fontSize="16" fontWeight="bold" fill="white" textAnchor="middle" fontFamily="Arial, sans-serif">
          bKash
        </text>
      </svg>
    </div>
  );
}

function NagadIcon() {
  return (
    <div className="flex h-12 w-20 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-red-600 shadow-md">
      <svg viewBox="0 0 100 30" className="h-6 w-16">
        <text x="50" y="20" fontSize="14" fontWeight="bold" fill="white" textAnchor="middle" fontFamily="Arial, sans-serif">
          NAGAD
        </text>
      </svg>
    </div>
  );
}

function RocketIcon() {
  return (
    <div className="flex h-12 w-20 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-purple-800 shadow-md">
      <svg viewBox="0 0 100 30" className="h-7 w-16">
        <text x="50" y="20" fontSize="13" fontWeight="bold" fill="white" textAnchor="middle" fontFamily="Arial, sans-serif">
          Rocket
        </text>
      </svg>
    </div>
  );
}

function VisaIcon() {
  return (
    <div className="flex h-12 w-20 items-center justify-center rounded-lg bg-white shadow-md">
      <svg viewBox="0 0 48 16" className="h-5 w-14">
        <path fill="#1A1F71" d="M17.0285 3.6347L13.6118 12.3653H11.4118L9.67646 5.77037C9.57646 5.38148 9.49535 5.22037 9.23535 5.06704C8.79535 4.82815 8.05646 4.60815 7.41979 4.47037L7.46312 3.6347H10.8931C11.3598 3.6347 11.7687 3.94815 11.8598 4.47037L12.7531 9.28148L14.9998 3.6347H17.0285ZM27.0398 9.25037C27.0487 7.2947 24.1976 7.17925 24.2154 6.32037C24.2198 6.04815 24.4865 5.75926 25.0709 5.68592C25.362 5.6547 26.2554 5.63148 27.2598 6.08592L27.682 4.21481C27.1398 4.01926 26.4487 3.83148 25.5909 3.83148C23.6909 3.83148 22.362 4.90704 22.3531 6.4247C22.3442 7.54037 23.3531 8.16815 24.1176 8.54037C24.9087 8.92037 25.1842 9.16815 25.1798 9.51037C25.1731 10.0326 24.5509 10.2637 23.9731 10.2726C22.9509 10.287 22.3509 10.007 21.8731 9.77926L21.4398 11.707C21.9198 11.9303 22.8087 12.127 23.7287 12.1359C25.7487 12.1359 27.0354 11.0714 27.0398 9.25037ZM32.3865 12.3653H34.1598L32.6598 3.6347H30.9909C30.5909 3.6347 30.2376 3.88592 30.0776 4.26704L27.0909 12.3653H29.1109L29.5265 11.182H32.0087L32.3865 12.3653ZM30.0887 9.48592L31.1598 6.55037L31.7598 9.48592H30.0887ZM20.6618 3.6347L19.0974 12.3653H17.1785L18.7429 3.6347H20.6618Z"/>
      </svg>
    </div>
  );
}

function MasterCardIcon() {
  return (
    <div className="flex h-12 w-20 items-center justify-center rounded-lg bg-white shadow-md">
      <svg viewBox="0 0 48 32" className="h-7 w-12">
        <circle cx="15" cy="16" r="10" fill="#EB001B"/>
        <circle cx="25" cy="16" r="10" fill="#F79E1B"/>
        <path fill="#FF5F00" d="M20 8.8c-2.2 1.8-3.6 4.6-3.6 7.2s1.4 5.4 3.6 7.2c2.2-1.8 3.6-4.6 3.6-7.2S22.2 10.6 20 8.8z"/>
      </svg>
    </div>
  );
}

function PayPalIcon() {
  return (
    <div className="flex h-12 w-20 items-center justify-center rounded-lg bg-white shadow-md">
      <svg viewBox="0 0 100 32" className="h-7 w-16">
        <path fill="#003087" d="M12 4.917c4.644 0 7.291 2.366 7.291 6.25 0 4.584-3.166 7.333-7.708 7.333H9.167L7.917 26h-3.75L8 4.917h4zm11.666 0l-3.834 21.083h3.584L27.25 4.917h-3.584zm8.5 0c4.645 0 7.292 2.366 7.292 6.25 0 4.584-3.167 7.333-7.709 7.333h-2.416L27.917 26h-3.75L28 4.917h4.166z"/>
        <path fill="#0070BA" d="M35.791 26c-.583-1.083-.916-2.416-.916-3.916 0-4.584 3.166-7.334 7.708-7.334h2.417l.75-4.166h3.75l-3.833 21.083h-3.584l.75-4.167c-1.75 2.917-4.584 4.5-7.917 4.5h-1.084l.959-5.917z"/>
      </svg>
    </div>
  );
}

function StripeIcon() {
  return (
    <div className="flex h-12 w-20 items-center justify-center rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 shadow-md">
      <svg viewBox="0 0 60 25" className="h-6 w-14">
        <path fill="white" d="M59.64 14.28h-8.06c.19 1.93 1.6 2.55 3.2 2.55 1.64 0 2.96-.37 4.05-.95v3.32a8.33 8.33 0 01-4.56 1.1c-4.01 0-6.83-2.5-6.83-7.48 0-4.19 2.39-7.52 6.3-7.52 3.92 0 5.96 3.28 5.96 7.5 0 .4-.04 1.26-.06 1.48zm-5.92-5.62c-1.03 0-2.17.73-2.17 2.58h4.25c0-1.85-1.07-2.58-2.08-2.58zM40.95 20.3c-1.44 0-2.32-.6-2.9-1.04l-.02 4.63-4.12.87V5.57h3.76l.08 1.02a4.7 4.7 0 013.23-1.29c2.9 0 5.62 2.6 5.62 7.4 0 5.23-2.7 7.6-5.65 7.6zM40 8.95c-.95 0-1.54.34-1.97.81l.02 6.12c.4.44.98.78 1.95.78 1.52 0 2.54-1.65 2.54-3.87 0-2.15-1.04-3.84-2.54-3.84zM28.24 5.57h4.13v14.44h-4.13V5.57zm0-4.7L32.37 0v3.36l-4.13.88V.88zm-4.32 9.35v9.79H19.8V5.57h3.7l.12 1.22c1-1.77 3.07-1.41 3.62-1.22v3.79c-.52-.17-2.29-.43-3.32.86zm-8.55 4.72c0 2.43 2.6 1.68 3.12 1.46v3.36c-.55.3-1.54.54-2.89.54a4.15 4.15 0 01-4.27-4.24l.01-13.17 4.02-.86v3.54h3.14V9.1h-3.13v5.85zm-4.91.7c0 2.97-2.31 4.66-5.73 4.66a11.2 11.2 0 01-4.46-.93v-3.93c1.38.75 3.1 1.31 4.46 1.31.92 0 1.53-.24 1.53-1C6.26 13.77 0 14.51 0 9.95 0 7.04 2.28 5.3 5.62 5.3c1.36 0 2.72.2 4.09.75v3.88a9.23 9.23 0 00-4.1-1.06c-.86 0-1.44.25-1.44.9 0 1.85 6.29.97 6.29 5.88z"/>
      </svg>
    </div>
  );
}

export default function Footer({
  storeName = "Clothify",
  address = "",
  phone = "",
}: Props) {
  return (
    <footer className="mt-16 border-t border-white/10 bg-gradient-to-br from-slate-950 via-slate-900 to-teal-950 text-white">
      <div className="mx-auto max-w-6xl px-4 py-12">
        {/* Main Footer Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold">{storeName}</h3>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              Premium clothing collection with trusted checkout and fast service.
            </p>
            <div className="mt-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Contact
              </p>
              <p className="mt-2 text-sm text-slate-300">
                {phone || "Phone not added yet"}
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold">Quick Links</h4>
            <ul className="mt-3 space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-sm text-slate-300 transition hover:text-white"
                >
                  Shop
                </Link>
              </li>
              <li>
                <Link
                  href="/cart"
                  className="text-sm text-slate-300 transition hover:text-white"
                >
                  Cart
                </Link>
              </li>
              <li>
                <Link
                  href="/checkout"
                  className="text-sm text-slate-300 transition hover:text-white"
                >
                  Checkout
                </Link>
              </li>
              <li>
                <Link
                  href="/settings"
                  className="text-sm text-slate-300 transition hover:text-white"
                >
                  Settings
                </Link>
              </li>
            </ul>
          </div>

          {/* About Us with Social Media */}
          <div>
            <h4 className="text-lg font-semibold">About Us</h4>
            <ul className="mt-3 space-y-2">
              <li>
                <Link
                  href="/fb"
                  className="text-sm text-slate-300 transition hover:text-white"
                >
                  📣 Landing Page
                </Link>
              </li>
              <li>
                <Link
                  href="/payment"
                  className="text-sm text-slate-300 transition hover:text-white"
                >
                  💳 Payment Guide
                </Link>
              </li>
            </ul>

            <div className="mt-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Follow Us
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <a
                  href="https://www.facebook.com/share/18u2zHzb6N/"
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white transition hover:scale-110"
                  aria-label="Facebook"
                  title="Facebook"
                >
                  <FacebookIcon />
                </a>
                <a
                  href="#"
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white transition hover:scale-110"
                  aria-label="Instagram"
                  title="Instagram"
                >
                  <InstagramIcon />
                </a>
                <a
                  href="#"
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white transition hover:scale-110"
                  aria-label="YouTube"
                  title="YouTube"
                >
                  <YouTubeIcon />
                </a>
                <a
                  href="#"
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white transition hover:scale-110"
                  aria-label="TikTok"
                  title="TikTok"
                >
                  <TikTokIcon />
                </a>
                <a
                  href="https://wa.me/8801811314262"
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white transition hover:scale-110"
                  aria-label="WhatsApp"
                  title="WhatsApp"
                >
                  <WhatsAppIcon />
                </a>
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div>
            <h4 className="text-lg font-semibold">Payment Methods</h4>
            <p className="mt-2 text-xs text-slate-400">We accept</p>
            <div className="mt-3 space-y-2">
              <div className="flex flex-wrap gap-2">
                <BkashIcon />
                <NagadIcon />
              </div>
              <div className="flex flex-wrap gap-2">
                <RocketIcon />
                <VisaIcon />
              </div>
              <div className="flex flex-wrap gap-2">
                <MasterCardIcon />
                <PayPalIcon />
              </div>
              <div className="flex flex-wrap gap-2">
                <StripeIcon />
              </div>
            </div>
          </div>
        </div>

        {/* Store Location */}
        {address && (
          <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
              📍 Store Location
            </h4>
            <p className="mt-2 text-sm leading-6 text-slate-300">{address}</p>
          </div>
        )}

        {/* Developer Credit */}
        <DeveloperCredit storeAddress={address || ""} />

        {/* Copyright */}
        <div className="mt-8 border-t border-white/10 pt-6 text-center text-xs text-slate-400">
          © {new Date().getFullYear()} {storeName}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
