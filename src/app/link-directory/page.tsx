'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { EXTERNAL_LINKS } from '@/lib/links-data';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Search, ExternalLink, Globe, LayoutGrid, Sparkles, ChevronRight, Home as HomeIcon } from 'lucide-react';
import Link from 'next/link';

export default function LinkDirectoryPage() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [currentYear, setCurrentYear] = useState(2025);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  const categories = useMemo(() => {
    const cats = Array.from(new Set(EXTERNAL_LINKS.map(l => l.category)));
    return cats.sort();
  }, []);

  const filteredLinks = useMemo(() => {
    return EXTERNAL_LINKS.filter(l => {
      const matchesSearch = l.name.toLowerCase().includes(search.toLowerCase()) || 
                            l.description.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = activeCategory ? l.category === activeCategory : true;
      return matchesSearch && matchesCategory;
    });
  }, [search, activeCategory]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 md:px-8 py-12 space-y-12 animate-fade-in">
        <div className="flex items-center gap-3 text-xs font-black uppercase tracking-widest text-muted-foreground/60 bg-white/5 w-fit px-5 py-2.5 rounded-full border border-white/5">
          <Link href="/" className="hover:text-primary flex items-center gap-1.5 transition-colors">
            <HomeIcon className="w-3.5 h-3.5" /> Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 opacity-30" />
          <span className="text-white font-bold tracking-normal">Web Link Hub</span>
        </div>

        <div className="text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full text-xs font-bold text-primary uppercase tracking-widest border border-primary/20">
            <Globe className="w-3.5 h-3.5" /> 1000+ Verified Professional Resources
          </div>
          <h1 className="text-5xl md:text-8xl font-headline font-bold tracking-tight">Web Directory</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-medium">
            Discover the most essential professional websites, apps, and developer resources in one organized workstation.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="relative flex-1 group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl blur opacity-0 group-focus-within:opacity-100 transition duration-1000"></div>
            <div className="relative">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input 
                placeholder="Search premium websites, apps, or categories..." 
                className="h-16 pl-14 bg-white/5 border-white/10 rounded-2xl text-xl focus:border-primary/50 focus:ring-primary/10 transition-all shadow-2xl"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 justify-center">
          <Button 
            variant={activeCategory === null ? 'default' : 'ghost'} 
            onClick={() => setActiveCategory(null)}
            className="rounded-full px-6 h-11 font-bold glass text-[10px] uppercase tracking-[0.2em]"
          >
            <LayoutGrid className="w-4 h-4 mr-2" /> All Modules
          </Button>
          {categories.map(cat => (
            <Button 
              key={cat} 
              variant={activeCategory === cat ? 'default' : 'ghost'} 
              onClick={() => setActiveCategory(cat)}
              className="rounded-full px-6 h-11 font-bold glass text-[10px] uppercase tracking-[0.2em]"
            >
              {cat}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredLinks.map((link) => (
            <a 
              key={link.id} 
              href={link.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="group"
            >
              <Card className="glass h-full hover:bg-primary/[0.03] transition-all rounded-[2.5rem] border-white/5 overflow-hidden group-hover:scale-[1.02] group-hover:border-primary/30">
                <CardContent className="p-8 space-y-6">
                  <div className="flex items-start justify-between">
                    <div className="w-16 h-16 bg-white rounded-2xl p-3 shadow-xl group-hover:rotate-6 transition-all duration-500 overflow-hidden flex items-center justify-center">
                      {link.logoUrl ? (
                        <img 
                          src={link.logoUrl} 
                          alt={`${link.name} logo`}
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = `https://www.google.com/s2/favicons?domain=${new URL(link.url).hostname}&sz=128`;
                          }}
                        />
                      ) : (
                        <Globe className="w-full h-full text-slate-800" />
                      )}
                    </div>
                    <div className="p-2.5 bg-white/5 rounded-xl group-hover:bg-primary transition-colors">
                      <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-white transition-colors" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{link.name}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed font-medium h-10">{link.description}</p>
                  </div>
                  
                  <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-widest bg-primary/10 text-primary px-3 py-1 rounded-full">{link.category}</span>
                    <span className="text-xs font-bold text-primary group-hover:underline flex items-center gap-1">
                      Visit Site <Sparkles className="w-3 h-3" />
                    </span>
                  </div>
                </CardContent>
              </Card>
            </a>
          ))}
        </div>

        {filteredLinks.length === 0 && (
          <div className="py-32 text-center glass rounded-[4rem] border-white/5 space-y-6 opacity-50">
            <Search className="w-24 h-24 mx-auto opacity-10" />
            <p className="text-2xl font-medium text-muted-foreground">No resources found matching "{search}"</p>
            <Button variant="outline" className="rounded-2xl h-12 glass" onClick={() => {setSearch(''); setActiveCategory(null)}}>Clear Filters</Button>
          </div>
        )}
      </main>

      <footer className="border-t border-white/5 glass py-16 px-6 mt-20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 text-muted-foreground">
          <div className="text-xs font-bold uppercase tracking-[0.2em]">
            © {currentYear} InfinityTools Professional Directory.
          </div>
          <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest opacity-60">
            <span>Verified Sources</span>
            <span>Local Encryption</span>
            <span>Zero-Trust Architecture</span>
          </div>
        </div>
      </footer>
    </div>
  );
}