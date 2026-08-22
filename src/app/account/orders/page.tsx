import { getUserSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getRequestContext } from "@cloudflare/next-on-pages";
import { drizzle } from "drizzle-orm/d1";
import { orders } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import Link from "next/link";
import { ArrowLeft, Package, Clock, CheckCircle2, XCircle } from "lucide-react";
import clsx from "clsx";

export const runtime = 'edge';

export default async function OrdersPage() {
  const session = await getUserSession();

  if (!session.isLoggedIn || !session.userId) {
    redirect("/login");
  }

  const env = getRequestContext().env;
  const db = drizzle(env.DB);
  
  const userOrders = await db.select()
    .from(orders)
    .where(eq(orders.user_id, session.userId))
    .orderBy(desc(orders.created_at))
    .all();

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pt-32 pb-24 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-8">
          <Link href="/account" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
          </Link>
          <h1 className="text-4xl font-bold tracking-tight mb-2">Order History</h1>
          <p className="text-muted-foreground text-lg">Track and manage your past purchases and rentals.</p>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-[28px] border border-zinc-200 dark:border-white/10 overflow-hidden shadow-sm">
          {userOrders.length === 0 ? (
            <div className="p-12 text-center flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-6">
                <Package className="w-8 h-8 text-zinc-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No orders yet</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                When you rent a studio or purchase an add-on, it will appear here.
              </p>
              <Link href="/studios" className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 h-10 px-8">
                Explore Studios
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {userOrders.map((order) => {
                const date = new Date(order.created_at).toLocaleDateString("en-US", {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                });
                
                return (
                  <div key={order.id} className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-zinc-50/50 dark:hover:bg-white/[0.02] transition-colors">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-zinc-100 dark:bg-zinc-800 rounded-xl flex items-center justify-center shrink-0 mt-1">
                        <Package className="w-6 h-6 text-foreground" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{order.title}</h3>
                        <p className="text-sm text-muted-foreground mb-3">Ordered on {date}</p>
                        <div className="flex items-center gap-2">
                          <span className={clsx(
                            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium",
                            order.status === 'paid' && "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
                            order.status === 'pending' && "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
                            order.status === 'cancelled' && "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                          )}>
                            {order.status === 'paid' && <CheckCircle2 className="w-3.5 h-3.5" />}
                            {order.status === 'pending' && <Clock className="w-3.5 h-3.5" />}
                            {order.status === 'cancelled' && <XCircle className="w-3.5 h-3.5" />}
                            <span className="capitalize">{order.status}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center border-t border-zinc-100 dark:border-zinc-800 md:border-0 pt-4 md:pt-0">
                      <div className="text-sm text-muted-foreground mb-1 md:block hidden">Total Amount</div>
                      <div className="text-xl font-semibold">₹{(order.total_amount / 100).toLocaleString('en-IN')}</div>
                      <button className="md:mt-3 text-sm font-medium underline underline-offset-4 hover:text-muted-foreground transition-colors">
                        View Details
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
