import { create } from "zustand";

interface SearchState {
  open: boolean;
  query: string;
  setQuery: (value: string) => void;
  setOpen: (value: boolean) => void;
  toggle: () => void;
}

export const useSearchState = create<SearchState>((set) => ({
  query: '',
  open: false,

  setOpen: (value) => set({ open: value }),
  setQuery: (value) =>  set({ query: value }),
  toggle: () => set((s) => ({ open: !s.open })),
}))
