import { create } from "zustand";
import { useEffect } from "react";

export interface TCartItem {
  id:               number;
  slug:             string;
  product_id:       string;
  image:            string;
  name:             string;
  article:          string;
  size_id?:         string;
  size_eu?:         string;
  size_cm?:         string;
  price:            number;
  disconted_price?: number | null;
  quantity:         number;
}

interface TCartState {
  items:          TCartItem[];
  addToCart:      (data: TCartItem) => void;
  removeFromCart: (id: number) => void;
  updateCart:     (id: number, quantity: number) => void;
  clearCart:      () => void;
  loadCart:       () => void;
}

export const useCartStore = create<TCartState>((set, get) => ({
  items: [], 

  addToCart: (data) => {
    set((state) => {
      const existingItemIndex = state.items.findIndex(
        (item) => item.product_id === data.product_id && item.size_id === data.size_id
      );
  
      let updatedCart;
  
      if (existingItemIndex !== -1) {
        // Якщо товар є, збільшуємо кількість
        updatedCart = state.items.map((item, index) =>
          index === existingItemIndex ? { ...item, quantity: item.quantity + data.quantity } : item
        );
      } else {
        // Якщо товару немає, додаємо новий елемент
        const newItem: TCartItem = {
          id: Number(`${data.product_id}${data.size_id}`),
          slug:             data.slug,
          product_id:       data.product_id,
          image:            data.image,
          name:             data.name,
          article:          data.article,
          size_id:          data.size_id,
          size_eu:          data.size_eu,
          size_cm:          data.size_cm,
          price:            data.price,
          disconted_price:  data.disconted_price,
          quantity:         data.quantity,
        };
  
        updatedCart = [...state.items, newItem];
      }
  
      if (typeof window !== "undefined") {
        localStorage.setItem("cart", JSON.stringify(updatedCart));
      }
  
      return { items: updatedCart };
    });
  },

  updateCart: (id, quantity) => {
    set((state) => {
      const updatedCart = state.items.map((item) =>
        item.id === id ? { ...item, quantity } : item
      );
      if (typeof window !== "undefined") {
        localStorage.setItem("cart", JSON.stringify(updatedCart));
      }
      return { items: updatedCart };
    });
  },

  removeFromCart: (id) => {
    set((state) => {
      const updatedCart = state.items.filter((item) => item.id !== id);
      if (typeof window !== "undefined") {
        localStorage.setItem("cart", JSON.stringify(updatedCart));
      }
      return { items: updatedCart };
    });
  },

  clearCart: () => {
    set(() => {
      if (typeof window !== "undefined") {
        localStorage.setItem("cart", JSON.stringify([]));
      }
      return { items: [] };
    });
  },

  loadCart: () => {
    if (typeof window !== "undefined") {
      const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
      set({ items: savedCart });
    }
  },
}));

// Використання `useEffect` для завантаження `cart` при завантаженні сторінки
export function useCartLoader() {
  const loadCart = useCartStore((state) => state.loadCart);

  useEffect(() => {
    loadCart();
  }, [loadCart]);
}
