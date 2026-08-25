"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatedTabs } from "@/components/ui/animated-tabs";
import { useTabsStore } from "@/store/tabs-store";

const MAIN_TABS = [
  { id: "tio-originals", label: "TIO Originals", href: "/productions/tio-originals" },
  { id: "verspektive-studios", label: "VerspeKtive Studios", href: "/productions/verspektive-studios" },
];

const STUDIOS_TABS = [
  { id: "verspektive-studios", label: "VerspeKtive Studios", href: "/productions/verspektive-studios" },
];

export function ProductionsTabs() {
  const pathname = usePathname();
  const [activeHash, setActiveHash] = useState("");
  const playlists = useTabsStore(s => s.playlists);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setActiveHash(window.location.hash);
      
      const handleHashChange = (e: Event) => {
        if (e.type === "updateActiveHash") {
          setActiveHash((e as CustomEvent).detail);
        } else {
          setActiveHash(window.location.hash);
        }
      };

      window.addEventListener("hashchange", handleHashChange);
      window.addEventListener("updateActiveHash", handleHashChange);
      return () => {
        window.removeEventListener("hashchange", handleHashChange);
        window.removeEventListener("updateActiveHash", handleHashChange);
      };
    }
  }, [pathname]);

  if (pathname.startsWith("/productions/tio-originals")) {
    const isTalkPage = pathname === "/productions/tio-originals/talk-it-out";
    const isTastePage = pathname === "/productions/tio-originals/taste-it-out";
    
    const tioTabs = [];

    if (isTalkPage) {
      tioTabs.push({ id: "talk-it-out", label: "Talk it out", href: "/productions/tio-originals/talk-it-out", grouped: true });
      playlists.forEach(p => {
        tioTabs.push({ id: `playlist-${p.id}`, label: p.title, href: `#playlist-${p.id}`, grouped: true });
      });
    } else if (isTastePage) {
      tioTabs.push({ id: "taste-it-out", label: "Taste it out", href: "/productions/tio-originals/taste-it-out", iconOnlyWhenActiveBack: true });
    } else {
      tioTabs.push({ id: "tio-originals", label: "TIO Originals", href: "/productions/tio-originals", iconOnlyWhenActiveBack: true });
      tioTabs.push({ id: "talk-it-out", label: "Talk it out", href: "/productions/tio-originals/talk-it-out", grouped: false });
      tioTabs.push({ id: "taste-it-out", label: "Taste it out", href: "/productions/tio-originals/taste-it-out", grouped: false });
    }

    // Determine the active tab ID to pass to AnimatedTabs
    let activeTabId = "";
    if (isTalkPage) {
      // Prioritize hash if it matches a playlist, otherwise default to the talk page route
      activeTabId = tioTabs.find(t => t.href === activeHash)?.href || "/productions/tio-originals/talk-it-out";
    }

    const backHref = isTalkPage || isTastePage ? "/productions/tio-originals" : "/productions";

    return <AnimatedTabs tabs={tioTabs} activeTabOverride={activeTabId} backHref={backHref} />;
  }

  if (pathname === "/productions/verspektive-studios") {
    const studiosTabs = [
      { id: "verspektive-studios", label: "VerspeKtive Studios", href: "/productions/verspektive-studios", iconOnlyWhenActiveBack: true }
    ];
    return <AnimatedTabs tabs={studiosTabs} backHref="/productions" />;
  }

  return <AnimatedTabs tabs={MAIN_TABS} backHref="/productions" />;
}
