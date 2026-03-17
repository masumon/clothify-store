export type WishlistItem = {
  id: string;
  name: string;
  price: number;
  image_url: string;
  category: string;
};

const STORAGE_KEY = "clothfy-wishlist";

export function getWishlist(): WishlistItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as WishlistItem[]) : [];
  } catch {
    return [];
  }
}

export function addToWishlist(item: WishlistItem): void {
  const list = getWishlist();
  if (list.some((i) => i.id === item.id)) return;
  list.push(item);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  window.dispatchEvent(new Event("clothfy-wishlist-change"));
}

export function removeFromWishlist(id: string): void {
  const list = getWishlist().filter((i) => i.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  window.dispatchEvent(new Event("clothfy-wishlist-change"));
}

export function toggleWishlist(item: WishlistItem): boolean {
  if (isInWishlist(item.id)) {
    removeFromWishlist(item.id);
    return false;
  }
  addToWishlist(item);
  return true;
}

export function isInWishlist(id: string): boolean {
  return getWishlist().some((i) => i.id === id);
}

export function getWishlistCount(): number {
  return getWishlist().length;
}
