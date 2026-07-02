
import React from 'react';
import { Navbar } from '@/components/layout/Navbar';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-4xl mx-auto px-6 py-20 space-y-12">
        <h1 className="text-5xl font-headline font-bold">Privacy Policy</h1>
        <div className="prose prose-invert max-w-none space-y-8 text-muted-foreground text-lg leading-relaxed">
          <section>
            <h2 className="text-2xl font-bold text-white">1. Introduction</h2>
            <p>Welcome to InfinityTools. We are committed to protecting your personal data and your privacy. This policy explains how we handle information.</p>
          </section>
          <section>
            <h2 className="text-2xl font-bold text-white">2. Browser-Based Processing</h2>
            <p>Most of our tools (PDF Merge, Image Compress, etc.) use client-side processing. This means your files never leave your computer. We do not store or see your sensitive documents.</p>
          </section>
          <section>
            <h2 className="text-2xl font-bold text-white">3. Data Collection</h2>
            <p>We only collect minimal data required for authentication and chat history if you choose to create an account. This includes your email address and basic profile info.</p>
          </section>
          <section>
            <h2 className="text-2xl font-bold text-white">4. AI Data Usage</h2>
            <p>Interactions with our AI Assistant are processed by Google's GenAI APIs. We do not use your chat history for training third-party models.</p>
          </section>
        </div>
      </main>
    </div>
  );
}
