
import React from 'react';
import { Navbar } from '@/components/layout/Navbar';

export default function DmcaPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-4xl mx-auto px-6 py-20 space-y-12">
        <h1 className="text-5xl font-headline font-bold">DMCA Policy</h1>
        <div className="prose prose-invert max-w-none space-y-8 text-muted-foreground text-lg leading-relaxed">
          <p>InfinityTools respects intellectual property rights. If you believe your copyrighted work is being used on our platform in a way that constitutes infringement, please contact our legal team.</p>
          <p>Notice should be sent to: legal@infinitytools.com</p>
        </div>
      </main>
    </div>
  );
}
