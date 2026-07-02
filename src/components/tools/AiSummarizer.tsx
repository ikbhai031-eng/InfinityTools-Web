"use client";

import React, { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { aiTextSummarization } from '@/ai/flows/ai-text-summarization';
import { useToast } from '@/hooks/use-toast';
import { Sparkles, Loader2, Copy, Trash2, FileText, CheckCircle } from 'lucide-react';

export function AiSummarizer() {
  const [input, setInput] = useState('');
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSummarize = async () => {
    if (!input.trim()) return;
    setIsLoading(true);
    try {
      const result = await aiTextSummarization({ text: input });
      setSummary(result.summary);
      toast({ title: "Summarized!", description: "AI has generated a concise summary." });
    } catch (error) {
      toast({ title: "Error", description: "Failed to summarize text.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <div className="space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
          <FileText className="w-4 h-4" /> Source Text
        </h3>
        <Textarea 
          placeholder="Paste long articles or documents here..."
          className="min-h-[400px] glass p-6 focus-visible:ring-primary border-white/5"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <Button 
          onClick={handleSummarize} 
          disabled={isLoading || !input.trim()}
          className="w-full h-12 rounded-xl shadow-lg shadow-primary/20"
        >
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5 mr-2" />}
          Summarize with AI
        </Button>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <CheckCircle className="w-4 h-4" /> AI Summary
          </h3>
          <div className="flex gap-2">
             <Button variant="ghost" size="icon" onClick={() => {
                navigator.clipboard.writeText(summary);
                toast({ title: "Copied" });
             }} disabled={!summary}>
               <Copy className="w-4 h-4" />
             </Button>
          </div>
        </div>
        
        <div className="min-h-[400px] glass p-8 rounded-3xl border-primary/20 bg-primary/5 relative">
          {summary ? (
            <div className="prose prose-invert prose-sm max-w-none animate-in fade-in slide-in-from-bottom-2">
              <p className="text-lg leading-relaxed text-white/90">{summary}</p>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground text-center space-y-4 pt-12">
              <Sparkles className="w-12 h-12 opacity-20" />
              <p className="max-w-xs">Your AI-generated summary will appear here after processing.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}