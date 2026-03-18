import { CartItem } from "@/types";

export const CART_KEY = "clothify-cart";
export const CART_UPDATED_EVENT = "clothfy-cart-updated";
export const CART_ITEM_ADDED_EVENT = "clothfy-cart-item-added";

function emitCartUpdated() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(CART_UPDATED_EVENT));
}

function emitCartItemAdded(item: CartItem) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent(CART_ITEM_ADDED_EVENT, {
      detail: {
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        selectedSize: item.selectedSize,
      },
    })
  );
}

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
  emitCartUpdated();
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
  emitCartItemAdded(item);
}

export function clearCart() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(CART_KEY);
  emitCartUpdated();
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
