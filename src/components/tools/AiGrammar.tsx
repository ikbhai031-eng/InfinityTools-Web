"use client";

import React, { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { correctGrammar, type CorrectGrammarOutput } from '@/ai/flows/ai-grammar-correction';
import { useToast } from '@/hooks/use-toast';
import { Sparkles, Loader2, CheckCircle2, AlertCircle, Copy, Undo2 } from 'lucide-react';

export function AiGrammar() {
  const [text, setText] = useState('');
  const [result, setResult] = useState<CorrectGrammarOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleCorrect = async () => {
    if (!text.trim()) return;
    setIsLoading(true);
    try {
      const output = await correctGrammar({ text });
      setResult(output);
      toast({ title: "Check Complete", description: "AI has reviewed your text." });
    } catch (error) {
      toast({ title: "Error", description: "Failed to correct grammar.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const applyCorrection = () => {
    if (result) {
      setText(result.correctedText);
      setResult(null);
      toast({ title: "Applied", description: "All suggestions have been applied to your text." });
    }
  };

  return (
    <div className="grid lg:grid-cols-5 gap-8">
      <div className="lg:col-span-3 space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Original Content</h3>
        <Textarea 
          placeholder="Type or paste your text here for grammar and style review..."
          className="min-h-[450px] glass p-6 text-lg leading-relaxed border-white/5"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <Button 
          onClick={handleCorrect} 
          disabled={isLoading || !text.trim()} 
          className="w-full h-12 rounded-xl text-lg shadow-xl shadow-primary/20"
        >
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Sparkles className="w-5 h-5 mr-2" />}
          Check Grammar & Style
        </Button>
      </div>

      <div className="lg:col-span-2 space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Improvements Found</h3>
        <div className="min-h-[450px] glass rounded-3xl p-6 border-white/10 relative overflow-hidden">
          {result ? (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium bg-primary/10 text-primary px-3 py-1 rounded-full">
                  {result.corrections.length} Improvements found
                </span>
                <Button variant="ghost" size="sm" onClick={applyCorrection} className="text-primary hover:bg-primary/10">
                  <CheckCircle2 className="w-4 h-4 mr-2" /> Apply All
                </Button>
              </div>
              
              <div className="space-y-4 overflow-y-auto max-h-[350px] pr-2">
                {result.corrections.map((c, i) => (
                  <div key={i} className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-2 group">
                    <div className="flex items-center gap-2 text-xs font-bold text-destructive line-through opacity-60">
                      {c.original}
                    </div>
                    <div className="flex items-center gap-2 text-sm font-bold text-green-500">
                      <Sparkles className="w-3 h-3" /> {c.suggested}
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed italic">{c.explanation}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground space-y-4 opacity-50">
              <Sparkles className="w-16 h-16 opacity-10" />
              <p className="max-w-[200px] text-sm font-medium leading-relaxed">
                Review your text for grammatical errors, punctuation, and flow improvements.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}