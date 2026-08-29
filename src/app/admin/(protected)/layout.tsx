import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LogOut, Settings, Building2, Image as ImageIcon, Inbox } from "lucide-react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session.isLoggedIn) {
    redirect("/admin/login");
  }

  return (
    <div className="light" style={{ colorScheme: 'light' }}>
      <div className="min-h-screen bg-zinc-50 text-zinc-900 flex flex-col md:flex-row">
        {/* Sidebar */}
        <aside className="w-full md:w-64 bg-white border-r border-zinc-200 p-6 flex flex-col">
          <div className="flex items-center gap-2 font-bold text-xl mb-12 text-zinc-900">
            <Settings className="w-6 h-6" />
            <span>Admin CMS</span>
          </div>
          
          <nav className="flex-grow space-y-2">
            <Link href="/admin" className="block px-4 py-2 rounded-lg bg-zinc-100 font-medium text-zinc-900">
              Dashboard
            </Link>

            {/* G3 Builders — separate content pillar with its own g3_* tables */}
            <div className="pt-4">
              <p className="px-4 pb-2 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                G3 Builders
              </p>
              <Link href="/admin/g3/projects" className="flex items-center gap-2 px-4 py-2 rounded-lg text-zinc-500 hover:bg-zinc-100 transition-colors">
                <Building2 className="w-4 h-4" /> Projects
              </Link>
              <Link href="/admin/g3/media" className="flex items-center gap-2 px-4 py-2 rounded-lg text-zinc-500 hover:bg-zinc-100 transition-colors">
                <ImageIcon className="w-4 h-4" /> Media Library
              </Link>
              <Link href="/admin/g3/inquiries" className="flex items-center gap-2 px-4 py-2 rounded-lg text-zinc-500 hover:bg-zinc-100 transition-colors">
                <Inbox className="w-4 h-4" /> Enquiries
              </Link>
            </div>

            <div className="pt-4">
              <Link href="/" target="_blank" className="block px-4 py-2 rounded-lg text-zinc-500 hover:bg-zinc-100 transition-colors">
                View Live Site
              </Link>
            </div>
          </nav>

          {/* Logout */}
          <div className="pt-6 border-t border-zinc-200">
            <a href="/admin/login" className="flex items-center gap-2 text-red-500 hover:text-red-600 px-4 py-2 font-medium transition-colors">
              <LogOut className="w-5 h-5" /> Logout
            </a>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 md:p-12 overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
