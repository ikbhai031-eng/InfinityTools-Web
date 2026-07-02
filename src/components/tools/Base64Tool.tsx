"use client";

import React, { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeftRight, Copy, Trash2, Binary } from 'lucide-react';

export function Base64Tool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const { toast } = useToast();

  const handleEncode = () => {
    try {
      setOutput(btoa(input));
      toast({ title: "Encoded successfully" });
    } catch (e) {
      toast({ title: "Error", description: "Failed to encode. Invalid characters.", variant: "destructive" });
    }
  };

  const handleDecode = () => {
    try {
      setOutput(atob(input));
      toast({ title: "Decoded successfully" });
    } catch (e) {
      toast({ title: "Error", description: "Failed to decode. Invalid Base64.", variant: "destructive" });
    }
  };

  const swap = () => {
    setInput(output);
    setOutput(input);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Input</h3>
          <Button variant="ghost" size="icon" onClick={() => setInput('')}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
        <Textarea 
          placeholder="Enter text here..."
          className="min-h-[200px] glass p-6 font-mono text-sm border-white/5"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      </div>

      <div className="flex items-center justify-center gap-4">
        <Button onClick={handleEncode} className="h-12 px-8 rounded-xl bg-primary shadow-lg shadow-primary/20">
          <Binary className="w-4 h-4 mr-2" /> Encode
        </Button>
        <Button variant="ghost" size="icon" onClick={swap} className="glass rounded-full h-12 w-12">
          <ArrowLeftRight className="w-5 h-5" />
        </Button>
        <Button onClick={handleDecode} variant="secondary" className="h-12 px-8 rounded-xl glass">
          Decode
        </Button>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Output</h3>
          <Button variant="ghost" size="icon" onClick={() => {
            navigator.clipboard.writeText(output);
            toast({ title: "Copied" });
          }}>
            <Copy className="w-4 h-4" />
          </Button>
        </div>
        <div className="min-h-[200px] glass p-6 font-mono text-sm rounded-2xl bg-secondary/30 break-all whitespace-pre-wrap">
          {output || <span className="text-muted-foreground opacity-50 italic">Output will appear here...</span>}
        </div>
      </div>
    </div>
  );
}