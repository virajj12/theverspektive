import { getUserSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getRequestContext } from "@cloudflare/next-on-pages";
import { drizzle } from "drizzle-orm/d1";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import SettingsForm from "./settings-form";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const runtime = 'edge';

export default async function SettingsPage() {
  const session = await getUserSession();

  if (!session.isLoggedIn || !session.userId || !session.email) {
    redirect("/login");
  }

  const env = getRequestContext().env;
  const db = drizzle(env.DB);
  
  const user = await db.select().from(users).where(eq(users.id, session.userId)).get();
  
  if (!user || user.session_version !== session.sessionVersion) {
    session.destroy();
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pt-32 pb-24 px-4">
      <div className="container mx-auto max-w-3xl">
        <div className="mb-8">
          <Link href="/account" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
          </Link>
          <h1 className="text-4xl font-bold tracking-tight mb-2">Account Settings</h1>
          <p className="text-muted-foreground text-lg">Update your personal information and preferences.</p>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-[28px] border border-zinc-200 dark:border-white/10 overflow-hidden shadow-sm">
          <div className="p-8 border-b border-zinc-200 dark:border-zinc-800">
            <h2 className="text-2xl font-bold">Profile Information</h2>
          </div>
          <div className="p-8">
            <SettingsForm 
              initialFirstName={user.first_name} 
              initialLastName={user.last_name} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}
