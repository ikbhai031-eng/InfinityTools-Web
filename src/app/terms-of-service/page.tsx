
import React from 'react';
import { Navbar } from '@/components/layout/Navbar';

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-4xl mx-auto px-6 py-20 space-y-12">
        <h1 className="text-5xl font-headline font-bold">Terms of Service</h1>
        <div className="prose prose-invert max-w-none space-y-8 text-muted-foreground text-lg leading-relaxed">
          <section>
            <h2 className="text-2xl font-bold text-white">1. Acceptance of Terms</h2>
            <p>By accessing InfinityTools, you agree to be bound by these terms. Our tools are provided "as is" for professional and personal use.</p>
          </section>
          <section>
            <h2 className="text-2xl font-bold text-white">2. Usage Limits</h2>
            <p>While we strive to keep our tools free, we reserve the right to implement rate limiting to ensure fair usage for all members of the community.</p>
          </section>
          <section>
            <h2 className="text-2xl font-bold text-white">3. Intellectual Property</h2>
            <p>Users maintain all rights to the files they process through our system. InfinityTools does not claim ownership of any user-generated content or processed files.</p>
          </section>
        </div>
      </main>
    </div>
  );
}
