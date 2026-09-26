
import type { Metadata, Viewport } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import GlobalLoaderProvider from "@/components/global-loader-provider";
import { ThemeProvider } from "@/components/theme-provider";
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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth" className="w-full">
      <head>
        <link rel="preload" href="/VB-01.png" as="image" />
      </head>
      <body
        suppressHydrationWarning
        className={`${inter.variable} ${outfit.variable} antialiased min-h-screen w-full bg-background text-foreground flex flex-col`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem={true}
          disableTransitionOnChange={false}
        >
          <GlobalLoaderProvider>

            <ScrollToTop />
            <Navbar />
            <main className="relative z-10 bg-background flex-1 w-full flex flex-col">
              {children}
            </main>
            <Footer />
          </GlobalLoaderProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
