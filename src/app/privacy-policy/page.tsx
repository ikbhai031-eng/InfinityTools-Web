
import React from 'react';
import { Navbar } from '@/components/layout/Navbar';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-4xl mx-auto px-6 py-20 space-y-12">
        <h1 className="text-5xl font-headline font-bold">Privacy Policy</h1>
        <div className="prose prose-invert max-w-none space-y-8 text-muted-foreground text-lg leading-relaxed">
          <section>
            <h2 className="text-2xl font-bold text-white">1. Data Sovereignty</h2>
            <p>At InfinityTools, your privacy is our highest priority. Unlike most online tool providers, we utilize client-side processing for the vast majority of our features. This means your files, data, and sensitive documents never leave your device.</p>
          </section>
          <section>
            <h2 className="text-2xl font-bold text-white">2. Information Collection</h2>
            <p>We collect minimal information required to maintain service quality, such as anonymous usage statistics and authentication data if you choose to create a profile for AI chat history.</p>
          </section>
          <section>
            <h2 className="text-2xl font-bold text-white">3. Cookies</h2>
            <p>We use essential cookies to remember your theme preferences and maintain secure session states. Third-party analytics cookies may be used to understand platform performance.</p>
          </section>
        </div>
      </main>
    </div>
  );
}
