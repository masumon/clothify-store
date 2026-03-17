export type Currency = "BDT" | "USD";

const STORAGE_KEY = "clothfy-currency";

// Approximate rate: 1 USD ≈ 110 BDT (update as needed)
const BDT_TO_USD = 1 / 110;

export function getSavedCurrency(): Currency {
  if (typeof window === "undefined") return "BDT";
  return localStorage.getItem(STORAGE_KEY) === "USD" ? "USD" : "BDT";
}

export function saveCurrency(currency: Currency): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, currency);
  window.dispatchEvent(new Event("clothfy-preferences-change"));
}

export function formatPrice(bdt: number, currency: Currency): string {
  if (currency === "USD") {
    return `$${(bdt * BDT_TO_USD).toFixed(2)}`;
  }
  return `৳${bdt.toLocaleString("en-BD")}`;
}
