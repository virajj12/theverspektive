import { getUserSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CreditCard } from "lucide-react";

export const runtime = 'edge';

export default async function PaymentsPage() {
  const session = await getUserSession();

  if (!session.isLoggedIn || !session.userId) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pt-32 pb-24 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-8">
          <Link href="/account" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
          </Link>
          <h1 className="text-4xl font-bold tracking-tight mb-2">Payment Methods</h1>
          <p className="text-muted-foreground text-lg">Manage your saved cards and payment options.</p>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-[28px] border border-zinc-200 dark:border-white/10 overflow-hidden shadow-sm p-12 text-center flex flex-col items-center justify-center">
          <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-6">
            <CreditCard className="w-8 h-8 text-zinc-400" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No saved payment methods</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Payment methods will be saved automatically when you securely check out using Razorpay.
          </p>
          <Link href="/studios" className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 h-10 px-8">
            Explore Studios
          </Link>
        </div>
      </div>
    </div>
  );
}
