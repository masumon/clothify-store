import Link from "next/link";
import DeveloperCredit from "./DeveloperCredit";

type Props = {
  storeName?: string;
  address?: string;
  phone?: string;
};

// Social Media Icon Components
function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
      <path d="M13.5 21v-7h2.4l.4-3h-2.8V9.3c0-.9.2-1.5 1.5-1.5h1.4V5.1c-.2 0-1-.1-2-.1-2 0-3.4 1.2-3.4 3.6V11H9v3h2v7h2.5z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
      <path d="M12 2.2c3.2 0 3.6 0 4.8.1 3.2.1 4.8 1.7 4.9 4.9.1 1.2.1 1.6.1 4.8s0 3.6-.1 4.8c-.1 3.2-1.7 4.8-4.9 4.9-1.2.1-1.6.1-4.8.1s-3.6 0-4.8-.1c-3.2-.1-4.8-1.7-4.9-4.9-.1-1.2-.1-1.6-.1-4.8s0-3.6.1-4.8c.1-3.2 1.7-4.8 4.9-4.9 1.2-.1 1.6-.1 4.8-.1zM12 0C8.7 0 8.3 0 7.1.1 2.7.3.3 2.7.1 7.1 0 8.3 0 8.7 0 12s0 3.7.1 4.9c.2 4.4 2.6 6.8 7 7 1.2.1 1.6.1 4.9.1s3.7 0 4.9-.1c4.4-.2 6.8-2.6 7-7 .1-1.2.1-1.6.1-4.9s0-3.7-.1-4.9c-.2-4.4-2.6-6.8-7-7C15.7 0 15.3 0 12 0zm0 5.8a6.2 6.2 0 1 0 0 12.4 6.2 6.2 0 0 0 0-12.4zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.4-11.8a1.4 1.4 0 1 0 0 2.8 1.4 1.4 0 0 0 0-2.8z" />
    </svg>
  );
}

function YouTubeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
      <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.6 3.5 12 3.5 12 3.5s-7.6 0-9.4.6A3 3 0 0 0 .5 6.2 31.5 31.5 0 0 0 0 12c0 2.1.2 4.2.5 5.8a3 3 0 0 0 2.1 2.1c1.8.6 9.4.6 9.4.6s7.6 0 9.4-.6a3 3 0 0 0 2.1-2.1c.3-1.6.5-3.7.5-5.8 0-2.1-.2-4.2-.5-5.8zM9.5 15.5v-7l6.3 3.5-6.3 3.5z" />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
      <path d="M19.6 9.5c-1.8 0-3.4-.7-4.6-1.9v8.7c0 4.4-3.6 8-8 8s-8-3.6-8-8 3.6-8 8-8c.2 0 .4 0 .6 0v4.4c-.2 0-.4 0-.6 0-2 0-3.6 1.6-3.6 3.6s1.6 3.6 3.6 3.6 3.6-1.6 3.6-3.6V0h4.3c0 .4.1.8.2 1.2.5 2.1 2.3 3.7 4.5 3.9v4.4z" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
      <path d="M17.5 14.4l-2-.7c-.3-.1-.5 0-.7.2l-.9.9c-.1.1-.3.2-.5.1-1.2-.4-2.2-1-3.1-1.9s-1.5-1.9-1.9-3.1c-.1-.2 0-.4.1-.5l.9-.9c.2-.2.3-.4.2-.7l-.7-2c-.1-.3-.4-.4-.7-.3-.6.2-1.1.5-1.5 1-.4.5-.6 1.1-.5 1.7.1 1.3.6 2.5 1.4 3.6 1 1.4 2.4 2.5 4 3.2 1.1.5 2.4.7 3.6.4.6-.1 1.2-.4 1.7-.9.5-.4.8-.9 1-1.5.1-.3 0-.6-.3-.7zM12 0C5.4 0 0 5.4 0 12c0 2.1.5 4.1 1.5 5.9L.1 23.4l5.8-1.5C7.8 23 9.9 24 12 24c6.6 0 12-5.4 12-12S18.6 0 12 0zm0 22c-1.8 0-3.6-.5-5.2-1.4l-.4-.2-3.7 1 1-3.6-.2-.4C2.6 15.6 2 13.8 2 12c0-5.5 4.5-10 10-10s10 4.5 10 10-4.5 10-10 10z" />
    </svg>
  );
}

// Payment Method Icon Components
function BkashIcon() {
  return (
    <div className="flex h-10 items-center justify-center rounded-lg bg-pink-600 px-3 text-xs font-bold text-white">
      bKash
    </div>
  );
}

function NagadIcon() {
  return (
    <div className="flex h-10 items-center justify-center rounded-lg bg-orange-600 px-3 text-xs font-bold text-white">
      Nagad
    </div>
  );
}

function RocketIcon() {
  return (
    <div className="flex h-10 items-center justify-center rounded-lg bg-purple-700 px-3 text-xs font-bold text-white">
      Rocket
    </div>
  );
}

function VisaIcon() {
  return (
    <div className="flex h-10 items-center justify-center rounded-lg bg-blue-700 px-3 text-xs font-bold text-white">
      VISA
    </div>
  );
}

function MasterCardIcon() {
  return (
    <div className="flex h-10 items-center justify-center rounded-lg bg-gradient-to-r from-red-600 to-orange-500 px-3 text-xs font-bold text-white">
      Mastercard
    </div>
  );
}

function PayPalIcon() {
  return (
    <div className="flex h-10 items-center justify-center rounded-lg bg-blue-600 px-3 text-xs font-bold text-white">
      PayPal
    </div>
  );
}

function StripeIcon() {
  return (
    <div className="flex h-10 items-center justify-center rounded-lg bg-indigo-600 px-3 text-xs font-bold text-white">
      Stripe
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
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-blue-400 transition hover:bg-white/20"
                  aria-label="Facebook"
                  title="Facebook"
                >
                  <FacebookIcon />
                </a>
                <a
                  href="#"
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-pink-400 transition hover:bg-white/20"
                  aria-label="Instagram"
                  title="Instagram"
                >
                  <InstagramIcon />
                </a>
                <a
                  href="#"
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-red-400 transition hover:bg-white/20"
                  aria-label="YouTube"
                  title="YouTube"
                >
                  <YouTubeIcon />
                </a>
                <a
                  href="#"
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition hover:bg-white/20"
                  aria-label="TikTok"
                  title="TikTok"
                >
                  <TikTokIcon />
                </a>
                <a
                  href="https://wa.me/8801811314262"
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-green-400 transition hover:bg-white/20"
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
            <div className="mt-3 flex flex-wrap gap-2">
              <BkashIcon />
              <NagadIcon />
              <RocketIcon />
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              <VisaIcon />
              <MasterCardIcon />
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              <PayPalIcon />
              <StripeIcon />
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
