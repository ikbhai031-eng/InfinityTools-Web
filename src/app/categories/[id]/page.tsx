
import React from 'react';
import { notFound } from 'next/navigation';
import { CATEGORIES, TOOLS } from '@/lib/tools-data';
import { Navbar } from '@/components/layout/Navbar';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronRight, Home as HomeIcon } from 'lucide-react';
import Link from 'next/link';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const category = CATEGORIES.find(c => c.id.toLowerCase() === id);
  if (!category) return { title: 'Category Not Found' };

  return {
    title: `${category.label} - Professional Online Utility Modules`,
    description: `Access our complete suite of professional ${category.label.toLowerCase()}. High-performance, secure, and free browser-based tools.`,
    alternates: {
      canonical: `https://infinitytools.com/categories/${id}`,
    }
  };
}

export async function generateStaticParams() {
  return CATEGORIES.map((cat) => ({
    id: cat.id.toLowerCase(),
  }));
}

export default async function CategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const category = CATEGORIES.find(c => c.id.toLowerCase() === id);

  if (!category) {
    notFound();
  }

  const categoryTools = TOOLS.filter(t => t.category.toLowerCase() === id);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-12 space-y-12">
        <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium bg-secondary/30 w-fit px-4 py-1.5 rounded-full border border-white/5">
          <Link href="/" className="hover:text-primary flex items-center gap-1.5 transition-colors">
            <HomeIcon className="w-3.5 h-3.5" /> Dashboard
          </Link>
          <ChevronRight className="w-3.5 h-3.5 opacity-50" />
          <span className="text-white font-bold">{category.label}</span>
        </div>

        <div className="space-y-4">
          <h1 className="text-5xl font-headline font-bold">{category.label}</h1>
          <p className="text-xl text-muted-foreground max-w-3xl">
            Browse our collection of professional {category.label.toLowerCase()} designed for speed, security, and precision.
          </p>
        </div>

        <div className="tool-grid">
          {categoryTools.map((tool) => (
            <Link key={tool.id} href={`/tools/${tool.id}`}>
              <Card className="glass hover:bg-white/5 transition-all group overflow-hidden h-full">
                <CardContent className="p-6 space-y-4">
                  <div className="p-3 bg-white/5 rounded-xl group-hover:bg-primary transition-colors w-fit">
                    <tool.icon className="w-6 h-6 text-primary group-hover:text-white transition-colors" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-bold text-lg group-hover:text-primary transition-colors">{tool.name}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{tool.description}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
