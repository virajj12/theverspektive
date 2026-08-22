"use client";

import Link from "next/link";
import { ArrowLeft, Mail } from "lucide-react";
import MaskText from "@/components/MaskText";
import { ContactEmailDropdown } from "@/components/ContactEmailDropdown";

export default function Store() {
  return (
    <div className="flex flex-col min-h-screen pt-24 bg-background items-center justify-center">
      <div className="container mx-auto px-6 md:px-12 py-12 md:py-24 max-w-[800px] text-center">
        
        <MaskText text="VerspeKtive" className="text-4xl md:text-6xl font-bold tracking-tight mb-8 justify-center" />
        
        <div className="bg-zinc-100 dark:bg-zinc-900 rounded-[32px] p-12 md:p-24 border border-zinc-200 dark:border-white/10 mb-12 shadow-xl shadow-black/5 dark:shadow-none">
          <MaskText text="Coming Soon" className="text-3xl font-semibold mb-6 justify-center" />
          <MaskText 
            text="This page is currently under construction. Reach out to us for any inquiries regarding the Store."
            className="text-xl text-muted-foreground mb-10 max-w-lg mx-auto leading-relaxed justify-center block text-center"
          />
          <ContactEmailDropdown 
            email="verspektive@gmail.com"
            className="inline-flex items-center justify-center gap-2 bg-foreground text-background px-8 py-4 rounded-full font-semibold text-lg transition-transform hover:scale-105"
          >
            <Mail className="w-5 h-5" />
            verspektive@gmail.com
          </ContactEmailDropdown>
        </div>

        <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground font-medium transition-colors">
          <ArrowLeft className="w-5 h-5" /> Back to Home
        </Link>
      </div>
    </div>
  );
}
