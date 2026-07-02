
import React from 'react';
import { Navbar } from '@/components/layout/Navbar';

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-4xl mx-auto px-6 py-20 space-y-12">
        <h1 className="text-5xl font-headline font-bold">Disclaimer</h1>
        <div className="prose prose-invert max-w-none space-y-8 text-muted-foreground text-lg leading-relaxed">
          <p>The tools and information provided on InfinityTools are for general informational purposes only. While we strive for accuracy, we make no guarantees regarding the output of our AI or automated processing engines.</p>
          <p>Users should verify all critical outputs (legal documents, financial calculations, medical content) with qualified professionals.</p>
        </div>
      </main>
    </div>
  );
}
