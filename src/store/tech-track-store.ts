import { create } from 'zustand';

/**
 * Audience track for the /tech page.
 *
 * Spec 4.2: the visitor picks a track, and that selection drives what 4.3 shows
 * rather than the fork being duplicated further down the page. The same value
 * also drives the two states of the 3D V-mark in the hero (spec 5), which is
 * why this lives in a store rather than local state in the split section.
 *
 * `null` = nothing chosen yet (hero shows the V-mark at rest, 4.3 shows both
 * tracks side by side so a scroller who never clicks still sees everything).
 */
export type TechTrack = 'business' | 'personal';

interface TechTrackStore {
  track: TechTrack | null;
  /** True once the visitor has actively chosen, vs. the resting default. */
  hasChosen: boolean;
  setTrack: (track: TechTrack) => void;
  clearTrack: () => void;
}

export const useTechTrackStore = create<TechTrackStore>((set) => ({
  track: null,
  hasChosen: false,
  setTrack: (track) => set({ track, hasChosen: true }),
  clearTrack: () => set({ track: null, hasChosen: false }),
}));
