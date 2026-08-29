import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./g3-theme.css";
import G3Nav from "@/components/g3/G3Nav";
import G3Footer from "@/components/g3/G3Footer";
import StickyMobileCTA from "@/components/g3/StickyMobileCTA";

/**
 * Technical accent face for project metadata — "SQ FT — 4,200" (spec 3).
 * Imported here rather than in the root layout so the other VerspeKtive
 * routes never pay for a font only G3 uses.
 *
 * display: "swap" plus an explicit fallback keeps this off the CLS budget
 * in spec 6/7.
 */
const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-jetbrains-mono",
  display: "swap",
  fallback: ["ui-monospace", "SFMono-Regular", "monospace"],
});

export const metadata: Metadata = {
  title: {
    default: "G3 Builders & Architecture",
    template: "%s · G3 Builders & Architecture",
  },
  description:
    "Architecture, interiors and construction delivered end to end. Residential and commercial projects across coastal Karnataka.",
  openGraph: {
    title: "G3 Builders & Architecture",
    description: "Architecture, interiors and construction delivered end to end.",
    type: "website",
  },
};

/**
 * LocalBusiness structured data (spec 7). Rendered once in the layout so it is
 * present on every G3 page without each page re-declaring it.
 */
const LOCAL_BUSINESS = {
  "@context": "https://schema.org",
  "@type": "GeneralContractor",
  name: "G3 Builders & Architecture",
  description: "Architecture, interiors and construction delivered end to end.",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Moodbidri",
    addressRegion: "Karnataka",
    addressCountry: "IN",
  },
  telephone: "+91-98800-00000",
  email: "verspektive@gmail.com",
  parentOrganization: { "@type": "Organization", name: "VerspeKtive" },
};

export default function G3Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`g3-theme g3-grain ${jetbrains.variable}`}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(LOCAL_BUSINESS) }}
      />
      <G3Nav />
      {/* Bottom padding clears the sticky mobile CTA bar so it never covers
          content — spec 6 requires it stay reachable AND non-obscuring. */}
      <main className="pb-20 md:pb-0">{children}</main>
      <G3Footer />
      <StickyMobileCTA />
    </div>
  );
}
