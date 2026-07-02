
import React from 'react';
import { notFound } from 'next/navigation';
import { TOOLS } from '@/lib/tools-data';
import { Navbar } from '@/components/layout/Navbar';
import dynamic from 'next/dynamic';
import { ChevronRight, ShieldCheck, Activity, Monitor } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import type { Metadata } from 'next';

// High-Performance Dynamic Imports
const PdfEditor = dynamic(() => import('@/components/tools/PdfEditor').then(m => m.PdfEditor));
const PdfSecurity = dynamic(() => import('@/components/tools/PdfSecurity').then(m => m.PdfSecurity));
const CodeConverter = dynamic(() => import('@/components/tools/CodeConverter').then(m => m.CodeConverter));
const WordCounter = dynamic(() => import('@/components/tools/WordCounter').then(m => m.WordCounter));
const JsonFormatter = dynamic(() => import('@/components/tools/JsonFormatter').then(m => m.JsonFormatter));
const PasswordGenerator = dynamic(() => import('@/components/tools/PasswordGenerator').then(m => m.PasswordGenerator));
const Base64Tool = dynamic(() => import('@/components/tools/Base64Tool').then(m => m.Base64Tool));
const PdfMerge = dynamic(() => import('@/components/tools/PdfMerge').then(m => m.PdfMerge));
const PdfSplit = dynamic(() => import('@/components/tools/PdfSplit').then(m => m.PdfSplit));
const ImageCompressor = dynamic(() => import('@/components/tools/ImageCompressor').then(m => m.ImageCompressor));
const ImageResizer = dynamic(() => import('@/components/tools/ImageResizer').then(m => m.ImageResizer));
const QrGenerator = dynamic(() => import('@/components/tools/QrGenerator').then(m => m.QrGenerator));
const QrScanner = dynamic(() => import('@/components/tools/QrScanner').then(m => m.QrScanner));
const FinanceStudio = dynamic(() => import('@/components/tools/FinanceStudio').then(m => m.FinanceStudio));
const SeoStudio = dynamic(() => import('@/components/tools/SeoStudio').then(m => m.SeoStudio));
const PdfAdvanced = dynamic(() => import('@/components/tools/PdfAdvanced').then(m => m.PdfAdvanced));
const StudentStudio = dynamic(() => import('@/components/tools/StudentStudio').then(m => m.StudentStudio));
const UtilityStudio = dynamic(() => import('@/components/tools/UtilityStudio').then(m => m.UtilityStudio));
const BusinessStudio = dynamic(() => import('@/components/tools/BusinessStudio').then(m => m.BusinessStudio));
const ToolInteraction = dynamic(() => import('@/components/tools/ToolInteraction').then(m => m.ToolInteraction));
const TextStudio = dynamic(() => import('@/components/tools/TextStudio').then(m => m.TextStudio));
const DevStudio = dynamic(() => import('@/components/tools/DevStudio').then(m => m.DevStudio));
const SeoContent = dynamic(() => import('@/components/tools/SeoContent').then(m => m.SeoContent));
const ResumeBuilder = dynamic(() => import('@/components/tools/ResumeBuilder').then(m => m.ResumeBuilder));

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const tool = TOOLS.find(t => t.id === id);
  if (!tool) return { title: 'Tool Not Found' };
  
  return {
    title: `${tool.name} - Free Online Professional ${tool.category} Module`,
    description: `Use the InfinityTools ${tool.name} workstation. ${tool.description} Fast, secure, and 100% browser-native processing.`,
    alternates: {
      canonical: `https://infinitytools.com/tools/${tool.id}`,
    }
  };
}

export async function generateStaticParams() {
  return TOOLS.map((tool) => ({
    id: tool.id,
  }));
}

export default async function ToolPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const tool = TOOLS.find(t => t.id === id);

  if (!tool) {
    notFound();
  }

  const renderTool = () => {
    switch (tool.id) {
      case 'resume-builder': return <ResumeBuilder />;
      case 'pdf-editor': return <PdfEditor />;
      case 'pdf-lock': return <PdfSecurity mode="lock" />;
      case 'pdf-unlock': return <PdfSecurity mode="unlock" />;
      case 'code-converter': return <CodeConverter />;
      case 'word-counter': return <WordCounter />;
      case 'case-converter': return <TextStudio mode="case-converter" />;
      case 'lorem-ipsum': return <TextStudio mode="lorem-ipsum" />;
      case 'url-encoder': return <DevStudio mode="url-encoder" />;
      case 'html-entities': return <DevStudio mode="html-entities" />;
      case 'text-to-slug': return <DevStudio mode="text-to-slug" />;
      case 'binary-converter': return <DevStudio mode="binary-converter" />;
      case 'html-formatter': return <DevStudio mode="html-formatter" />;
      case 'css-minifier': return <DevStudio mode="css-minifier" />;
      case 'js-minifier': return <DevStudio mode="js-minifier" />;
      case 'css-beautifier': return <DevStudio mode="css-beautifier" />;
      case 'json-formatter': return <JsonFormatter />;
      case 'password-generator': return <PasswordGenerator />;
      case 'base64-encode': return <Base64Tool />;
      case 'merge-pdf': return <PdfMerge />;
      case 'split-pdf': return <PdfSplit />;
      case 'compress-image': return <ImageCompressor />;
      case 'resize-image': return <ImageResizer />;
      case 'qr-generator': return <QrGenerator />;
      case 'qr-scanner': return <QrScanner />;
      case 'barcode-generator': return <UtilityStudio mode="barcode-generator" />;
      case 'pdf-watermark': return <PdfAdvanced mode="watermark" />;
      case 'pdf-page-number': return <PdfAdvanced mode="page-number" />;
      case 'pdf-to-txt': return <PdfAdvanced mode="to-txt" />;
      case 'pdf-rotate': return <PdfAdvanced mode="rotate" />;
      case 'pdf-compress': return <PdfAdvanced mode="compress" />;
      case 'pdf-to-img': return <PdfAdvanced mode="pdf-to-img" />;
      case 'img-to-pdf': return <PdfAdvanced mode="img-to-pdf" />;
      case 'emi-calculator': return <FinanceStudio mode="emi" />;
      case 'gst-calculator': return <FinanceStudio mode="gst" />;
      case 'sip-calculator': return <FinanceStudio mode="sip" />;
      case 'meta-tag-generator': return <SeoStudio mode="meta" />;
      case 'robots-txt-generator': return <SeoStudio mode="robots" />;
      case 'sitemap-generator': return <SeoStudio mode="sitemap" />;
      case 'schema-generator': return <SeoStudio mode="schema" />;
      case 'gpa-calculator': return <StudentStudio mode="gpa" />;
      case 'cgpa-calculator': return <StudentStudio mode="cgpa" />;
      case 'percentage-calculator': return <StudentStudio mode="percentage" />;
      case 'uuid-generator': return <UtilityStudio mode="uuid" />;
      case 'age-calculator': return <UtilityStudio mode="age" />;
      case 'date-calculator': return <UtilityStudio mode="date" />;
      case 'unit-converter': return <UtilityStudio mode="unit-converter" />;
      case 'bmi-calculator': return <UtilityStudio mode="bmi-calculator" />;
      case 'invoice-generator': return <BusinessStudio mode="invoice" />;
      case 'receipt-generator': return <BusinessStudio mode="receipt" />;
      default: return (
        <div className="py-32 text-center glass rounded-[4rem] border-white/5 opacity-50 space-y-6">
          <Activity className="w-24 h-24 mx-auto opacity-10 animate-pulse" />
          <p className="text-2xl font-bold uppercase tracking-widest text-muted-foreground">Module logic coming soon to local station.</p>
        </div>
      );
    }
  };

  const { icon, ...serializableTool } = tool;

  return (
    <div className="flex flex-col min-h-screen bg-mesh">
      <Navbar />
      
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 md:px-10 py-16 md:py-24 space-y-16 md:space-y-24 animate-fade-in">
        <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/40 bg-white/5 w-fit px-6 py-3 rounded-full border border-white/5">
          <Link href="/" className="hover:text-primary transition-all">COMMAND</Link>
          <ChevronRight className="w-3.5 h-3.5 opacity-20" />
          <Link href={`/categories/${tool.category.toLowerCase()}`} className="hover:text-primary transition-all">{tool.category}</Link>
          <ChevronRight className="w-3.5 h-3.5 opacity-20" />
          <span className="text-white font-bold tracking-normal">{tool.name}</span>
        </div>

        <div className="relative group p-8 md:p-24 glass rounded-[4rem] border-primary/20 bg-primary/[0.01] overflow-hidden shadow-2xl">
          <div className="absolute -top-64 -right-64 w-[1000px] h-[1000px] bg-primary/10 blur-[200px] rounded-full group-hover:bg-primary/20 transition-all duration-1000"></div>
          
          <div className="relative z-10 flex flex-col lg:flex-row items-center lg:items-start gap-12 md:gap-24">
            <div className="p-8 md:p-16 bg-primary rounded-[3.5rem] shadow-2xl transform transition-all duration-1000 group-hover:scale-110 group-hover:rotate-6">
              <tool.icon className="w-16 h-16 md:w-32 md:h-32 text-white" />
            </div>
            <div className="space-y-8 text-center lg:text-left flex-1">
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
                <Badge toolLabel="Native Engine" icon={ShieldCheck} color="emerald" />
                <Badge toolLabel="Sovereign Logic" icon={Monitor} color="blue" />
                <Badge toolLabel="Verified Station" icon={Activity} color="amber" />
              </div>
              <div className="space-y-6">
                <h1 className="text-5xl md:text-9xl font-headline font-black text-white tracking-tighter leading-[0.9] uppercase">{tool.name}</h1>
                <p className="text-xl md:text-3xl text-muted-foreground max-w-4xl leading-relaxed font-medium opacity-60">{tool.description}</p>
              </div>
            </div>
          </div>
        </div>

        <ToolInteraction toolId={tool.id} toolName={tool.name} />

        <div className="py-12 relative">
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[600px] bg-primary/5 blur-[180px] rounded-full -z-10 opacity-30"></div>
          {renderTool()}
        </div>

        <SeoContent tool={serializableTool} />
      </main>
    </div>
  );
}

function Badge({ toolLabel, icon: Icon, color }: { toolLabel: string; icon: any; color: string }) {
  const colorMap: any = {
    emerald: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20 shadow-emerald-500/10",
    blue: "text-blue-500 bg-blue-500/10 border-blue-500/20 shadow-blue-500/10",
    amber: "text-amber-500 bg-amber-500/10 border-amber-500/20 shadow-amber-500/10"
  };
  return (
    <span className={cn(
      "px-6 py-2.5 rounded-full text-[10px] md:text-xs font-black uppercase tracking-[0.3em] border shadow-2xl flex items-center gap-3 backdrop-blur-xl transition-all duration-700",
      colorMap[color]
    )}>
       <Icon className="w-4 h-4" />
       {toolLabel}
    </span>
  );
}
