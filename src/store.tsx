// store.ts
import { create } from "zustand";

interface SearchStore {
  searchTerm: string;
  confirmedSearch: string;
  selectedLocationId: number | null;
  setSearchTerm: (value: string) => void;
  setConfirmedSearch: (value: string) => void;
  setSelectedLocationId: (value: number | null) => void;
}

export const useSearchStore = create<SearchStore>((set) => ({
  searchTerm: "",
  confirmedSearch: "",
  selectedLocationId: null,
  setSearchTerm: (value: string) => set({ searchTerm: value }),
  setConfirmedSearch: (value: string) => set({ confirmedSearch: value }),
  setSelectedLocationId: (value: number | null) =>
    set({ selectedLocationId: value }),
}));
