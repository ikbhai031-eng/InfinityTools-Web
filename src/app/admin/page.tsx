
'use client';

import React from 'react';
import { 
  Users, 
  Zap, 
  FileText, 
  TrendingUp, 
  ArrowUpRight,
  ShieldAlert,
  Activity,
  Server
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function AdminDashboard() {
  return (
    <div className="p-8 lg:p-12 space-y-12 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-headline font-bold">System Overview</h1>
          <p className="text-muted-foreground">Real-time monitoring and management of InfinityTools.</p>
        </div>
        <div className="flex gap-3">
          <Button className="rounded-xl glass h-12">Export Logs</Button>
          <Button className="rounded-xl h-12 shadow-xl shadow-primary/20">Sync Data</Button>
        </div>
      </div>

      {/* Admin Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Total Users" value="1,242" change="+12% this week" icon={Users} color="blue" />
        <StatCard label="Total Requests" value="42,892" change="+45% this week" icon={Zap} color="amber" />
        <StatCard label="PDFs Processed" value="8,102" change="+18% this week" icon={FileText} color="indigo" />
        <StatCard label="System Load" value="14%" change="Stable" icon={Server} color="emerald" />
      </div>

      <div className="grid lg:grid-cols-3 gap-12">
        {/* Security Log */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-headline font-bold flex items-center gap-3">
            <ShieldAlert className="w-5 h-5 text-destructive" /> Security Alerts
          </h2>
          <div className="glass rounded-[2.5rem] p-8 border-white/5 divide-y divide-white/5">
            {[
              { event: "Failed Admin Login", user: "guest-421@gmail.com", time: "12 mins ago", status: "Blocked" },
              { event: "High Request Rate", user: "api-user-99", time: "1 hour ago", status: "Throttled" },
              { event: "Unauthorized API Call", user: "unknown-ip-88", time: "2 hours ago", status: "Flagged" },
            ].map((log, i) => (
              <div key={i} className="py-6 flex items-center justify-between group first:pt-0 last:pb-0">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center shrink-0">
                    <ShieldAlert className="w-4 h-4 text-destructive" />
                  </div>
                  <div>
                    <div className="font-bold text-sm">{log.event}</div>
                    <div className="text-xs text-muted-foreground">{log.user} • {log.time}</div>
                  </div>
                </div>
                <span className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-white transition-colors">
                  {log.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* System Activity */}
        <div className="space-y-6">
          <h2 className="text-xl font-headline font-bold flex items-center gap-3">
            <Activity className="w-5 h-5 text-primary" /> System Health
          </h2>
          <div className="glass rounded-[2.5rem] p-8 border-white/5 space-y-8">
            <div className="space-y-4">
              <HealthItem label="API Endpoints" status="Operational" color="green" />
              <HealthItem label="Firestore DB" status="Operational" color="green" />
              <HealthItem label="Storage Engine" status="Operational" color="green" />
              <HealthItem label="Search Index" status="Rebuilding" color="amber" />
            </div>
            <Button variant="outline" className="w-full rounded-xl glass h-12">Run System Diagnostics</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, change, icon: Icon, color }: any) {
  return (
    <div className="glass p-8 rounded-[2.5rem] border-white/5 space-y-4 relative overflow-hidden group">
      <div className={`absolute -top-12 -right-12 w-24 h-24 bg-${color}-500/10 blur-3xl rounded-full group-hover:bg-${color}-500/20 transition-all`}></div>
      <div className={`p-4 bg-${color}-500/10 rounded-2xl text-${color}-500 w-fit`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <div className="text-[10px] font-black uppercase tracking-widest opacity-40">{label}</div>
        <div className="text-3xl font-bold">{value}</div>
        <div className="text-xs font-medium text-emerald-500 flex items-center gap-1 mt-1">
          <TrendingUp className="w-3 h-3" /> {change}
        </div>
      </div>
    </div>
  );
}

function HealthItem({ label, status, color }: any) {
  const colorMap: any = {
    green: "text-emerald-500 bg-emerald-500/10",
    amber: "text-amber-500 bg-amber-500/10",
    red: "text-destructive bg-destructive/10"
  };
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium text-muted-foreground">{label}</span>
      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-widest ${colorMap[color]}`}>
        {status}
      </span>
    </div>
  );
}
