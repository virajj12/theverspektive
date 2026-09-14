"use client";

import React, { useEffect, useState } from "react";

export default function Loader({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<"animating" | "logo-fading" | "fading-out">("animating");

  useEffect(() => {
    // Start logo fade out after 600ms
    const logoFadeOutTimer = setTimeout(() => {
      setPhase("logo-fading");
    }, 600);

    // Start background fade out after logo has faded (600ms + 400ms)
    const backgroundFadeOutTimer = setTimeout(() => {
      setPhase("fading-out");
    }, 1000);

    // Completely unmount after background fades out (1000ms + 600ms)
    const removeTimer = setTimeout(() => {
      onComplete();
    }, 1600);

    return () => {
      clearTimeout(logoFadeOutTimer);
      clearTimeout(backgroundFadeOutTimer);
      clearTimeout(removeTimer);
    };
  }, [onComplete]);

  return (
    <>
      <style>
        {`
          @keyframes continuousGrowAndFadeIn {
            0% {
              transform: scale(0.4);
              opacity: 0;
            }
            20% {
              opacity: 1; /* Fade in completes quickly */
            }
            100% {
              transform: scale(1.0);
              opacity: 1;
            }
          }
          
          .logo-continuous-anim {
            animation: continuousGrowAndFadeIn 2s linear forwards;
          }
        `}
      </style>
      {/* Background Layer */}
      <div
        className={`fixed inset-0 z-[99] bg-black pointer-events-none transition-opacity duration-1000 ease-in-out ${
          phase === "fading-out" ? "opacity-0" : "opacity-100"
        }`}
      />
      
      {/* Logo Layer */}
      <div
        className={`fixed inset-0 z-[100] flex items-center justify-center pointer-events-none transition-opacity duration-500 ease-in-out ${
          phase === "logo-fading" || phase === "fading-out" ? "opacity-0" : "opacity-100"
        }`}
      >
        <div className="relative h-20 w-20 sm:h-24 sm:w-24 md:h-32 md:w-32 lg:h-40 lg:w-40 flex-shrink-0 logo-continuous-anim">
          <img
            src="/VB-01.png"
            alt="VerspeKtive Logo"
            className="h-full w-full object-contain"
          />
        </div>
      </div>
    </>
  );
}
