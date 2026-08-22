import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "G3 Builders & Architectures",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
