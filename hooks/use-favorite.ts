import { create } from "zustand";
import { get as fetchAll, store, TFavoriteProduct } from "@/services/favorites";
import { AxiosError } from 'axios';

interface FavoriteState {
  favorites: TFavoriteProduct[];
  fetch: () => Promise<void>;
  toggle: (productId: string) => Promise<void>;
}
 
export const useFavoriteStore = create<FavoriteState>((set, get) => ({
  favorites: [],

  fetch: async () => {
    try {
      const response = await fetchAll();
      set({ favorites: response.data });
    } catch (error: unknown) {
      if(error instanceof AxiosError) {
        console.log('500. Unknown error');
      }
    }
  },

  toggle: async (productId) => {
    try {
      const response = (await store(productId)).data;
      const isAlreadyFavorite = get().favorites.some((fav) => fav.product_id === productId);

      set({
        favorites: isAlreadyFavorite
          ? get().favorites.filter((fav) => fav.product_id !== productId)
          : [...get().favorites, response],
      });
    } catch (error: unknown) {
      if(error instanceof AxiosError) {
        console.log('500. Unknown error');
      }
    }
  },
}))
