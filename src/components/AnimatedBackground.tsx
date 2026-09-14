"use client";

import FractalGlass from "./ui/fractal-glass";

export default function AnimatedBackground() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      <FractalGlass />
    </div>
  );
}
