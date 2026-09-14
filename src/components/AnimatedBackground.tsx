"use client";

import { useTheme } from "next-themes";
import FractalGlass from "./ui/fractal-glass";

export default function AnimatedBackground() {
  const { resolvedTheme } = useTheme();

  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      <FractalGlass theme={resolvedTheme === "light" ? "light" : "dark"} />
    </div>
  );
}
