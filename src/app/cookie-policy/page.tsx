
import React from 'react';
import { Navbar } from '@/components/layout/Navbar';

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-4xl mx-auto px-6 py-20 space-y-12">
        <h1 className="text-5xl font-headline font-bold">Cookie Policy</h1>
        <div className="prose prose-invert max-w-none space-y-8 text-muted-foreground text-lg leading-relaxed">
          <p>InfinityTools uses cookies to enhance your browsing experience and provide core functionality.</p>
          <h2 className="text-2xl font-bold text-white">How we use cookies</h2>
          <p>We use essential cookies for authentication and preference management. We may also use performance cookies to monitor site speed and reliability.</p>
        </div>
      </main>
    </div>
  );
}
