
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { 
  Zap,
  Clock,
  Heart,
  Activity,
  Trash2,
  ArrowRight,
  ShieldCheck,
  Command,
  LayoutGrid
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { TOOLS, Tool } from '@/lib/tools-data';
import { useToast } from '@/hooks/use-toast';

export default function DashboardPage() {
  const { toast } = useToast();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setFavorites(JSON.parse(localStorage.getItem('infinity_favorites') || '[]'));
    setHistory(JSON.parse(localStorage.getItem('infinity_history') || '[]'));
  }, []);

  const favoriteTools = useMemo(() => TOOLS.filter(t => favorites.includes(t.id)), [favorites]);
  const historyTools = useMemo(() => history.map(id => TOOLS.find(t => t.id === id)).filter(Boolean) as Tool[], [history]);

  if (!mounted) return null;

  return (
    <div className="min-h-screen flex flex-col bg-mesh">
      <Navbar />
      
      <main className="flex-1 max-w-7xl mx-auto w-full px-8 py-32 space-y-24 animate-fade-in">
        <section className="relative p-12 md:p-24 glass rounded-[4rem] border-primary/20 bg-primary/[0.02] overflow-hidden shadow-2xl">
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-primary/20 blur-[120px] rounded-full"></div>
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-12 text-center md:text-left">
            <div className="w-32 h-32 rounded-[2.5rem] bg-primary/20 border-4 border-white/10 flex items-center justify-center shadow-2xl">
              <Command className="w-16 h-16 text-primary" />
            </div>
            <div className="flex-1 space-y-4">
              <h1 className="text-4xl md:text-8xl font-headline font-black tracking-tighter text-white uppercase leading-none">
                My <span className="text-primary italic">Workstation</span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground font-medium opacity-50">Welcome to your personalized professional command center. Everything is stored locally for absolute privacy.</p>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          <div className="lg:col-span-2 space-y-12">
            <div className="flex items-center justify-between border-b border-white/5 pb-8">
              <h2 className="text-4xl font-headline font-black text-white uppercase tracking-tighter flex items-center gap-6">
                <Heart className="w-10 h-10 text-primary fill-primary" /> Pinned Modules
              </h2>
            </div>

            {favoriteTools.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {favoriteTools.map(tool => (
                  <Link key={tool.id} href={`/tools/${tool.id}`}>
                    <Card className="glass group hover:bg-primary/5 transition-all duration-500 rounded-[3rem] border-white/5 h-full">
                      <CardContent className="p-10 space-y-8">
                        <div className="p-5 bg-primary/10 rounded-2xl group-hover:bg-primary transition-all w-fit shadow-2xl">
                          <tool.icon className="w-8 h-8 text-primary group-hover:text-white" />
                        </div>
                        <div className="space-y-2">
                          <h3 className="font-bold text-2xl uppercase tracking-tight group-hover:text-primary transition-colors">{tool.name}</h3>
                          <p className="text-muted-foreground opacity-50 text-sm line-clamp-1">{tool.description}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="py-24 text-center glass rounded-[3rem] opacity-30 italic font-medium uppercase tracking-widest text-sm">No station modules pinned.</div>
            )}

            <div className="space-y-10 pt-16">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-headline font-black text-white uppercase tracking-tighter flex items-center gap-6">
                  <Clock className="w-8 h-8 text-primary" /> Session Activity
                </h2>
                <Button variant="ghost" size="sm" className="text-[10px] font-black uppercase text-destructive/40 hover:text-destructive" onClick={() => { localStorage.removeItem('infinity_history'); setHistory([]); }}>
                  <Trash2 className="w-3.5 h-3.5 mr-2" /> Purge Logs
                </Button>
              </div>

              <div className="space-y-4">
                {historyTools.map((tool, i) => (
                  <Link key={i} href={`/tools/${tool.id}`} className="block group">
                    <div className="glass p-8 rounded-[2rem] border-white/5 flex items-center justify-between group-hover:bg-white/5 transition-all">
                       <div className="flex items-center gap-6">
                          <div className="p-4 bg-white/5 rounded-2xl group-hover:bg-primary transition-all shadow-xl">
                            <tool.icon className="w-6 h-6 text-muted-foreground group-hover:text-white" />
                          </div>
                          <div>
                            <h4 className="font-bold text-xl uppercase group-hover:text-primary transition-colors">{tool.name}</h4>
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/30">{tool.category} Module</p>
                          </div>
                       </div>
                       <ArrowRight className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-all group-hover:translate-x-3" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <aside className="space-y-12">
            <div className="glass p-12 rounded-[3.5rem] border-white/5 space-y-12 shadow-2xl">
               <div className="space-y-6">
                 <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/40">Workstation Status</h3>
                 <div className="grid grid-cols-2 gap-8">
                   <div className="space-y-2">
                     <p className="text-5xl font-black text-white">{favorites.length + history.length}</p>
                     <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40 leading-none">Interacted<br/>Nodes</p>
                   </div>
                   <div className="space-y-2">
                     <p className="text-5xl font-black text-emerald-500">Local</p>
                     <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40 leading-none">Storage<br/>Mode</p>
                   </div>
                 </div>
               </div>
               
               <div className="pt-8 border-t border-white/5 space-y-6">
                 <div className="flex items-center gap-4 text-emerald-500/60">
                   <ShieldCheck className="w-5 h-5" />
                   <span className="text-[10px] font-black uppercase tracking-widest">Privacy Verified</span>
                 </div>
                 <p className="text-xs text-muted-foreground font-medium italic leading-relaxed opacity-40">Your workstation data is stored strictly within your local browser environment. We do not maintain server-side logs of your files.</p>
               </div>
            </div>

            <div className="p-10 bg-primary/5 rounded-[3.5rem] border border-primary/10 space-y-6 group cursor-pointer hover:bg-primary/10 transition-all shadow-2xl">
               <LayoutGrid className="w-10 h-10 text-primary" />
               <h4 className="text-xl font-bold uppercase tracking-tight">Full Ecosystem</h4>
               <p className="text-sm text-muted-foreground font-medium leading-relaxed opacity-60">Access all 150+ professional utility modules from one unified workstation portal.</p>
               <Link href="/categories" className="inline-flex items-center gap-2 text-primary font-black uppercase text-[10px] tracking-widest hover:translate-x-2 transition-transform">
                 Browse All <ArrowRight className="w-3 h-3" />
               </Link>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
