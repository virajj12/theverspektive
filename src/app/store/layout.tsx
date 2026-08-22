import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "VerspeKtive Store",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
