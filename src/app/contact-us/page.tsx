
"use client";

import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Mail, MessageSquare, MapPin } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-5xl mx-auto px-6 py-20 w-full space-y-16">
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-headline font-bold">Get in Touch</h1>
          <p className="text-xl text-muted-foreground">Have a question or feedback? We'd love to hear from you.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div className="glass p-8 rounded-3xl space-y-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-xl text-primary"><Mail /></div>
                <div>
                  <div className="font-bold">Email Support</div>
                  <div className="text-muted-foreground">support@infinitytools.com</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-xl text-primary"><MessageSquare /></div>
                <div>
                  <div className="font-bold">Live Chat</div>
                  <div className="text-muted-foreground">Available Mon-Fri, 9am-5pm EST</div>
                </div>
              </div>
            </div>
          </div>

          <form className="glass p-10 rounded-[3rem] space-y-6 border-white/5">
             <div className="space-y-2">
               <label className="text-sm font-bold uppercase tracking-widest opacity-60">Name</label>
               <Input placeholder="Your Name" className="h-12 glass" />
             </div>
             <div className="space-y-2">
               <label className="text-sm font-bold uppercase tracking-widest opacity-60">Email</label>
               <Input placeholder="your@email.com" className="h-12 glass" />
             </div>
             <div className="space-y-2">
               <label className="text-sm font-bold uppercase tracking-widest opacity-60">Message</label>
               <Textarea placeholder="How can we help?" className="min-h-[150px] glass" />
             </div>
             <Button className="w-full h-14 rounded-2xl text-lg shadow-xl shadow-primary/20">Send Message</Button>
          </form>
        </div>
      </main>
    </div>
  );
}
