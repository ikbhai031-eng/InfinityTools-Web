
"use client";

import React from 'react';
import { Tool, CATEGORIES, TOOLS } from '@/lib/tools-data';
import { 
  CheckCircle, ArrowRight, Star, ShieldCheck, 
  Zap, Search, Smartphone, Award, ListOrdered,
  Activity, Monitor, Shield, Layers, Rocket
} from 'lucide-react';
import { 
  Accordion, AccordionContent, AccordionItem, AccordionTrigger 
} from '@/components/ui/accordion';
import { cn } from '@/lib/utils';

interface SeoContentProps {
  tool: Omit<Tool, 'icon'>;
}

export function SeoContent({ tool }: SeoContentProps) {
  const features = [
    "Privacy-First: All processing occurs locally in your browser memory.",
    "High-Speed: Native browser multithreading for near-instant results.",
    "Secure: No data transmission, maintaining 100% user sovereignty.",
    "Cross-Platform: Optimized for Desktop workstations and mobile devices.",
    "Elite Performance: 100% Free with no usage limits or hidden costs."
  ];

  const faqs = [
    { 
      q: `Is the ${tool.name} safe for professional use?`, 
      a: `Absolutely. The ${tool.name} module utilizes a unique "Local-First" architecture. This means your sensitive documents, passwords, or data snippets never leave your browser environment. We do not maintain any logs or temporary files on our global infrastructure.` 
    },
    { 
      q: "Is there a limit on file size or processing cycles?", 
      a: "No. InfinityTools is engineered as an open workstation. You can process as many files as your local hardware allows, with no artificial throttling or subscription paywalls." 
    },
    { 
      q: "Do I need to authenticate or register for professional features?", 
      a: "Access is 100% frictionless. No signup, email verification, or subscription is required to use any professional-grade utility in our ecosystem." 
    }
  ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.a
      }
    }))
  };

  return (
    <div className="space-y-40 py-32 md:py-56 border-t border-white/5 mt-40">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      
      {/* Detailed Technical Specs Section */}
      <section className="grid lg:grid-cols-2 gap-24 items-start">
        <div className="space-y-12">
          <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-[0.4em] border border-primary/20 shadow-2xl">
            <Award className="w-5 h-5" /> Professional Specs
          </div>
          <h2 className="text-6xl md:text-8xl font-headline font-black text-white tracking-tighter leading-[0.9] uppercase group">
            Elite {tool.name} <br/>
            <span className="text-primary italic inline-flex items-center gap-4">Infrastructure <Rocket className="w-12 h-12 md:w-20 md:h-20" /></span>
          </h2>
          <div className="prose prose-invert max-w-none text-muted-foreground text-xl md:text-2xl leading-relaxed space-y-10 font-medium opacity-70 group-hover:opacity-100 transition-opacity duration-1000">
            <p>
              The {tool.name} module at InfinityTools is a masterpiece of browser-native engineering. Unlike legacy cloud tools that rely on slow API round-trips, our workstation leverages **WASM-optimized algorithms** to process your data directly on your hardware.
            </p>
            <p>
              Whether you are an architect optimizing massive JSON datasets, a designer handling ultra-high-res image layers, or a developer securing mission-critical PDF signatures, this utility provides the precision and privacy required by modern professional standards.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 md:gap-12 pt-12">
          {[
            { icon: ShieldCheck, title: "Sovereign", color: "blue", desc: "Local-Only Data Storage" },
            { icon: Zap, title: "Instant", color: "amber", desc: "Near-Zero Execution Latency" },
            { icon: Smartphone, title: "Adaptive", color: "indigo", desc: "Cross-Device Responsive UI" },
            { icon: Search, title: "Optimized", color: "green", desc: "Semantic SEO Ready Output" }
          ].map((item, i) => (
            <div key={i} className={cn(
              "p-12 glass rounded-[3.5rem] md:rounded-[4.5rem] border-white/5 bg-white/[0.02] space-y-6 hover:scale-110 hover:rotate-3 transition-all duration-1000 group shadow-2xl",
              i % 2 === 1 && "translate-y-10"
            )}>
              <div className={`w-16 h-16 md:w-20 md:h-20 rounded-[2rem] bg-${item.color}-500/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-700 shadow-xl group-hover:scale-110`}>
                <item.icon className={`w-8 h-8 md:w-10 md:h-10 text-${item.color}-500 group-hover:text-white`} />
              </div>
              <h3 className="font-black text-3xl md:text-4xl tracking-tighter uppercase">{item.title}</h3>
              <p className="text-base md:text-xl text-muted-foreground font-medium opacity-60 group-hover:opacity-100 transition-opacity">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Strategic Benefits & Operational Protocol */}
      <section className="grid lg:grid-cols-2 gap-24 md:gap-32">
        <div className="space-y-12 glass p-12 md:p-24 rounded-[4rem] md:rounded-[6rem] border-white/5 bg-white/[0.01] hover:border-primary/40 transition-all duration-1000 shadow-2xl group">
          <div className="flex items-center gap-6">
             <div className="p-5 md:p-6 bg-primary/20 rounded-[2rem] group-hover:bg-primary transition-all duration-700 group-hover:scale-110 group-hover:rotate-6"><Star className="w-10 h-10 md:w-14 md:h-14 text-primary group-hover:text-white" /></div>
             <h2 className="text-4xl md:text-7xl font-headline font-black uppercase text-white tracking-tighter">Key Protocol</h2>
          </div>
          <ul className="space-y-10">
            {features.map((f, i) => (
              <li key={i} className="flex items-start gap-8 group/item">
                <CheckCircle className="w-8 h-8 md:w-10 md:h-10 text-emerald-500 shrink-0 mt-1 group-hover/item:scale-125 transition-transform" />
                <span className="text-xl md:text-3xl font-bold text-white/80 leading-tight group-hover/item:text-white transition-colors">{f}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-12 glass p-12 md:p-24 rounded-[4rem] md:rounded-[6rem] border-white/5 bg-white/[0.01] hover:border-accent/40 transition-all duration-1000 shadow-2xl group">
          <div className="flex items-center gap-6">
             <div className="p-5 md:p-6 bg-accent/20 rounded-[2rem] group-hover:bg-accent transition-all duration-700 group-hover:scale-110 group-hover:-rotate-6"><ListOrdered className="w-10 h-10 md:w-14 md:h-14 text-accent group-hover:text-white" /></div>
             <h2 className="text-4xl md:text-7xl font-headline font-black uppercase text-white tracking-tighter">Run Engine</h2>
          </div>
          <div className="space-y-10">
            {[
              "Input raw operational data into the module.",
              "Adjust technical parameters in the UI.",
              "Initialize local processing engine.",
              "Export high-fidelity final result."
            ].map((step, i) => (
              <div key={i} className="flex gap-10 items-center group/step">
                <div className="w-16 h-16 md:w-24 md:h-24 rounded-[2.5rem] md:rounded-[3.5rem] bg-secondary flex items-center justify-center text-primary font-black text-3xl md:text-5xl shrink-0 group-hover/step:bg-primary group-hover/step:text-white transition-all duration-700 shadow-2xl group-hover/step:scale-110 group-hover/step:rotate-12 border border-white/10">
                  {i + 1}
                </div>
                <p className="text-xl md:text-3xl font-bold text-muted-foreground group-hover/step:text-white transition-colors duration-500 leading-tight">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Global Intelligence FAQ */}
      <section className="max-w-6xl mx-auto space-y-24">
        <div className="text-center space-y-8">
          <div className="inline-flex items-center gap-3 px-5 py-2 bg-white/5 rounded-full text-[10px] font-black tracking-[0.4em] uppercase text-muted-foreground border border-white/10">Verification & Support</div>
          <h2 className="text-5xl md:text-[6.5rem] font-headline font-black tracking-tighter text-white uppercase leading-[0.9]">Technical Support <br/> <span className="text-primary italic">Protocol</span></h2>
          <p className="text-xl md:text-3xl text-muted-foreground font-medium opacity-60 max-w-4xl mx-auto leading-relaxed">Everything you need to know about the professional deployment of the {tool.name} module.</p>
        </div>
        <Accordion type="single" collapsible className="w-full space-y-10">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="glass px-12 py-6 rounded-[3.5rem] md:rounded-[4.5rem] border-white/5 hover:border-primary/40 transition-all duration-700 overflow-hidden group shadow-2xl">
              <AccordionTrigger className="text-left font-black text-2xl md:text-4xl hover:no-underline py-10 tracking-tighter uppercase group-hover:text-primary transition-colors">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-lg md:text-2xl pb-12 leading-relaxed font-medium opacity-70">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* Infrastructure Integrity Block */}
      <section className="p-20 md:p-40 glass rounded-[6rem] md:rounded-[10rem] bg-primary/[0.01] border-white/5 space-y-12 text-center relative overflow-hidden group">
         <div className="absolute inset-0 bg-primary/5 blur-[150px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
         <h2 className="text-2xl md:text-4xl font-black uppercase tracking-[0.5em] text-primary/30 group-hover:text-primary transition-colors duration-700">INTEGRITY ENGINE ACTIVE</h2>
         <div className="max-w-5xl mx-auto text-muted-foreground leading-[1.8] font-medium text-xl md:text-3xl italic opacity-40 group-hover:opacity-100 transition-opacity duration-1000">
           <p>
             The search for the most reliable professional {tool.name} ends here. InfinityTools has engineered a next-generation workstation portal for {tool.category} excellence. Our {tool.name.toLowerCase()} suite is specifically deployed to meet the rigorous demands of enterprise-grade digital workflows, offering zero-trust security and sub-millisecond execution patterns. 
           </p>
         </div>
         <div className="pt-10 flex justify-center gap-12 opacity-20 group-hover:opacity-100 transition-all duration-1000">
            <Shield className="w-12 h-12 md:w-16 md:h-16" />
            <Activity className="w-12 h-12 md:w-16 md:h-16" />
            <Monitor className="w-12 h-12 md:w-16 md:h-16" />
            <Layers className="w-12 h-12 md:w-16 md:h-16" />
         </div>
      </section>
    </div>
  );
}
