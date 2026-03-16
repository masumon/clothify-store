"use client";

import { useEffect } from "react";

function getOrCreateVisitorId() {
  if (typeof window === "undefined") return "";

  const key = "clothify_visitor_id";
  const existing = localStorage.getItem(key);
  if (existing) return existing;

  const generated = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
  localStorage.setItem(key, generated);
  return generated;
}

function readSource() {
  if (typeof window === "undefined") return "Direct";

  const url = new URL(window.location.href);
  const utmSource = url.searchParams.get("utm_source");
  if (utmSource) return utmSource;

  if (document.referrer) {
    try {
      return new URL(document.referrer).hostname;
    } catch {
      return "Referral";
    }
  }

  return "Direct";
}

export default function TrafficTracker() {
  useEffect(() => {
    const visitorId = getOrCreateVisitorId();
    if (!visitorId) return;

    fetch("/api/track-visit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        visitorId,
        path: window.location.pathname,
        source: readSource(),
      }),
    }).catch(() => {
      return;
    });
  }, []);

  return null;
}
