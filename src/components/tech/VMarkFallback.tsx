"use client";

/**
 * Static, WebGL-free stand-in for the 3D V-mark (spec 5 mobile fallback,
 * and acceptance criterion "a defined 3D fallback on mobile").
 *
 * Same geometry as VMarkScene, taken from the same source of truth, so the
 * silhouette is identical — a phone gets the mark and the brand-blue rim, just
 * without the volume, the lighting model or the ~450KB of three.js.
 *
 * It still honours the audience selection: the two halves ease apart, one
 * squaring off and one loosening, which is the flat read of the same idea.
 */

import { useTechTrackStore } from "@/store/tech-track-store";

// Points lifted from public/VB-01.svg with its group transform applied.
const TOP_LEFT = "178.288,178.288";
const TOP_RIGHT = "821.712,178.288";
const TOP_MID = "500,178.288";
const APEX = "500,821.712";

export default function VMarkFallback() {
  const track = useTechTrackStore((s) => s.track);

  return (
    <div className="relative flex h-full w-full items-center justify-center" aria-hidden="true">
      {/* Ambient bloom behind the mark, in the brand accent. */}
      <div
        className="pointer-events-none absolute h-[62%] w-[62%] rounded-full opacity-40 blur-[80px]"
        style={{ background: "radial-gradient(circle, #2997ff 0%, transparent 70%)" }}
      />
      <svg
        viewBox="0 0 1000 1000"
        className="relative h-[68%] w-[68%] max-h-[420px] max-w-[420px]"
      >
        <defs>
          <linearGradient id="vm-obsidian" x1="0" y1="0" x2="0.6" y2="1">
            <stop offset="0%" stopColor="#242428" />
            <stop offset="55%" stopColor="#0f0f11" />
            <stop offset="100%" stopColor="#050506" />
          </linearGradient>
          <linearGradient id="vm-rim" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#2997ff" stopOpacity="0.95" />
            <stop offset="60%" stopColor="#2997ff" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#2997ff" stopOpacity="0.7" />
          </linearGradient>
        </defs>

        {/* Left half — loosens on "personal brands". */}
        <g
          className="transition-transform duration-700 ease-out"
          style={{
            transform:
              track === "personal" ? "translate(-34px, 16px) rotate(-3deg)" : "none",
            transformOrigin: "center",
          }}
        >
          <polygon
            points={`${TOP_LEFT} ${TOP_MID} ${APEX}`}
            fill="url(#vm-obsidian)"
            stroke="url(#vm-rim)"
            strokeWidth="3"
          />
        </g>

        {/* Right half — squares up on "businesses". */}
        <g
          className="transition-transform duration-700 ease-out"
          style={{
            transform: track === "business" ? "translate(16px, -8px)" : "none",
            transformOrigin: "center",
          }}
        >
          {track === "business" ? (
            <rect
              x="500"
              y="178.288"
              width="276"
              height="553"
              fill="url(#vm-obsidian)"
              stroke="url(#vm-rim)"
              strokeWidth="3"
            />
          ) : (
            <polygon
              points={`${TOP_MID} ${TOP_RIGHT} ${APEX}`}
              fill="url(#vm-obsidian)"
              stroke="url(#vm-rim)"
              strokeWidth="3"
            />
          )}
        </g>
      </svg>
    </div>
  );
}
