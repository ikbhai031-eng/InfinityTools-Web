
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { 
  Search, 
  Command, 
  LayoutGrid,
  Globe,
  Menu,
  LayoutDashboard,
  FileText,
  History,
  Activity
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TOOLS } from '@/lib/tools-data';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export function Navbar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const filteredTools = useMemo(() => {
    if (!searchQuery) return [];
    const q = searchQuery.toLowerCase();
    return TOOLS.filter(t => 
      t.name.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q)
    ).slice(0, 6);
  }, [searchQuery]);

  const navLinks = [
    { href: "/categories", label: "Modules", icon: LayoutGrid },
    { href: "/link-directory", label: "Resource Hub", icon: Globe },
    { href: "/tools/pdf-editor", label: "PDF Station", icon: FileText },
  ];

  if (!mounted) return null;

  return (
    <nav className={cn(
      "fixed top-0 inset-x-0 z-50 transition-all duration-500 h-16 md:h-24 flex items-center justify-between px-6 md:px-12",
      isScrolled ? "bg-background/80 backdrop-blur-3xl border-b border-white/5 shadow-2xl" : "bg-transparent"
    )}>
      <div className="flex items-center gap-12">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="bg-primary p-2 md:p-3 rounded-xl shadow-xl shadow-primary/40 group-hover:rotate-6 transition-transform">
            <Command className="w-5 h-5 md:w-6 md:h-6 text-white" />
          </div>
          <span className="font-headline font-bold text-xl md:text-3xl tracking-tighter text-white">
            InfinityTools
          </span>
        </Link>

        <div className="hidden xl:flex items-center gap-8 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-primary transition-colors flex items-center gap-2">
              <link.icon className="w-4 h-4" /> {link.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="flex-1 max-w-lg mx-12 relative hidden md:block">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input 
            placeholder="Search workstation modules..." 
            className="pl-12 bg-white/5 border-white/10 focus:border-primary/50 focus:ring-primary/10 rounded-2xl h-12 w-full text-sm font-bold"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <AnimatePresence>
          {searchQuery && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute top-full left-0 right-0 mt-4 glass rounded-[2rem] p-2 border-white/10 overflow-hidden shadow-2xl"
            >
              <div className="max-h-[400px] overflow-y-auto custom-scrollbar p-2">
                {filteredTools.length > 0 ? filteredTools.map(tool => (
                  <Link key={tool.id} href={`/tools/${tool.id}`} onClick={() => setSearchQuery('')} className="flex items-center gap-4 p-3 hover:bg-primary/10 rounded-xl transition-all group">
                    <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary transition-colors">
                      <tool.icon className="w-5 h-5 text-primary group-hover:text-white" />
                    </div>
                    <div>
                      <div className="font-bold text-sm text-white">{tool.name}</div>
                      <div className="text-[9px] text-muted-foreground font-black uppercase tracking-widest">{tool.category}</div>
                    </div>
                  </Link>
                )) : <div className="p-8 text-center text-xs font-bold text-muted-foreground opacity-40 uppercase">No tool found</div>}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex items-center gap-4">
        <Link href="/dashboard">
          <Button className="h-11 px-6 rounded-xl gap-2 font-bold text-[10px] uppercase tracking-widest bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/20">
            <LayoutDashboard className="w-4 h-4" /> Command Center
          </Button>
        </Link>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="glass rounded-xl h-11 w-11 xl:hidden">
              <Menu className="w-5 h-5 text-white" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="glass border-white/10 w-[300px] p-0 flex flex-col">
            <SheetHeader className="p-6 border-b border-white/5">
              <SheetTitle className="text-left font-headline font-bold flex items-center gap-3">
                 <Command className="w-6 h-6 text-primary" /> InfinityTools
              </SheetTitle>
            </SheetHeader>
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              <div className="space-y-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">Navigation</p>
                <div className="space-y-2">
                  <MobileNavLink href="/" icon={LayoutDashboard} label="Home" />
                  <MobileNavLink href="/dashboard" icon={History} label="My Activity" />
                  <MobileNavLink href="/categories" icon={LayoutGrid} label="All Categories" />
                  <MobileNavLink href="/link-directory" icon={Globe} label="Resource Hub" />
                </div>
              </div>
              <div className="space-y-4">
                 <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">System Status</p>
                 <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl flex items-center gap-3">
                   <Activity className="w-4 h-4 text-emerald-500" />
                   <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">All Engines Online</span>
                 </div>
              </div>
            </div>
            <div className="p-6 border-t border-white/5">
               <p className="text-[9px] font-black text-center text-muted-foreground/30 uppercase tracking-[0.4em]">Professional Web Workstation v2.0</p>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}

function MobileNavLink({ href, icon: Icon, label }: { href: string; icon: any; label: string }) {
  return (
    <Link href={href} className="flex items-center gap-4 p-4 rounded-xl hover:bg-white/5 text-sm font-bold text-white transition-all">
      <div className="p-2 bg-primary/10 rounded-lg"><Icon className="w-4 h-4 text-primary" /></div>
      {label}
    </Link>
  );
}
