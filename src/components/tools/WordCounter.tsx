"use client";

import React, { useState, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Trash2, FileText, Clock, Type, AlignLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function WordCounter() {
  const [text, setText] = useState('');
  const [stats, setStats] = useState({
    words: 0,
    chars: 0,
    charsNoSpaces: 0,
    lines: 0,
    readingTime: 0
  });
  const { toast } = useToast();

  useEffect(() => {
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const chars = text.length;
    const charsNoSpaces = text.replace(/\s/g, '').length;
    const lines = text.split('\n').filter(line => line.length > 0).length;
    const readingTime = Math.ceil(words / 200); // 200 wpm average

    setStats({ words, chars, charsNoSpaces, lines, readingTime });
  }, [text]);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Text has been copied to your clipboard.",
    });
  };

  const handleClear = () => {
    setText('');
    toast({
      title: "Cleared",
      description: "Text editor has been reset.",
    });
  };

  return (
    <div className="grid lg:grid-cols-4 gap-8">
      <div className="lg:col-span-3 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Input Text</h3>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={handleCopy} disabled={!text}>
              <Copy className="w-4 h-4 mr-2" /> Copy
            </Button>
            <Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10" onClick={handleClear} disabled={!text}>
              <Trash2 className="w-4 h-4 mr-2" /> Clear
            </Button>
          </div>
        </div>
        <Textarea 
          placeholder="Paste or type your text here to analyze..." 
          className="min-h-[400px] glass p-6 text-lg leading-relaxed focus-visible:ring-primary border-white/5"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Statistics</h3>
        <div className="grid gap-4">
          <StatCard icon={FileText} label="Words" value={stats.words} />
          <StatCard icon={Type} label="Characters" value={stats.chars} />
          <StatCard icon={AlignLeft} label="Characters (no spaces)" value={stats.charsNoSpaces} />
          <StatCard icon={Clock} label="Reading Time" value={`${stats.readingTime} min`} />
        </div>
        <div className="p-6 glass rounded-2xl bg-primary/5 border-primary/20">
          <p className="text-xs text-muted-foreground leading-relaxed">
            Reading time is based on an average adult speed of 200 words per minute.
          </p>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value }: { icon: any, label: string, value: string | number }) {
  return (
    <Card className="glass border-white/5">
      <CardContent className="p-4 flex items-center gap-4">
        <div className="p-2 bg-secondary rounded-lg">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        <div>
          <div className="text-xs text-muted-foreground font-medium">{label}</div>
          <div className="text-xl font-bold">{value}</div>
        </div>
      </CardContent>
    </Card>
  );
}