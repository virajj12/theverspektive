"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatedTabs } from "@/components/ui/animated-tabs";

const MAIN_TABS = [
  { label: "TIO Originals", href: "/productions/tio-originals" },
  { label: "VerspeKtive Studios", href: "/productions/verspektive-studios" },
];

const TIO_TABS = [
  { label: "Talk it out", href: "#talk-it-out", grouped: true },
  { label: "Taste it out", href: "#taste-it-out", grouped: true },
];

const STUDIOS_TABS = [
  { label: "VerspeKtive Studios", href: "/productions/verspektive-studios", className: "w-[120px]" },
];

export function ProductionsTabs() {
  const pathname = usePathname();
  const [activeHash, setActiveHash] = useState("");

  useEffect(() => {
    // Check initial hash on mount
    if (typeof window !== "undefined") {
      setActiveHash(window.location.hash || "#talk-it-out");
      
      const handleHashChange = (e: Event) => {
        if (e.type === "updateActiveHash") {
          setActiveHash((e as CustomEvent).detail);
        } else {
          setActiveHash(window.location.hash || "#talk-it-out");
        }
      };

      window.addEventListener("hashchange", handleHashChange);
      window.addEventListener("updateActiveHash", handleHashChange);
      return () => {
        window.removeEventListener("hashchange", handleHashChange);
        window.removeEventListener("updateActiveHash", handleHashChange);
      };
    }
  }, []);

  if (pathname === "/productions/tio-originals") {
    return <AnimatedTabs tabs={TIO_TABS} backHref="/productions" activeTabOverride={activeHash} />;
  }

  if (pathname === "/productions/verspektive-studios") {
    return <AnimatedTabs tabs={STUDIOS_TABS} backHref="/productions" />;
  }

  return <AnimatedTabs tabs={MAIN_TABS} backHref="/productions" />;
}
