import { CartItem } from "@/types";

export const CART_KEY = "clothify-cart";

export function getCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(CART_KEY);
  if (!data) return [];

  try {
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    localStorage.removeItem(CART_KEY);
    return [];
  }
}

export function saveCart(cart: CartItem[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

export function addToCart(item: CartItem) {
  const cart = getCart();
  const existingIndex = cart.findIndex(
    (cartItem) =>
      cartItem.id === item.id && cartItem.selectedSize === item.selectedSize
  );

  if (existingIndex > -1) {
    cart[existingIndex].quantity += item.quantity;
  } else {
    cart.push(item);
  }

  saveCart(cart);
}

export function clearCart() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(CART_KEY);
}

export function removeCartItem(index: number) {
  const cart = getCart();
  cart.splice(index, 1);
  saveCart(cart);
}

export function updateCartQuantity(index: number, quantity: number) {
  const cart = getCart();
  if (!cart[index]) return;

  cart[index].quantity = quantity < 1 ? 1 : quantity;
  saveCart(cart);
}
