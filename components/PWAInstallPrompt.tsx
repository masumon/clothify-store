"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const onBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
    };

    const onInstalled = () => {
      setDeferredPrompt(null);
      setHidden(true);
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    window.addEventListener("appinstalled", onInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const installApp = async () => {
    if (!deferredPrompt) return;

    await deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;

    if (choice.outcome === "accepted") {
      setHidden(true);
    }

    setDeferredPrompt(null);
  };

  if (hidden || !deferredPrompt) return null;

  return (
    <div className="fixed inset-x-3 bottom-3 z-[95] mx-auto w-[min(700px,calc(100%-1.5rem))] rounded-2xl border border-slate-200/90 bg-white/95 p-3 shadow-2xl shadow-slate-900/20 backdrop-blur md:inset-x-auto md:right-4 md:w-[430px]">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <Image
            src="/icons/icon-192.png"
            alt="CLOTHIFY"
            width={36}
            height={36}
            className="mt-0.5 h-9 w-9 rounded-full border border-slate-200 object-cover"
          />
          <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Install App</p>
          <h3 className="text-sm font-extrabold text-slate-900">CLOTHIFY অ্যাপ ইন্সটল করুন</h3>
          <p className="mt-1 text-xs text-slate-600">হোমস্ক্রিন থেকে দ্রুত অর্ডার, ট্র্যাকিং এবং AI সহায়তা নিন।</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setHidden(true)}
            className="rounded-full border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700"
          >
            পরে
          </button>
          <button
            type="button"
            onClick={installApp}
            className="rounded-full bg-slate-900 px-3 py-1.5 text-xs font-bold text-white"
          >
            Install
          </button>
        </div>
      </div>
    </div>
  );
}
