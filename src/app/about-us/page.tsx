
import React from 'react';
import { Navbar } from '@/components/layout/Navbar';

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-4xl mx-auto px-6 py-20 space-y-12">
        <h1 className="text-5xl font-headline font-bold">About InfinityTools</h1>
        <div className="prose prose-invert max-w-none space-y-8 text-muted-foreground text-lg leading-relaxed">
          <p>
            InfinityTools is a premier all-in-one digital workspace designed for the modern professional. Our mission is to provide powerful, secure, and free browser-based tools that empower individuals and businesses to work more efficiently.
          </p>
          <h2 className="text-2xl font-bold text-white">Our Vision</h2>
          <p>
            We believe that high-quality professional software should be accessible to everyone. By leveraging advanced web technologies, we've built a platform that handles complex tasks like PDF editing, image optimization, and AI content generation directly in your browser.
          </p>
          <h2 className="text-2xl font-bold text-white">Privacy First</h2>
          <p>
            Unlike traditional cloud services, InfinityTools prioritizes your data privacy. Most of our tools process files locally on your machine, ensuring your sensitive documents never leave your computer.
          </p>
        </div>
      </main>
    </div>
  );
}
