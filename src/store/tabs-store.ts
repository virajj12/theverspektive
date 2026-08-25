import { create } from 'zustand';

interface TabsStore {
  playlists: any[];
  setPlaylists: (playlists: any[]) => void;
}

export const useTabsStore = create<TabsStore>((set) => ({
  playlists: [],
  setPlaylists: (playlists) => set({ playlists }),
}));
