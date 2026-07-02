"use client";

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { 
  Search, Copy, Download, Code, 
  FileCode, Globe, CheckCircle2, Terminal 
} from 'lucide-react';
import { saveAs } from 'file-saver';

interface SeoStudioProps {
  mode: 'meta' | 'robots' | 'sitemap' | 'schema';
}

export function SeoStudio({ mode }: SeoStudioProps) {
  const [data, setData] = useState({
    title: 'InfinityTools - High Performance Workspace',
    description: '100% Free professional tools for PDF, AI, and Image processing.',
    keywords: 'free tools, pdf editor, ai chat, image compressor',
    url: 'https://infinitytools.com',
    author: 'InfinityTools Team'
  });
  const [output, setOutput] = useState('');
  const { toast } = useToast();

  const generate = () => {
    let result = '';
    const cleanUrl = data.url.endsWith('/') ? data.url.slice(0, -1) : data.url;

    if (mode === 'meta') {
      result = `<!-- Primary Meta Tags -->
<title>${data.title}</title>
<meta name="title" content="${data.title}">
<meta name="description" content="${data.description}">
<meta name="keywords" content="${data.keywords}">
<meta name="author" content="${data.author}">

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website">
<meta property="og:url" content="${cleanUrl}">
<meta property="og:title" content="${data.title}">
<meta property="og:description" content="${data.description}">
<meta property="og:image" content="${cleanUrl}/og-image.jpg">

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image">
<meta property="twitter:url" content="${cleanUrl}">
<meta property="twitter:title" content="${data.title}">
<meta property="twitter:description" content="${data.description}">
<meta property="twitter:image" content="${cleanUrl}/og-image.jpg">`;
    } else if (mode === 'robots') {
      result = `# Robots.txt for ${cleanUrl}
User-agent: *
Allow: /
Disallow: /admin
Disallow: /api
Disallow: /_next

Sitemap: ${cleanUrl}/sitemap.xml`;
    } else if (mode === 'schema') {
      result = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": data.title,
        "url": cleanUrl,
        "description": data.description,
        "publisher": {
          "@type": "Organization",
          "name": "InfinityTools",
          "logo": {
            "@type": "ImageObject",
            "url": `${cleanUrl}/logo.png`
          }
        }
      }, null, 2);
    } else if (mode === 'sitemap') {
      result = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${cleanUrl}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`;
    }
    setOutput(result);
    toast({ title: "SEO Code Generated", description: "Your specialized tags are ready." });
  };

  const handleDownload = () => {
    const filenameMap = {
      meta: 'meta-tags.html',
      robots: 'robots.txt',
      sitemap: 'sitemap.xml',
      schema: 'schema.json'
    };
    const blob = new Blob([output], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, filenameMap[mode]);
    toast({ title: "Saved to Disk", description: `${filenameMap[mode]} downloaded successfully.` });
  };

  return (
    <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto items-start animate-in fade-in duration-700">
      <div className="space-y-6 glass p-10 rounded-[3rem] border-white/5 bg-primary/[0.02]">
        <h3 className="text-xl font-bold flex items-center gap-3 mb-4">
          <Terminal className="w-5 h-5 text-primary" /> Configuration
        </h3>
        
        <div className="grid gap-6">
          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Site Title</Label>
            <Input value={data.title} onChange={(e) => setData({...data, title: e.target.value})} className="h-12 glass border-white/5 font-bold" />
          </div>
          
          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Site Description</Label>
            <Textarea value={data.description} onChange={(e) => setData({...data, description: e.target.value})} className="h-24 glass border-white/5 font-medium leading-relaxed" />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Canonical URL</Label>
              <Input value={data.url} onChange={(e) => setData({...data, url: e.target.value})} className="h-12 glass border-white/5 font-mono text-xs" />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Keywords</Label>
              <Input value={data.keywords} onChange={(e) => setData({...data, keywords: e.target.value})} className="h-12 glass border-white/5" />
            </div>
          </div>
        </div>

        <Button onClick={generate} className="w-full h-14 rounded-2xl text-lg font-bold shadow-xl shadow-primary/20 bg-primary hover:bg-primary/90 mt-4 transition-all active:scale-95">
          <Zap className="w-5 h-5 mr-2" /> Generate SEO Assets
        </Button>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
             <span className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Output: {mode.toUpperCase()}</span>
          </div>
          {output && (
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" className="glass hover:bg-white/10" onClick={() => {
                navigator.clipboard.writeText(output);
                toast({ title: "Copied", description: "Result saved to clipboard." });
              }}>
                <Copy className="w-4 h-4 mr-2" /> Copy
              </Button>
              <Button variant="ghost" size="sm" className="glass hover:bg-white/10" onClick={handleDownload}>
                <Download className="w-4 h-4 mr-2" /> Save
              </Button>
            </div>
          )}
        </div>
        <div className="h-[450px] glass p-8 font-mono text-[11px] overflow-auto rounded-[3rem] bg-black/40 border-white/10 text-emerald-400 relative custom-scrollbar">
          {output ? (
            <pre className="whitespace-pre-wrap leading-relaxed animate-in fade-in duration-500">{output}</pre>
          ) : (
            <div className="h-full flex flex-col items-center justify-center italic text-muted-foreground opacity-30 text-center space-y-4">
              <FileCode className="w-16 h-16 opacity-10" />
              <p className="max-w-[200px] font-black uppercase text-[10px] tracking-widest leading-relaxed">Update configuration to generate professional {mode} code.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
