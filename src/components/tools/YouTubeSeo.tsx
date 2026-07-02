
"use client";

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { 
  Video, Copy, CheckCircle2, 
  ListOrdered, Tag, FileText, 
  Sparkles, Zap, Trash2,
  Search, TrendingUp, Loader2
} from 'lucide-react';
import { aiChat } from '@/ai/flows/ai-chat-flow';

export function YouTubeSeo() {
  const [topic, setTopic] = useState('');
  const [result, setResult] = useState<{
    titles: string[];
    description: string;
    tags: string;
  } | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const generateSeo = async () => {
    if (!topic.trim()) return;
    setIsGenerating(true);

    try {
      const systemPrompt = `You are a viral YouTube SEO specialist.
      Generate 10 viral titles, a high-retention description, and 20 targeted tags for the provided topic or video link.
      
      LANGUAGE: All output MUST be in Hindi (using Devanagari script for titles/desc and comma separated for tags).
      
      OUTPUT FORMAT: Strict JSON only:
      {
        "titles": ["Title 1", "Title 2", ...],
        "description": "Viral Description Text",
        "tags": "tag1, tag2, tag3, ..."
      }`;

      const response = await aiChat({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Topic/Link: ${topic}` }
        ]
      });

      const jsonText = response.response.replace(/```json\n?|```/gi, '').trim();
      const parsed = JSON.parse(jsonText);
      
      setResult(parsed);
      toast({ title: "SEO तैयार है!", description: "हिंदी में सभी टाइटल्स, डिस्क्रिप्शन और टैग्स बना दिए गए हैं।" });
    } catch (error) {
      console.error("YT SEO Error:", error);
      toast({ 
        title: "त्रुटि!", 
        description: "SEO डेटा उत्पन्न करने में विफल। कृपया पुन: प्रयास करें।", 
        variant: "destructive" 
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "कॉपी हो गया!", description: `${label} को क्लिपबोर्ड पर सुरक्षित कर दिया गया है।` });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      <section className="glass p-10 rounded-[3.5rem] border-primary/20 bg-primary/[0.02] space-y-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
           <TrendingUp className="w-32 h-32" />
        </div>
        
        <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
           <div className="p-5 bg-primary rounded-3xl shadow-2xl shadow-primary/20">
              <Video className="w-10 h-10 text-white" />
           </div>
           <div className="flex-1 space-y-2 text-center md:text-left">
              <h2 className="text-4xl font-headline font-bold">YouTube SEO एक्सट्रैक्टर</h2>
              <p className="text-muted-foreground text-lg font-medium">कोई भी लिंक या टॉपिक डालें और पूरा वायरल डेटा हिंदी में पाएं।</p>
           </div>
        </div>

        <div className="relative group">
           <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 to-accent/30 rounded-[2rem] blur opacity-30 group-focus-within:opacity-100 transition duration-1000"></div>
           <div className="relative">
             <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-muted-foreground" />
             <Input 
               placeholder="यूट्यूब वीडियो लिंक या टॉपिक यहाँ पेस्ट करें..."
               className="h-20 pl-16 pr-48 bg-white/5 border-white/10 rounded-[2rem] text-xl font-bold focus:border-primary/50 transition-all shadow-2xl"
               value={topic}
               onChange={(e) => setTopic(e.target.value)}
             />
             <div className="absolute right-3 top-3">
                <Button 
                  onClick={generateSeo}
                  disabled={isGenerating || !topic.trim()}
                  className="h-14 px-10 rounded-2xl text-lg font-bold bg-primary hover:bg-primary/90 transition-all"
                >
                  {isGenerating ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Sparkles className="w-5 h-5 mr-2" />}
                  SEO निकालें
                </Button>
             </div>
           </div>
        </div>
      </section>

      {result && (
        <div className="grid lg:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="space-y-8">
            <div className="space-y-4">
              <h3 className="text-sm font-black uppercase tracking-widest text-primary flex items-center gap-2 px-2">
                <ListOrdered className="w-4 h-4" /> बेहतरीन वायरल टाइटल्स (Hindi)
              </h3>
              <div className="glass p-6 rounded-[2.5rem] border-white/5 space-y-4 bg-white/[0.01]">
                 {result.titles.map((t, i) => (
                   <div key={i} className="flex items-center justify-between group p-4 hover:bg-primary/5 rounded-2xl transition-all">
                      <span className="text-sm font-bold text-white/90 leading-tight pr-4">{t}</span>
                      <Button variant="ghost" size="icon" className="h-9 w-9 glass shrink-0 opacity-0 group-hover:opacity-100" onClick={() => copyToClipboard(t, 'Title')}>
                        <Copy className="w-4 h-4" />
                      </Button>
                   </div>
                 ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between px-2">
                <h3 className="text-sm font-black uppercase tracking-widest text-accent flex items-center gap-2">
                  <Tag className="w-4 h-4" /> ऑप्टिमाइज़्ड वायरल टैग्स (Hindi)
                </h3>
                <Button variant="ghost" size="sm" className="h-8 glass font-bold text-[10px]" onClick={() => copyToClipboard(result.tags, 'Tags')}>
                  <Copy className="w-3.5 h-3.5 mr-1.5" /> कॉपी करें
                </Button>
              </div>
              <div className="glass p-8 rounded-[2rem] border-white/5 bg-black/40 text-xs font-mono text-emerald-400 leading-relaxed italic">
                {result.tags}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <FileText className="w-4 h-4" /> वीडियो डिस्क्रिप्शन (Hindi)
              </h3>
              <Button variant="ghost" size="sm" className="h-8 glass font-bold text-[10px]" onClick={() => copyToClipboard(result.description, 'Description')}>
                <Copy className="w-3.5 h-3.5 mr-1.5" /> डिस्क्रिप्शन कॉपी करें
              </Button>
            </div>
            <div className="glass p-10 rounded-[3rem] border-white/5 bg-secondary/10 min-h-[700px] whitespace-pre-wrap text-sm leading-relaxed text-white/80 font-medium">
              {result.description}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
