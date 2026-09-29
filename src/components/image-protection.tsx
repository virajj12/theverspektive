"use client";

import { useEffect } from "react";

export default function ImageProtection() {
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Prevent context menu if the target is an image tag
      if (target && target.tagName === "IMG") {
        e.preventDefault();
      }
    };

    // Use capturing phase to ensure we catch it early
    document.addEventListener("contextmenu", handleContextMenu, true);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu, true);
    };
  }, []);

  return null;
}
