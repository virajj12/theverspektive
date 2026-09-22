/**
 * Copy for the /tech page, kept in one place so it reads as a single editorial
 * voice rather than being scattered through JSX.
 *
 * Spec 4.3 asks for "3–4 short lines per track, not icon cards" — hence lines
 * of prose with a lead, not a `{ icon, title, body }` card shape.
 */

import type { TechTrack } from "@/store/tech-track-store";

export interface TrackContent {
  id: TechTrack;
  label: string;
  /** The one-line promise shown on the fork itself (4.2). */
  pitch: string;
  /** Section 4.3 body — 3–4 lines. */
  lines: { lead: string; body: string }[];
}

export const TRACKS: Record<TechTrack, TrackContent> = {
  business: {
    id: "business",
    label: "Businesses",
    pitch: "Systems that hold up when the orders come in.",
    lines: [
      {
        lead: "Websites and applications",
        body: "Built on the same stack we run in production - typed end to end, deployed at the edge, and fast enough that nobody thinks about it.",
      },
      {
        lead: "Booking and e-commerce",
        body: "Carts, availability, payment flows and the unglamorous states around them: failed charges, partial refunds, double-booking, reconciliation.",
      },
      {
        lead: "Backend and infrastructure",
        body: "Schema design, migrations, authentication, rate limiting. The parts that decide whether the thing survives its second year.",
      },
      {
        lead: "Ongoing support",
        body: "We stay on after launch. Someone who already knows the codebase answers when something breaks at an inconvenient hour.",
      },
    ],
  },
  personal: {
    id: "personal",
    label: "Personal brands",
    pitch: "A presence that looks like nobody else's.",
    lines: [
      {
        lead: "Portfolio and brand sites",
        body: "Designed around your actual work rather than a template's idea of it - typography, pacing and restraint doing the talking.",
      },
      {
        lead: "Content-driven pages",
        body: "Writing, video and photography given a structure that holds attention, and an editing workflow you can run without us.",
      },
      {
        lead: "Motion and interaction",
        body: "Scroll-driven sequences, 3D and micro-interaction used where they carry meaning - and left out where they would just be noise.",
      },
    ],
  },
};

/** Spec 4.5 — four-step horizontal sequence. */
export const PROCESS = [
  {
    step: "01",
    title: "Discovery",
    body: "We work out what actually needs building. Often less than the initial brief, occasionally something different from it.",
  },
  {
    step: "02",
    title: "Design",
    body: "Structure and visual language together. You see real screens with real content, not greyboxes with placeholder text.",
  },
  {
    step: "03",
    title: "Build",
    body: "Typed, reviewed, deployed to a live preview from the first week. Progress is something you can click, not a status update.",
  },
  {
    step: "04",
    title: "Launch & support",
    body: "Migration, monitoring and a handover you could act on without us - then we stay reachable anyway.",
  },
];

/** Spec 4.6 — three proof points, quieter than the case study. */
export const CREDIBILITY = [
  {
    title: "Security as a practice",
    body: "Your data is locked down by default. We enforce strict authentication, secure sessions, and proactive threat mitigation—no cut corners.",
  },
  {
    title: "Performance by default",
    body: "Speed isn't an add-on. We write clean, optimized code that loads instantly and runs flawlessly across all devices, never compromising on user experience.",
  },
  {
    title: "A stack we can defend",
    body: "We don't chase experimental trends. We rely on robust, industry-tested technologies that scale predictably and never hold your business back.",
  },
];
