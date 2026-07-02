
"use client";

import React, { useState, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { 
  Type, 
  Copy, 
  Trash2, 
  CaseUpper, 
  CaseLower, 
  FileText, 
  RefreshCw,
  AlignLeft
} from 'lucide-react';

interface TextStudioProps {
  mode: 'case-converter' | 'lorem-ipsum';
}

export function TextStudio({ mode }: TextStudioProps) {
  const [input, setInput] = useState('');
  const [loremCount, setLoremCount] = useState(3);
  const { toast } = useToast();

  const convertCase = (type: 'upper' | 'lower' | 'title' | 'sentence') => {
    let result = input;
    if (type === 'upper') result = input.toUpperCase();
    if (type === 'lower') result = input.toLowerCase();
    if (type === 'title') {
      result = input.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    }
    if (type === 'sentence') {
      result = input.toLowerCase().replace(/(^\s*\w|[\.\!\?]\s*\w)/g, c => c.toUpperCase());
    }
    setInput(result);
    toast({ title: `Converted to ${type} case` });
  };

  const generateLorem = () => {
    const phrases = [
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
      "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
      "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      "Curabitur pretium tincidunt lacus. Nulla gravida orci a odio.",
      "Nullam varius, turpis et commodo pharetra, est eros bibendum elit, nec luctus magna felis sollicitudin mauris.",
      "Integer in mauris eu nibh euismod gravida. Duis ac tellus et risus vulputate vehicula.",
      "Donec lobortis risus a elit. Etiam tempor. Ut ullamcorper, ligula eu tempor congue, eros est euismod turpis, id tincidunt sapien risus a quam.",
      "Maecenas fermentum consequat mi. Donec fermentum. Pellentesque malesuada nulla a mi."
    ];
    
    let text = "";
    for (let i = 0; i < loremCount; i++) {
      text += phrases[Math.floor(Math.random() * phrases.length)] + " ";
    }
    setInput(text.trim());
    toast({ title: "Placeholder text generated" });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary/10 rounded-xl text-primary">
            {mode === 'case-converter' ? <CaseUpper className="w-6 h-6" /> : <FileText className="w-6 h-6" />}
          </div>
          <h2 className="text-3xl font-headline font-bold">
            {mode === 'case-converter' ? 'Case Converter' : 'Lorem Ipsum Generator'}
          </h2>
        </div>
        
        {mode === 'lorem-ipsum' && (
          <div className="flex items-center gap-3 glass p-2 rounded-xl">
             <Label className="text-xs font-bold uppercase ml-2">Sentences</Label>
             <Input 
               type="number" 
               value={loremCount} 
               onChange={(e) => setLoremCount(Number(e.target.value))} 
               className="w-20 h-10 glass"
             />
             <Button size="sm" onClick={generateLorem} className="rounded-lg h-10">
               <RefreshCw className="w-4 h-4 mr-2" /> Generate
             </Button>
          </div>
        )}
      </div>

      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-b from-primary/10 to-transparent rounded-[2rem] blur opacity-30 group-focus-within:opacity-100 transition duration-1000"></div>
        <Textarea 
          placeholder={mode === 'case-converter' ? "Paste or type your text here..." : "Generated placeholder text will appear here..."}
          className="min-h-[400px] glass p-8 text-lg leading-relaxed border-white/10 rounded-[2rem] focus-visible:ring-primary/20"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      </div>

      {mode === 'case-converter' && (
        <div className="flex flex-wrap gap-4 justify-center">
          <Button onClick={() => convertCase('upper')} variant="secondary" className="glass px-6 h-12 rounded-xl font-bold uppercase text-[10px] tracking-widest">UPPERCASE</Button>
          <Button onClick={() => convertCase('lower')} variant="secondary" className="glass px-6 h-12 rounded-xl font-bold uppercase text-[10px] tracking-widest">lowercase</Button>
          <Button onClick={() => convertCase('title')} variant="secondary" className="glass px-6 h-12 rounded-xl font-bold uppercase text-[10px] tracking-widest">Title Case</Button>
          <Button onClick={() => convertCase('sentence')} variant="secondary" className="glass px-6 h-12 rounded-xl font-bold uppercase text-[10px] tracking-widest">Sentence Case</Button>
        </div>
      )}

      <div className="flex items-center justify-between border-t border-white/5 pt-6">
        <div className="flex items-center gap-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">
           <AlignLeft className="w-4 h-4" /> {input.split(/\s+/).filter(x => x).length} Words
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" className="h-12 w-12 glass rounded-xl" onClick={() => {
            navigator.clipboard.writeText(input);
            toast({ title: "Copied to clipboard" });
          }}>
            <Copy className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-12 w-12 glass rounded-xl text-destructive hover:bg-destructive/10" onClick={() => setInput('')}>
            <Trash2 className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
