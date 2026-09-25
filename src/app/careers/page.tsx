import type { Metadata } from "next";
import ClientPage from "./client-page";

export const metadata: Metadata = {
  title: "Careers | VerspeKtive",
  description: "Join our team and help us build amazing things.",
};

export default function CareersPage() {
  return <ClientPage />;
}
