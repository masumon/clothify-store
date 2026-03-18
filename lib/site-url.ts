const MAIN_SITE_URL = "https://clothify-store-main.vercel.app";

function normalize(url: string) {
  return url.trim().replace(/\/+$/, "");
}

export function resolvePublicSiteUrl(rawUrl?: string | null) {
  const candidate = normalize(rawUrl || "");
  if (!candidate) {
    return MAIN_SITE_URL;
  }

  if (candidate.includes("clothify-store-coral.vercel.app")) {
    return MAIN_SITE_URL;
  }

  return candidate;
}
