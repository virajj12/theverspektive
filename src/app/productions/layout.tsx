import type { Metadata } from "next";
import { ProductionsBackButton } from "@/components/productions-back-button";

export const metadata: Metadata = {
  title: "VerspeKtive Productions",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen w-full overflow-x-clip bg-background text-foreground transition-colors duration-300">
      <ProductionsBackButton />
      {children}
    </div>
  );
}
