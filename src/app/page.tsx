import { Zap } from "lucide-react";
'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { 
  Zap, Globe, ShieldCheck, 
  Search, LayoutGrid,
  ArrowRight, Sparkles, Star,
  Activity, Command, ChevronRight
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { TOOLS } from '@/lib/tools-data';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const filteredTools = useMemo(() => {
    if (!searchQuery.trim()) return TOOLS.filter(t => t.isPopular || t.isTrending);
    const q = searchQuery.toLowerCase();
    return TOOLS.filter(t => 
      t.name.toLowerCase().includes(q) || 
      t.category.toLowerCase().includes(q) || 
      t.description.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  if (!mounted) return null;

  return (
    <div className="flex flex-col min-h-screen bg-background bg-mesh">
      <Navbar />
      
      <main className="flex-1">
        {/* Premium Hero Section */}
        <section className="relative pt-32 pb-24 md:pt-56 md:pb-48 px-6 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-[600px] bg-primary/20 blur-[180px] rounded-full -z-10 opacity-30"></div>
          
          <div className="max-w-7xl mx-auto text-center space-y-12">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-wrap items-center justify-center gap-3"
            >
              <Badge label="Browser-Native Processing" icon={Zap} />
              <Badge label="Privacy-First Architecture" icon={ShieldCheck} />
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="space-y-6"
            >
              <h1 className="font-headline text-5xl md:text-[8rem] lg:text-[10rem] font-black tracking-tighter text-white leading-[0.9] uppercase">
                <span className="block opacity-80">Professional</span>
                <span className="text-primary italic inline-flex items-center gap-4">
                  Digital <Sparkles className="w-12 h-12 md:w-24 md:h-24 text-primary animate-pulse" /> Tools
                </span>
              </h1>
              <p className="text-xl md:text-3xl text-muted-foreground max-w-4xl mx-auto font-medium leading-relaxed opacity-60">
                Engineering the world's most accessible workstation for PDF, Design, and Developer utilities. Optimized for performance. 100% Free.
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="pt-8 flex flex-col sm:flex-row justify-center items-center gap-6"
            >
              <Link href="/categories" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto rounded-[2rem] h-20 md:h-24 px-12 md:px-16 text-xl md:text-2xl gap-4 shadow-primary/40 shadow-2xl bg-primary hover:scale-105 active:scale-95 transition-all group">
                  Explore Modules <ArrowRight className="w-6 h-6 md:w-8 md:h-8 group-hover:translate-x-2 transition-transform" />
                </Button>
              </Link>
              <Link href="/link-directory" className="w-full sm:w-auto">
                <Button variant="ghost" size="lg" className="w-full sm:w-auto rounded-[2rem] h-20 md:h-24 px-12 md:px-16 text-xl md:text-2xl gap-4 glass hover:bg-white/10 transition-all">
                  Resource Hub
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Search & Discovery Station */}
        <section className="py-24 px-6 max-w-7xl mx-auto space-y-16">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 border-b border-white/5 pb-16">
            <div className="space-y-6 flex-1">
              <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-primary/10 rounded-full text-[10px] font-black tracking-widest text-primary uppercase border border-primary/20">
                <LayoutGrid className="w-3.5 h-3.5" /> Professional Ecosystem
              </div>
              <h2 className="text-5xl md:text-8xl font-headline font-bold tracking-tighter text-white uppercase leading-none">Workstation <br/> <span className="text-primary italic">Directory</span></h2>
              <p className="text-xl md:text-2xl text-muted-foreground font-medium opacity-60 max-w-xl">Search and initialize your utility module instantly from our catalog of native engines.</p>
            </div>
            
            <div className="relative w-full max-w-xl group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary/40 to-accent/40 rounded-[3rem] blur opacity-10 group-focus-within:opacity-100 transition duration-1000"></div>
              <div className="relative">
                <Search className="absolute left-8 top-1/2 -translate-y-1/2 w-6 h-6 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input 
                  placeholder="Search 150+ modules..." 
                  className="h-24 pl-20 bg-white/5 border-white/10 rounded-[3rem] text-2xl font-bold focus:border-primary/50 focus:ring-primary/10 transition-all shadow-2xl"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredTools.map((tool) => (
              <Link key={tool.id} href={`/tools/${tool.id}`}>
                <Card className="glass group hover:bg-primary/[0.03] transition-all duration-700 h-full border-white/5 rounded-[2.5rem] hover:-translate-y-3 hover:border-primary/30 shadow-xl overflow-hidden">
                  <CardContent className="p-10 space-y-8">
                    <div className="flex items-start justify-between">
                      <div className="p-5 bg-primary/10 rounded-3xl group-hover:bg-primary transition-all duration-700 shadow-2xl">
                        <tool.icon className="w-8 h-8 text-primary group-hover:text-white" />
                      </div>
                      {tool.isPopular && (
                         <div className="bg-amber-500/10 text-amber-500 text-[9px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full border border-amber-500/20">Popular</div>
                      )}
                    </div>
                    <div className="space-y-3">
                      <h3 className="font-bold text-2xl group-hover:text-primary transition-colors duration-500 tracking-tight uppercase">{tool.name}</h3>
                      <p className="text-base text-muted-foreground line-clamp-2 leading-relaxed opacity-60 group-hover:opacity-100 transition-opacity">{tool.description}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Global Infrastructure */}
        <section className="py-40 bg-white/[0.01] border-y border-white/5 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 items-center gap-24">
            <div className="space-y-8">
              <div className="p-5 bg-white/5 rounded-3xl w-fit border border-white/10 shadow-2xl">
                 <Globe className="w-12 h-12 text-primary" />
              </div>
              <h2 className="text-5xl md:text-8xl font-headline font-bold leading-[0.9] text-white tracking-tighter uppercase">Verified Global <br/> <span className="text-primary italic">Infrastructure</span></h2>
              <p className="text-xl md:text-3xl text-muted-foreground leading-relaxed font-medium opacity-60">
                A massive curated directory of essential professional websites, apps, and developer resources integrated into one ecosystem.
              </p>
              <Link href="/link-directory">
                <Button size="lg" className="rounded-full h-20 px-12 text-xl gap-4 group shadow-xl transition-all">
                  Access Resource Hub <ChevronRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </Button>
              </Link>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
               {['GitHub', 'Vercel', 'Notion', 'Figma', 'Slack', 'Canva'].map((link) => (
                 <div key={link} className="glass p-10 rounded-[2.5rem] border-white/5 flex flex-col items-center justify-center gap-6 hover:border-primary/40 transition-all duration-700 cursor-pointer group">
                   <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center group-hover:bg-primary transition-all duration-700 shadow-xl">
                      <Globe className="w-8 h-8 text-muted-foreground group-hover:text-white" />
                   </div>
                   <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-white transition-colors">{link}</span>
                 </div>
               ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/5 glass py-24 px-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-20">
          <div className="lg:col-span-2 space-y-8">
             <Link href="/" className="flex items-center gap-3">
                <div className="bg-primary p-2.5 rounded-xl"><Command className="w-6 h-6 text-white" /></div>
                <span className="font-headline font-bold text-3xl tracking-tighter text-white">InfinityTools</span>
             </Link>
             <p className="text-muted-foreground max-w-md text-xl leading-relaxed font-medium opacity-50 italic">
               Engineering the future of professional browser-based utilities with zero-trust architecture. All processing is strictly local.
             </p>
          </div>
          
          <div className="space-y-8">
             <h4 className="font-black text-white uppercase tracking-[0.3em] text-xs">Infrastructure</h4>
             <ul className="space-y-5 text-sm font-bold text-muted-foreground/60">
               <li><Link href="/categories" className="hover:text-primary transition-colors uppercase tracking-widest">Module Explorer</Link></li>
               <li><Link href="/link-directory" className="hover:text-primary transition-colors uppercase tracking-widest">Resource Hub</Link></li>
               <li><Link href="/about-us" className="hover:text-primary transition-colors uppercase tracking-widest">About Station</Link></li>
               <li><Link href="/dashboard" className="hover:text-primary transition-colors uppercase tracking-widest">User Command</Link></li>
             </ul>
          </div>

          <div className="space-y-8">
             <h4 className="font-black text-white uppercase tracking-[0.3em] text-xs">Security & Legal</h4>
             <ul className="space-y-5 text-sm font-bold text-muted-foreground/60">
               <li><Link href="/privacy-policy" className="hover:text-primary transition-colors uppercase tracking-widest">Privacy Shield</Link></li>
               <li><Link href="/terms-of-service" className="hover:text-primary transition-colors uppercase tracking-widest">Platform Terms</Link></li>
               <li><Link href="/cookie-policy" className="hover:text-primary transition-colors uppercase tracking-widest">Cookie Policy</Link></li>
               <li><Link href="/contact-us" className="hover:text-primary transition-colors uppercase tracking-widest">Support Desk</Link></li>
             </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-32 pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8 text-[10px] font-black text-muted-foreground/30 uppercase tracking-[0.5em]">
          <p>© 2025 InfinityTools Global Ecosystem.</p>
          <div className="flex gap-12">
            <span className="flex items-center gap-3"><ShieldCheck className="w-4 h-4 text-emerald-500" /> AES-256 Protected</span>
            <span className="flex items-center gap-3"><Activity className="w-4 h-4 text-primary" /> Systems Operational</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Badge({ label, icon: Icon }: { label: string; icon: any }) {
  return (
    <span className="px-5 py-2.5 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full text-[10px] font-black text-white uppercase tracking-[0.3em] flex items-center gap-3">
      <Icon className="w-4 h-4 text-primary" />
      {label}
    </span>
  );
}
