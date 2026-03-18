export type Theme = "light" | "dark" | "system";
export type Language = "en" | "bn";
export type TextSize = "normal" | "large";
export type Contrast = "normal" | "high";
export type Motion = "normal" | "reduced";
export type UiMode = "default" | "abo";

export const PREFERENCE_EVENT = "clothfy-preferences-change";
export const PREFERENCE_KEYS = {
  themePrimary: "clothfy-theme",
  themeLegacy: "clothify-theme",
  languagePrimary: "clothfy-lang",
  languageLegacy: "clothify-language",
  uiMode: "clothfy-ui-mode",
  textSize: "clothify-text-size",
  contrast: "clothify-contrast",
  motion: "clothify-motion",
} as const;

export type SitePreferences = {
  theme: Theme;
  language: Language;
  uiMode: UiMode;
  textSize: TextSize;
  contrast: Contrast;
  motion: Motion;
};

export const DEFAULT_SITE_PREFERENCES: SitePreferences = {
  theme: "system",
  language: "bn",
  uiMode: "default",
  textSize: "normal",
  contrast: "normal",
  motion: "normal",
};

function normalizeLanguage(value: string | null | undefined): Language {
  const normalized = (value || "").toLowerCase();
  return normalized === "en" ? "en" : "bn";
}

function normalizeTheme(value: string | null | undefined): Theme {
  if (value === "light" || value === "dark" || value === "system") return value;
  return "system";
}

function normalizeUiMode(value: string | null | undefined): UiMode {
  return value === "abo" ? "abo" : "default";
}

function normalizeTextSize(value: string | null | undefined): TextSize {
  return value === "large" ? "large" : "normal";
}

function normalizeContrast(value: string | null | undefined): Contrast {
  return value === "high" ? "high" : "normal";
}

function normalizeMotion(value: string | null | undefined): Motion {
  return value === "reduced" ? "reduced" : "normal";
}

function getStoredValue(primaryKey: string, legacyKey?: string) {
  if (typeof window === "undefined") return null;
  const primary = localStorage.getItem(primaryKey);
  if (primary) return primary;
  if (!legacyKey) return null;
  return localStorage.getItem(legacyKey);
}

export function readSitePreferences(): SitePreferences {
  if (typeof window === "undefined") return DEFAULT_SITE_PREFERENCES;

  return {
    theme: normalizeTheme(
      getStoredValue(PREFERENCE_KEYS.themePrimary, PREFERENCE_KEYS.themeLegacy)
    ),
    language: normalizeLanguage(
      getStoredValue(PREFERENCE_KEYS.languagePrimary, PREFERENCE_KEYS.languageLegacy)
    ),
    uiMode: normalizeUiMode(getStoredValue(PREFERENCE_KEYS.uiMode)),
    textSize: normalizeTextSize(getStoredValue(PREFERENCE_KEYS.textSize)),
    contrast: normalizeContrast(getStoredValue(PREFERENCE_KEYS.contrast)),
    motion: normalizeMotion(getStoredValue(PREFERENCE_KEYS.motion)),
  };
}

export function resolveTheme(theme: Theme): "light" | "dark" {
  if (theme === "system") {
    if (typeof window === "undefined") return "light";
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  return theme;
}

export function emitPreferenceChange() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(PREFERENCE_EVENT));
}

export function persistSitePreferences(preferences: SitePreferences) {
  if (typeof window === "undefined") return;
  localStorage.setItem(PREFERENCE_KEYS.themePrimary, preferences.theme);
  localStorage.setItem(PREFERENCE_KEYS.themeLegacy, preferences.theme);
  localStorage.setItem(PREFERENCE_KEYS.languagePrimary, preferences.language);
  localStorage.setItem(PREFERENCE_KEYS.languageLegacy, preferences.language);
  localStorage.setItem(PREFERENCE_KEYS.uiMode, preferences.uiMode);
  localStorage.setItem(PREFERENCE_KEYS.textSize, preferences.textSize);
  localStorage.setItem(PREFERENCE_KEYS.contrast, preferences.contrast);
  localStorage.setItem(PREFERENCE_KEYS.motion, preferences.motion);
  document.cookie = `clothfy-lang=${preferences.language}; path=/; max-age=31536000; samesite=lax`;
  document.cookie = `clothfy-theme=${preferences.theme}; path=/; max-age=31536000; samesite=lax`;
  document.cookie = `clothfy-ui-mode=${preferences.uiMode}; path=/; max-age=31536000; samesite=lax`;
}

export function applySitePreferencesToDom(preferences: SitePreferences) {
  if (typeof window === "undefined") return;
  const root = document.documentElement;
  const resolvedTheme = resolveTheme(preferences.theme);

  root.lang = preferences.language;
  root.setAttribute("data-theme", preferences.theme);
  root.classList.toggle("dark-theme", resolvedTheme === "dark");
  root.classList.toggle("dark", resolvedTheme === "dark");
  root.classList.toggle("abo-premium", preferences.uiMode === "abo");
  root.classList.toggle("text-size-large", preferences.textSize === "large");
  root.classList.toggle("high-contrast", preferences.contrast === "high");
  root.classList.toggle("reduce-motion", preferences.motion === "reduced");
}

export function saveAndApplySitePreferences(preferences: SitePreferences) {
  persistSitePreferences(preferences);
  applySitePreferencesToDom(preferences);
  emitPreferenceChange();
}

export function updateSitePreferences(partial: Partial<SitePreferences>) {
  const current = readSitePreferences();
  const next: SitePreferences = {
    theme: normalizeTheme(partial.theme ?? current.theme),
    language: normalizeLanguage(partial.language ?? current.language),
    uiMode: normalizeUiMode(partial.uiMode ?? current.uiMode),
    textSize: normalizeTextSize(partial.textSize ?? current.textSize),
    contrast: normalizeContrast(partial.contrast ?? current.contrast),
    motion: normalizeMotion(partial.motion ?? current.motion),
  };
  saveAndApplySitePreferences(next);
  return next;
}
