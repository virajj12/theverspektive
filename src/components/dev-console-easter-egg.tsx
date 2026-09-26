"use client";

import { useEffect } from "react";

// Track if it has logged during this page load to prevent double-logs in React Strict Mode
let hasLoggedThisLoad = false;

export default function DevConsoleEasterEgg() {
  useEffect(() => {
    if (typeof window !== "undefined" && !hasLoggedThisLoad) {
      hasLoggedThisLoad = true;
      // Small timeout to ensure it logs after other noisy Next.js dev logs
      setTimeout(() => {
        console.log(
          "%cHold up! 🛑%c\n\nSo you're the type to pop open the dev tools on a new site, huh?\nWe knew you'd be looking here! 👀\n\nSince you're here, you clearly appreciate good tech. Welcome to VerspeKtive.",
          "font-size: 24px; font-weight: bold; color: #ef4444; font-family: sans-serif;",
          "font-size: 14px; font-family: monospace; color: #10b981; line-height: 1.6; margin-top: 10px;"
        );
        
        console.log(
          "%cIf you like what you see, maybe we should build something together. 🚀\n%c👉 https://verspektive.in/tech",
          "font-size: 14px; font-weight: bold; background: linear-gradient(to right, #3b82f6, #9333ea); color: white; padding: 6px 10px; border-radius: 6px; margin-top: 10px;",
          "font-size: 14px; font-weight: bold; color: #3b82f6; margin-top: 8px; display: block;"
        );
      }, 500);
    }
  }, []);

  return null;
}
