import type { Metadata } from "next";
import { ProductionsTabs } from "@/components/productions-tabs";
import { ProductionsBackButton } from "@/components/productions-back-button";

export const metadata: Metadata = {
  title: "VerspeKtive Productions",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-black text-white">
      <style dangerouslySetInnerHTML={{ __html: `html, body { background-color: black !important; }` }} />
      <ProductionsBackButton />
      {children}
      <ProductionsTabs />
    </div>
  );
}
