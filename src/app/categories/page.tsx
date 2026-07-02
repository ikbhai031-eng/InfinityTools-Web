'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { CATEGORIES, TOOLS } from '@/lib/tools-data';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronRight, LayoutGrid, Zap, ArrowRight, Star, Command } from 'lucide-react';
import Link from 'next/link';

export default function CategoriesPage() {
  const [currentYear, setCurrentYear] = useState(2025);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-mesh">
      <Navbar />
      
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 md:px-10 py-24 md:py-40 space-y-24 md:space-y-40 animate-fade-in">
        <div className="space-y-8 md:space-y-12">
          <div className="flex items-center gap-4 text-primary font-black text-[10px] md:text-xs tracking-[0.5em] uppercase bg-primary/5 w-fit px-6 py-2.5 rounded-full border border-primary/20 shadow-xl">
            <LayoutGrid className="w-4 h-4 md:w-5 md:h-5" /> Professional Ecosystem
          </div>
          <div className="space-y-6">
            <h1 className="text-6xl md:text-9xl font-headline font-black tracking-tighter text-white leading-[0.9]">Workstation <br/> <span className="text-primary italic">Directory</span></h1>
            <p className="text-xl md:text-3xl text-muted-foreground max-w-4xl font-medium leading-relaxed opacity-60">
              Browse our full suite of 150+ browser-native professional modules. High-fidelity processing, 100% free, and secured by local architecture.
            </p>
          </div>
        </div>

        <div className="space-y-32">
          {CATEGORIES.map((category) => {
            const categoryTools = TOOLS.filter(t => t.category === category.id);
            if (categoryTools.length === 0) return null;

            return (
              <section key={category.id} className="space-y-16 animate-in fade-in slide-in-from-bottom-12 duration-1000">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-white/5 pb-10">
                  <div className="flex items-center gap-6 md:gap-10">
                    <div className="p-6 md:p-8 bg-primary rounded-[2.5rem] text-white shadow-[0_20px_60px_-10px_rgba(99,102,241,0.5)] rotate-3 transition-all duration-700">
                      <category.icon className="w-10 h-10 md:w-16 md:h-16" />
                    </div>
                    <div className="space-y-2">
                      <h2 className="text-4xl md:text-7xl font-headline font-black text-white tracking-tighter uppercase">{category.label}</h2>
                      <div className="flex items-center gap-3">
                         <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                         <p className="text-xs md:sm font-black text-muted-foreground/60 uppercase tracking-[0.4em]">{categoryTools.length} Modules Online</p>
                      </div>
                    </div>
                  </div>
                  <Link href={`/categories/${category.id.toLowerCase()}`}>
                    <Button variant="ghost" className="h-16 px-10 rounded-2xl glass font-black text-xs uppercase tracking-widest gap-4 group hover:bg-primary hover:text-white transition-all duration-700">
                      View Full Suite <ArrowRight className="w-5 h-5 group-hover:translate-x-3 transition-transform" />
                    </Button>
                  </Link>
                </div>

                <div className="tool-grid">
                  {categoryTools.map((tool) => (
                    <Link key={tool.id} href={`/tools/${tool.id}`}>
                      <Card className="glass group hover:bg-white/[0.03] transition-all duration-700 overflow-hidden h-full border-white/5 rounded-[2.5rem] hover:-translate-y-4 hover:border-primary/40 shadow-2xl">
                        <CardContent className="p-10 space-y-10">
                          <div className="flex items-start justify-between">
                            <div className="p-5 bg-white/5 rounded-3xl group-hover:bg-primary transition-all duration-700 shadow-2xl group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-primary/40">
                              <tool.icon className="w-8 h-8 text-primary group-hover:text-white transition-colors" />
                            </div>
                            {tool.isPopular && (
                               <div className="bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.3em] px-4 py-1.5 rounded-full border border-primary/20 flex items-center gap-2">
                                 <Star className="w-3 h-3 fill-primary" /> Popular
                               </div>
                            )}
                          </div>
                          <div className="space-y-3">
                            <h3 className="font-bold text-2xl md:text-3xl group-hover:text-primary transition-colors duration-500 tracking-tighter">{tool.name}</h3>
                            <p className="text-base md:text-lg text-muted-foreground line-clamp-2 leading-relaxed font-medium opacity-60 group-hover:opacity-100 transition-opacity">{tool.description}</p>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </main>

      <footer className="border-t border-white/5 glass py-24 md:py-32 px-6 relative mt-20 md:mt-40 overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 blur-[100px] opacity-20 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12 text-center md:text-left">
          <div className="space-y-4">
             <div className="flex items-center justify-center md:justify-start gap-4">
                <div className="bg-primary p-2.5 rounded-xl"><Command className="w-6 h-6 text-white" /></div>
                <span className="text-3xl font-headline font-bold tracking-tighter">InfinityTools</span>
             </div>
             <p className="text-muted-foreground font-medium text-lg opacity-40 max-w-sm">Engineering the world's most accessible professional toolset.</p>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-12 text-center md:text-left">
             <div className="text-xs font-black uppercase tracking-[0.5em] text-muted-foreground/30">
               © {currentYear} GLOBAL DIRECTORY. ALL ENGINES OPERATIONAL.
             </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
