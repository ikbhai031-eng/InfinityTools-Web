
import React from 'react';
import { AdminGuard } from '@/components/auth/AdminGuard';
import { Navbar } from '@/components/layout/Navbar';
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  BarChart3, 
  ShieldCheck, 
  Wrench,
  Globe
} from 'lucide-react';
import Link from 'next/link';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminGuard>
      <div className="min-h-screen flex flex-col bg-[#08080a]">
        <Navbar />
        <div className="flex-1 flex">
          {/* Admin Sidebar */}
          <aside className="w-72 border-r border-white/5 glass hidden lg:flex flex-col p-6 gap-8">
            <div className="flex items-center gap-3 px-2">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-sm font-bold">Admin Console</div>
                <div className="text-[10px] font-black uppercase tracking-widest text-primary">InfinityTools HQ</div>
              </div>
            </div>

            <nav className="flex-1 space-y-2">
              <AdminLink href="/admin" icon={LayoutDashboard} label="Dashboard" />
              <AdminLink href="/admin/users" icon={Users} label="User Management" />
              <AdminLink href="/admin/tools" icon={Wrench} label="Tool Config" />
              <AdminLink href="/admin/analytics" icon={BarChart3} label="Global Analytics" />
              <AdminLink href="/admin/pages" icon={Globe} label="Content Pages" />
              <AdminLink href="/admin/settings" icon={Settings} label="System Settings" />
            </nav>

            <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10">
              <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">Authenticated As</p>
              <p className="text-xs font-medium text-white truncate">ikbhai031@gmail.com</p>
            </div>
          </aside>

          {/* Main Admin Content */}
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </AdminGuard>
  );
}

function AdminLink({ href, icon: Icon, label }: { href: string; icon: any; label: string }) {
  return (
    <Link 
      href={href}
      className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-all text-sm font-medium text-muted-foreground hover:text-white"
    >
      <Icon className="w-4 h-4" />
      {label}
    </Link>
  );
}
