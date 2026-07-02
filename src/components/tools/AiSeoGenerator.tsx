
"use client";

import React, { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { 
  Sparkles, Loader2, Copy, 
  Search, Globe, ArrowRight,
  Layout, ListChecks, Hash, CheckCircle2,
  AlertCircle, FileCode, Code2, Palette, Terminal
} from 'lucide-react';
import { aiChat } from '@/ai/flows/ai-chat-flow';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface SeoResult {
  title: string;
  description: string;
  tags: string[];
  explanation: string;
  boilerplate: {
    html: string;
    css: string;
    js: string;
  };
}

export function AiSeoGenerator() {
  const [topic, setTopic] = useState('');
  const [language, setLanguage] = useState<'english' | 'hindi'>('english');
  const [result, setResult] = useState<SeoResult | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setIsGenerating(true);

    try {
      const systemPrompt = `You are a world-class SEO strategist and Web Architect. 
      Your task is to generate highly optimized metadata AND a project starter kit (index.html, style.css, script.js) for a website or service.
      
      OUTPUT FORMAT: You must return the response in strict JSON format as follows:
      {
        "title": "Optimized SEO Title (Max 60 chars)",
        "description": "Compelling Meta Description (Max 160 chars)",
        "tags": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
        "explanation": "Brief strategy insight.",
        "boilerplate": {
          "html": "Full index.html code including the meta tags in head",
          "css": "Professional style.css content",
          "js": "Functional script.js content"
        }
      }
      
      LANGUAGE: All content (except code syntax) must be in ${language === 'hindi' ? 'Hindi' : 'English'}.
      
      RULES:
      1. Keyword Density: Primary keywords must be in meta tags.
      2. Boilerplate Quality: Provide clean, modern, responsive code.
      3. No extra text: Return ONLY the JSON object.`;

      const response = await aiChat({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Target Topic/Service: ${topic}` }
        ]
      });

      const jsonText = response.response.replace(/```json\n?|```/gi, '').trim();
      const parsed = JSON.parse(jsonText);
      
      setResult(parsed);
      toast({ title: "Generation Complete", description: "Metadata and Web Boilerplate are ready." });
    } catch (error) {
      console.error("SEO Gen Error:", error);
      toast({ 
        title: "Generation Failed", 
        description: "The AI engine was unable to parse the request. Please try a clearer topic.", 
        variant: "destructive" 
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied!", description: `${label} saved to clipboard.` });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      {/* Control Panel */}
      <section className="glass p-10 rounded-[3.5rem] border-primary/20 bg-primary/[0.02] space-y-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
           <Globe className="w-32 h-32 text-primary" />
        </div>
        
        <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
           <div className="p-5 bg-primary rounded-3xl shadow-2xl shadow-primary/20">
              <Sparkles className="w-10 h-10 text-white" />
           </div>
           <div className="flex-1 space-y-2 text-center md:text-left">
              <h2 className="text-4xl font-headline font-bold">AI Web Architect</h2>
              <p className="text-muted-foreground text-lg font-medium">Generate SEO metadata and project files (index.html, style.css, script.js) instantly.</p>
           </div>
           
           <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10">
              <button 
                onClick={() => setLanguage('english')}
                className={cn("px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all", language === 'english' ? "bg-primary text-white" : "text-muted-foreground hover:text-white")}
              >English</button>
              <button 
                onClick={() => setLanguage('hindi')}
                className={cn("px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all", language === 'hindi' ? "bg-primary text-white" : "text-muted-foreground hover:text-white")}
              >Hindi</button>
           </div>
        </div>

        <div className="relative group">
           <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 to-accent/30 rounded-[2rem] blur opacity-30 group-focus-within:opacity-100 transition duration-1000"></div>
           <div className="relative">
             <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-muted-foreground" />
             <Input 
               placeholder="What are you building? (e.g. Portfolio for a Designer, Coffee Shop Page...)"
               className="h-20 pl-16 pr-48 bg-white/5 border-white/10 rounded-[2rem] text-xl font-bold focus:border-primary/50 transition-all shadow-2xl"
               value={topic}
               onChange={(e) => setTopic(e.target.value)}
               onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
             />
             <div className="absolute right-3 top-3">
                <Button 
                  onClick={handleGenerate}
                  disabled={isGenerating || !topic.trim()}
                  className="h-14 px-10 rounded-2xl text-lg font-bold bg-primary hover:bg-primary/90 transition-all"
                >
                  {isGenerating ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <ArrowRight className="w-5 h-5 mr-2" />}
                  Generate Suite
                </Button>
             </div>
           </div>
        </div>
      </section>

      {/* Results Workspace */}
      {result && (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-8">
              {/* Meta Title */}
              <div className="space-y-4">
                <div className="flex items-center justify-between px-2">
                  <Label className="text-xs font-black uppercase tracking-[0.2em] text-primary flex items-center gap-2">
                    <Layout className="w-4 h-4" /> Optimized Meta Title
                  </Label>
                  <Button variant="ghost" size="sm" className="h-8 glass font-bold text-[10px]" onClick={() => copyToClipboard(result.title, 'Title')}>
                    <Copy className="w-3.5 h-3.5 mr-1.5" /> Copy
                  </Button>
                </div>
                <div className="glass p-6 rounded-[2.5rem] border-white/5 bg-white/[0.01]">
                   <p className="text-xl font-bold text-white leading-tight">{result.title}</p>
                   <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase opacity-40">
                     <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                     Ideal length: {result.title.length}/60 chars
                   </div>
                </div>
              </div>

              {/* Meta Tags */}
              <div className="space-y-4">
                <div className="flex items-center justify-between px-2">
                  <Label className="text-xs font-black uppercase tracking-[0.2em] text-accent flex items-center gap-2">
                    <Hash className="w-4 h-4" /> Strategic Keywords
                  </Label>
                  <Button variant="ghost" size="sm" className="h-8 glass font-bold text-[10px]" onClick={() => copyToClipboard(result.tags.join(', '), 'Tags')}>
                    <Copy className="w-3.5 h-3.5 mr-1.5" /> Copy List
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 glass p-6 rounded-[2rem] border-white/5 bg-black/40">
                  {result.tags.map((tag, i) => (
                    <span key={i} className="px-4 py-2 bg-white/5 border border-white/5 rounded-full text-xs font-bold text-emerald-400">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* SERP Preview */}
              <div className="space-y-4">
                 <Label className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/60 px-2">Search Engine Preview (Desktop)</Label>
                 <div className="bg-white rounded-[2.5rem] p-10 shadow-2xl space-y-2 border-8 border-white/5">
                    <div className="flex items-center gap-2 mb-2">
                       <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center">
                          <Globe className="w-3 text-slate-400" />
                       </div>
                       <span className="text-[10px] text-slate-400 font-medium truncate">https://yourwebsite.com › archive</span>
                    </div>
                    <h3 className="text-xl text-[#1a0dab] hover:underline cursor-pointer font-sans leading-tight">{result.title}</h3>
                    <p className="text-sm text-[#4d5156] font-sans leading-relaxed line-clamp-2">
                      {result.description}
                    </p>
                 </div>
              </div>
            </div>

            <div className="space-y-8">
              {/* Meta Description */}
              <div className="space-y-4">
                <div className="flex items-center justify-between px-2">
                  <Label className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                    <ListChecks className="w-4 h-4" /> Meta Description
                  </Label>
                  <Button variant="ghost" size="sm" className="h-8 glass font-bold text-[10px]" onClick={() => copyToClipboard(result.description, 'Description')}>
                    <Copy className="w-3.5 h-3.5 mr-1.5" /> Copy
                  </Button>
                </div>
                <div className="glass p-10 rounded-[3rem] border-white/5 bg-secondary/10 min-h-[250px] flex flex-col justify-between">
                  <p className="text-lg leading-relaxed text-white/80 font-medium">
                    {result.description}
                  </p>
                  <div className="mt-8 flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase opacity-40">
                     <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                     Strategic length: {result.description.length}/160 chars
                  </div>
                </div>
              </div>

              {/* Strategy Insight */}
              <div className="p-8 bg-emerald-500/5 rounded-[2.5rem] border border-emerald-500/10 flex gap-6 items-start">
                 <div className="p-3 bg-emerald-500/10 rounded-2xl">
                    <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                 </div>
                 <div className="space-y-1">
                   <h4 className="text-xs font-black uppercase text-white tracking-widest">AI Strategy Insight</h4>
                   <p className="text-sm text-muted-foreground leading-relaxed font-medium italic">
                     "{result.explanation}"
                   </p>
                 </div>
              </div>
            </div>
          </div>

          {/* Boilerplate Code Workspace */}
          <div className="space-y-8 pt-12 border-t border-white/5">
             <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-2">
                   <h3 className="text-3xl font-headline font-bold flex items-center gap-3">
                      <FileCode className="w-8 h-8 text-primary" /> Starter Boilerplate
                   </h3>
                   <p className="text-muted-foreground">High-performance code snippets for your project.</p>
                </div>
             </div>

             <Tabs defaultValue="html" className="w-full">
                <TabsList className="glass p-1 h-auto rounded-2xl mb-6">
                  <TabsTrigger value="html" className="rounded-xl py-3 px-8 gap-2 uppercase font-black text-[10px] tracking-widest">
                    <Layout className="w-4 h-4" /> index.html
                  </TabsTrigger>
                  <TabsTrigger value="css" className="rounded-xl py-3 px-8 gap-2 uppercase font-black text-[10px] tracking-widest">
                    <Palette className="w-4 h-4" /> style.css
                  </TabsTrigger>
                  <TabsTrigger value="js" className="rounded-xl py-3 px-8 gap-2 uppercase font-black text-[10px] tracking-widest">
                    <Terminal className="w-4 h-4" /> script.js
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="html" className="relative group">
                   <Button 
                    variant="ghost" 
                    size="sm" 
                    className="absolute top-4 right-4 z-10 glass font-bold text-[10px] opacity-0 group-hover:opacity-100 transition-opacity" 
                    onClick={() => copyToClipboard(result.boilerplate.html, 'HTML')}
                   >
                     <Copy className="w-3.5 h-3.5 mr-1.5" /> Copy HTML
                   </Button>
                   <div className="glass p-10 rounded-[3rem] bg-black/40 border-white/10 font-mono text-xs overflow-auto max-h-[600px] text-emerald-400 custom-scrollbar">
                      <pre className="whitespace-pre-wrap leading-relaxed">{result.boilerplate.html}</pre>
                   </div>
                </TabsContent>

                <TabsContent value="css" className="relative group">
                   <Button 
                    variant="ghost" 
                    size="sm" 
                    className="absolute top-4 right-4 z-10 glass font-bold text-[10px] opacity-0 group-hover:opacity-100 transition-opacity" 
                    onClick={() => copyToClipboard(result.boilerplate.css, 'CSS')}
                   >
                     <Copy className="w-3.5 h-3.5 mr-1.5" /> Copy CSS
                   </Button>
                   <div className="glass p-10 rounded-[3rem] bg-black/40 border-white/10 font-mono text-xs overflow-auto max-h-[600px] text-blue-400 custom-scrollbar">
                      <pre className="whitespace-pre-wrap leading-relaxed">{result.boilerplate.css}</pre>
                   </div>
                </TabsContent>

                <TabsContent value="js" className="relative group">
                   <Button 
                    variant="ghost" 
                    size="sm" 
                    className="absolute top-4 right-4 z-10 glass font-bold text-[10px] opacity-0 group-hover:opacity-100 transition-opacity" 
                    onClick={() => copyToClipboard(result.boilerplate.js, 'JS')}
                   >
                     <Copy className="w-3.5 h-3.5 mr-1.5" /> Copy JS
                   </Button>
                   <div className="glass p-10 rounded-[3rem] bg-black/40 border-white/10 font-mono text-xs overflow-auto max-h-[600px] text-amber-400 custom-scrollbar">
                      <pre className="whitespace-pre-wrap leading-relaxed">{result.boilerplate.js}</pre>
                   </div>
                </TabsContent>
             </Tabs>
          </div>
        </div>
      )}

      {/* Advisory Section */}
      <section className="glass p-10 rounded-[3rem] border-white/5 bg-amber-500/[0.02] flex flex-col md:flex-row items-start gap-8 border-amber-500/10">
        <div className="p-4 bg-amber-500/10 rounded-2xl">
          <AlertCircle className="w-8 h-8 text-amber-500 shrink-0 mt-1" />
        </div>
        <div className="space-y-2">
          <h4 className="font-black text-amber-500 uppercase tracking-[0.2em] text-xs">Architectural Integrity</h4>
          <p className="text-sm text-muted-foreground leading-relaxed font-medium">
            Generated code follows modern best practices with semantic HTML5 and clean separation of concerns. 
            <span className="text-white font-bold mx-1">Integration:</span> Simply create three files with the names 
            <span className="text-primary font-bold mx-1">index.html, style.css, and script.js</span> in a folder and paste the generated content to launch your project instantly.
          </p>
        </div>
      </section>
    </div>
  );
}

