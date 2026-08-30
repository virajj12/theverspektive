"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export function ProductionsBackButton() {
  const pathname = usePathname();

  // Determine back href based on the current path
  let backHref = "";
  if (pathname === "/productions/tio-originals/talk-it-out" || pathname === "/productions/tio-originals/taste-it-out") {
    backHref = "/productions/tio-originals";
  } else if (pathname === "/productions/tio-originals" || pathname === "/productions/verspektive-studios") {
    backHref = "/productions";
  }

  if (!backHref) {
    return null;
  }

  return (
    <div className="fixed top-14 left-4 z-40 md:top-20 md:left-8">
      <Link
        href={backHref}
        className="flex h-10 w-10 items-center justify-center text-white mix-blend-difference transition-transform hover:scale-110"
        aria-label="Go back"
      >
        <ChevronLeft className="h-6 w-6" />
      </Link>
    </div>
  );
}
