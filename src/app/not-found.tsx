
'use client';

import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Home, ArrowLeft, Ghost } from 'lucide-react';
import { TOOLS } from '@/lib/tools-data';

export default function NotFound() {
  const popularTools = TOOLS.filter(t => t.isPopular).slice(0, 4);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-12">
        <div className="space-y-6">
          <div className="relative">
             <Ghost className="w-32 h-32 mx-auto text-primary opacity-20 animate-bounce" />
             <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-8xl font-headline font-black tracking-tighter text-white/10">404</span>
             </div>
          </div>
          
          <div className="space-y-2">
            <h1 className="text-4xl font-headline font-bold">Tool Module Not Found</h1>
            <p className="text-muted-foreground text-lg max-w-md mx-auto">
              The professional utility you are looking for has been moved or is currently offline for maintenance.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/">
              <Button size="lg" className="rounded-2xl gap-2 h-14 px-8 text-lg shadow-xl shadow-primary/20">
                <Home className="w-5 h-5" /> Go to Dashboard
              </Button>
            </Link>
            <Button 
              variant="outline" 
              size="lg" 
              className="rounded-2xl gap-2 h-14 px-8 text-lg glass" 
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="w-5 h-5" /> Go Back
            </Button>
          </div>
        </div>

        <div className="max-w-4xl w-full space-y-6">
          <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Try these popular tools instead</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {popularTools.map(tool => (
              <Link key={tool.id} href={`/tools/${tool.id}`} className="glass p-4 rounded-2xl hover:bg-primary/10 transition-colors text-left group">
                <tool.icon className="w-6 h-6 text-primary mb-3 group-hover:scale-110 transition-transform" />
                <div className="font-bold text-sm truncate">{tool.name}</div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
