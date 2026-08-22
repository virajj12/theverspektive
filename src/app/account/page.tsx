import { getUserSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { LogOut, Settings, CreditCard, Package } from "lucide-react";
import { getRequestContext } from "@cloudflare/next-on-pages";
import { drizzle } from "drizzle-orm/d1";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import LogoutButton from "./logout-button";
import Link from "next/link";

export const runtime = 'edge';

export default async function AccountPage() {
  const session = await getUserSession();

  if (!session.isLoggedIn || !session.userId || !session.email) {
    redirect("/login");
  }

  const env = getRequestContext().env;
  const db = drizzle(env.DB);
  
  const user = await db.select().from(users).where(eq(users.id, session.userId)).get();
  
  // Verify session version matches database
  if (!user || user.session_version !== session.sessionVersion) {
    session.destroy();
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pt-32 pb-24 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl font-bold tracking-tight mb-2">My Account</h1>
            <p className="text-muted-foreground text-lg">Welcome back, {user.first_name}</p>
          </div>
          <div className="mt-6 md:mt-0">
            <LogoutButton />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white dark:bg-zinc-900 p-8 rounded-[24px] border border-zinc-200 dark:border-white/10 shadow-sm flex flex-col">
            <div className="w-12 h-12 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-6">
              <Package className="w-6 h-6 text-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Orders</h3>
            <p className="text-muted-foreground mb-6 flex-grow">Track and manage your past purchases.</p>
            <Link href="/account/orders" className="text-left font-medium underline underline-offset-4 hover:text-muted-foreground transition-colors">
              View orders
            </Link>
          </div>
          
          <div className="bg-white dark:bg-zinc-900 p-8 rounded-[24px] border border-zinc-200 dark:border-white/10 shadow-sm flex flex-col">
            <div className="w-12 h-12 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-6">
              <CreditCard className="w-6 h-6 text-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Payment Methods</h3>
            <p className="text-muted-foreground mb-6 flex-grow">Manage your saved cards and payment options.</p>
            <Link href="/account/payments" className="text-left font-medium underline underline-offset-4 hover:text-muted-foreground transition-colors">
              Manage payments
            </Link>
          </div>

          <div className="bg-white dark:bg-zinc-900 p-8 rounded-[24px] border border-zinc-200 dark:border-white/10 shadow-sm flex flex-col">
            <div className="w-12 h-12 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-6">
              <Settings className="w-6 h-6 text-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Settings</h3>
            <p className="text-muted-foreground mb-6 flex-grow">Update your personal information and preferences.</p>
            <Link href="/account/settings" className="text-left font-medium underline underline-offset-4 hover:text-muted-foreground transition-colors">
              Account settings
            </Link>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-[28px] border border-zinc-200 dark:border-white/10 overflow-hidden shadow-sm">
          <div className="p-8 border-b border-zinc-200 dark:border-zinc-800">
            <h2 className="text-2xl font-bold">Profile Information</h2>
          </div>
          <div className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-muted-foreground mb-1">First Name</p>
                <p className="font-medium text-lg">{user.first_name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Last Name</p>
                <p className="font-medium text-lg">{user.last_name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Email Address</p>
                <p className="font-medium text-lg flex items-center gap-2">
                  {user.email}
                  {user.email_verified && (
                    <span className="text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-2 py-1 rounded-full font-semibold">
                      Verified
                    </span>
                  )}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Account Created</p>
                <p className="font-medium text-lg">
                  {new Date(user.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
