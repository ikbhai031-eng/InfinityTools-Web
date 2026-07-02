
"use client";

import React, { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { 
  Sparkles, Loader2, Copy, Trash2, 
  Terminal, PenTool, Mail, Share2 
} from 'lucide-react';
import { aiChat } from '@/ai/flows/ai-chat-flow';

interface AiStudioProps {
  mode: 'blog' | 'email' | 'code' | 'translator' | 'article' | 'social';
}

export function AiStudio({ mode }: AiStudioProps) {
  const [input, setInput] = useState('');
  const [context, setContext] = useState('');
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!input.trim()) return;
    setIsLoading(true);

    const systemPrompts = {
      blog: "You are an expert SEO blog writer. Create a high-quality, engaging blog post based on the topic provided.",
      email: "You are a professional business communicator. Draft a clear, effective email based on the details provided.",
      code: "You are a senior software engineer. Generate clean, efficient, and well-documented code based on the requirements.",
      translator: "You are a professional linguist. Translate the provided text accurately while maintaining tone and context.",
      article: "You are a journalist. Write a detailed, factual article based on the subject provided.",
      social: "You are a social media strategist. Create viral captions and hashtags based on the content provided."
    };

    try {
      const response = await aiChat({
        messages: [
          { role: 'system', content: systemPrompts[mode] },
          { role: 'user', content: `Topic/Input: ${input}\nAdditional Context: ${context}` }
        ]
      });
      setOutput(response.response);
      toast({ title: "Generated!", description: "AI has finished your request." });
    } catch (error) {
      toast({ title: "Error", variant: "destructive", description: "Failed to connect to AI engine." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid lg:grid-cols-5 gap-12 max-w-6xl mx-auto">
      <div className="lg:col-span-2 space-y-8">
        <div className="space-y-4">
          <Label className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/50">Primary Input</Label>
          <Textarea 
            placeholder={`Enter your ${mode} topic or requirements...`}
            className="min-h-[200px] glass p-6 focus-visible:ring-primary border-white/5"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </div>
        <div className="space-y-4">
          <Label className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/50">Context / Instructions</Label>
          <Input 
            placeholder="Optional details (Tone, Audience, Length...)"
            value={context}
            onChange={(e) => setContext(e.target.value)}
            className="h-12 glass"
          />
        </div>
        <Button 
          onClick={handleGenerate} 
          disabled={isLoading || !input.trim()}
          className="w-full h-14 rounded-2xl text-lg font-bold shadow-xl shadow-primary/20"
        >
          {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Sparkles className="w-5 h-5 mr-2" />}
          Generate {mode.charAt(0).toUpperCase() + mode.slice(1)}
        </Button>
      </div>

      <div className="lg:col-span-3 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
            <Share2 className="w-4 h-4" /> AI Result
          </h3>
          {output && (
            <Button variant="ghost" size="sm" onClick={() => {
              navigator.clipboard.writeText(output);
              toast({ title: "Copied" });
            }}>
              <Copy className="w-4 h-4 mr-2" /> Copy Output
            </Button>
          )}
        </div>
        <div className="min-h-[500px] glass p-10 rounded-[3rem] border-primary/20 bg-primary/[0.02] relative whitespace-pre-wrap leading-relaxed text-white/90">
          {output ? output : (
            <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground space-y-6 opacity-40 py-20">
              <Sparkles className="w-20 h-20 opacity-10" />
              <p className="max-w-xs text-lg">Your AI-generated content will appear here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
