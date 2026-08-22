import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import GlobalLoaderProvider from "@/components/global-loader-provider";

import ScrollToTop from "@/components/scroll-to-top";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "VerspeKtive",
  description: "Premium storytelling, from studio to screen.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth" className="w-full h-full">
      <body
        className={`${inter.variable} ${outfit.variable} antialiased min-h-screen w-full h-full bg-background text-foreground`}
      >
        <GlobalLoaderProvider>
          <div className="flex flex-col min-h-screen w-full">
            <ScrollToTop />
            <Navbar />
            <main className="flex-grow flex flex-col w-full">{children}</main>
            <Footer />
          </div>
        </GlobalLoaderProvider>
      </body>
    </html>
  );
}
