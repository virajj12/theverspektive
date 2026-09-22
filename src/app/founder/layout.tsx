import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vikhil V Salian - Founder | VerspeKtive",
  description:
    "Vikhil V Salian is the Managing Director of G3 Builders & Architects, Founder of VerspeKtive Productions, and Host of TIO Originals. Architect, Filmmaker, Visionary.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
