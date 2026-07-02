
"use client";

import React, { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { 
  Code2, 
  Repeat, 
  Copy, 
  Trash2, 
  ChevronRight, 
  Zap, 
  Loader2, 
  ArrowRightLeft,
  FileCode,
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { aiChat } from '@/ai/flows/ai-chat-flow';

const LANGUAGES = [
  { id: 'auto', label: 'Auto Detect' },
  { id: 'javascript', label: 'JavaScript' },
  { id: 'typescript', label: 'TypeScript' },
  { id: 'python', label: 'Python' },
  { id: 'html', label: 'HTML/Web UI' },
  { id: 'css', label: 'CSS' },
  { id: 'java', label: 'Java' },
  { id: 'cpp', label: 'C++' },
  { id: 'csharp', label: 'C#' },
  { id: 'php', label: 'PHP' },
  { id: 'ruby', label: 'Ruby' },
  { id: 'rust', label: 'Rust' },
  { id: 'go', label: 'Go' },
  { id: 'sql', label: 'SQL' },
  { id: 'swift', label: 'Swift' },
  { id: 'json', label: 'JSON' },
];

export function CodeConverter() {
  const [inputCode, setInputCode] = useState('');
  const [outputCode, setOutputCode] = useState('');
  const [fromLang, setFromLang] = useState('javascript');
  const [toLang, setToLang] = useState('python');
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleConvert = async () => {
    if (!inputCode.trim()) return;
    setIsProcessing(true);

    try {
      const response = await aiChat({
        messages: [
          {
            role: 'system',
            content: `You are an elite code transpiler and logic conversion engine. 
            Your primary task is to convert code FROM ${fromLang === 'auto' ? 'the detected language' : fromLang} TO ${toLang}.
            
            CRITICAL RULES:
            1. Logic Preservation: If the logic involves loops or data processing, ensure it is functionally identical in the target language.
            2. Cross-Environment Support: If the target is 'HTML/Web UI', do NOT just print the logic. Instead, generate a modern, responsive HTML/CSS snippet that visualizes or executes that logic (e.g., convert a Python list into a beautiful HTML <ul> or Table).
            3. Pure Output: Provide ONLY the code. No explanations, no "Here is your code", and no markdown blocks (unless they are part of the file content).
            4. Error Handling: If the source code is invalid, try your best to interpret the intent.`
          },
          {
            role: 'user',
            content: `Convert this input code:\n\n${inputCode}`
          }
        ]
      });

      // Powerful cleanup to remove markdown and excess text
      const rawText = response.response;
      const cleaned = rawText.replace(/```[a-z]*\n?|```/gi, '').trim();
      
      setOutputCode(cleaned);
      toast({ title: "Logic Transpiled", description: `Successfully optimized for ${toLang.toUpperCase()}` });
    } catch (err) {
      toast({ 
        title: "Transpilation Failed", 
        description: "The AI engine encountered an error. Please try a smaller snippet or check your connection.", 
        variant: "destructive" 
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const swapLanguages = () => {
    const temp = fromLang;
    setFromLang(toLang === 'auto' ? 'javascript' : toLang);
    setToLang(temp === 'auto' ? 'python' : temp);
    if (outputCode) {
      const oldInput = inputCode;
      setInputCode(outputCode);
      setOutputCode(oldInput);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Dynamic Header Toolbar */}
      <div className="glass p-6 rounded-[2.5rem] border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 bg-primary/[0.01]">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="flex-1 md:w-52">
            <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 ml-2 mb-2 block">Source Framework</Label>
            <Select value={fromLang} onValueChange={setFromLang}>
              <SelectTrigger className="h-14 glass rounded-2xl font-bold border-white/5 focus:ring-primary/20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="glass border-white/10">
                {LANGUAGES.map(lang => (
                  <SelectItem key={lang.id} value={lang.id} className="font-medium">{lang.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button 
            variant="ghost" 
            size="icon" 
            onClick={swapLanguages} 
            className="mt-6 glass rounded-full h-12 w-12 shrink-0 hover:bg-primary/20 transition-all"
          >
            <ArrowRightLeft className="w-5 h-5 text-primary" />
          </Button>

          <div className="flex-1 md:w-52">
            <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 ml-2 mb-2 block">Target Ecosystem</Label>
            <Select value={toLang} onValueChange={setToLang}>
              <SelectTrigger className="h-14 glass rounded-2xl font-bold border-white/5 focus:ring-primary/20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="glass border-white/10">
                {LANGUAGES.filter(l => l.id !== 'auto').map(lang => (
                  <SelectItem key={lang.id} value={lang.id} className="font-medium">{lang.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex gap-3 w-full md:w-auto">
           <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => { setInputCode(''); setOutputCode(''); }} 
            className="h-14 w-14 glass rounded-2xl text-destructive hover:bg-destructive/10 border-white/5"
           >
             <Trash2 className="w-6 h-6" />
           </Button>
           <Button 
            onClick={handleConvert} 
            disabled={isProcessing || !inputCode.trim()} 
            className="h-14 px-10 rounded-2xl bg-primary shadow-2xl shadow-primary/30 flex-1 md:flex-none text-lg font-bold hover:scale-[1.02] active:scale-95 transition-all"
           >
             {isProcessing ? <Loader2 className="w-5 h-5 animate-spin mr-3" /> : <Sparkles className="w-5 h-5 mr-3" />}
             Run Converter
           </Button>
        </div>
      </div>

      {/* Workspace Grid */}
      <div className="grid lg:grid-cols-2 gap-8 min-h-[650px]">
        {/* Input Panel */}
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between px-3">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white/80">Input Logic</h3>
            </div>
            <span className="text-[10px] font-black bg-white/5 border border-white/10 px-3 py-1 rounded-full text-muted-foreground uppercase">{fromLang}</span>
          </div>
          <div className="relative flex-1 group">
            <div className="absolute -inset-1 bg-gradient-to-b from-primary/20 to-transparent rounded-[2.5rem] blur opacity-20 group-focus-within:opacity-100 transition duration-1000"></div>
            <Textarea 
              placeholder={`// Paste your ${fromLang} code here...\n\n# Example: Convert Python data to HTML UI`}
              className="h-full min-h-[550px] glass p-10 rounded-[2.5rem] border-white/5 font-mono text-sm leading-relaxed resize-none focus-visible:ring-primary/10 shadow-2xl custom-scrollbar"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
            />
          </div>
        </div>

        {/* Output Panel */}
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between px-3">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white/80">Converted Result</h3>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 glass rounded-full px-4 text-[10px] font-black uppercase tracking-widest text-primary hover:bg-primary/20" 
                onClick={() => {
                  navigator.clipboard.writeText(outputCode);
                  toast({ title: "Code Copied", description: "The converted logic is now in your clipboard." });
                }} 
                disabled={!outputCode}
              >
                <Copy className="w-3 h-3 mr-2" /> Copy Output
              </Button>
              <span className="text-[10px] font-black bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full text-emerald-500 uppercase">{toLang}</span>
            </div>
          </div>
          <div className="relative flex-1">
             <div className={cn(
               "h-full min-h-[550px] glass p-10 rounded-[2.5rem] border-white/5 font-mono text-sm leading-relaxed bg-[#08080a] overflow-auto shadow-2xl custom-scrollbar border-emerald-500/5",
               !outputCode && "flex flex-col items-center justify-center text-center opacity-30 italic"
             )}>
               {outputCode ? (
                 <pre className="whitespace-pre-wrap text-emerald-400/90 selection:bg-emerald-500/20">{outputCode}</pre>
               ) : (
                 <div className="space-y-6">
                    <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-4">
                      <Zap className="w-10 h-10 text-primary opacity-40" />
                    </div>
                    <p className="max-w-[280px] text-sm font-bold uppercase tracking-widest leading-relaxed">
                      Initialize the engine to generate optimized {toLang} logic.
                    </p>
                 </div>
               )}
             </div>
          </div>
        </div>
      </div>

      {/* Advisory Component */}
      <section className="glass p-10 rounded-[3rem] border-white/5 bg-amber-500/[0.02] flex flex-col md:flex-row items-start gap-8 border-amber-500/10">
        <div className="p-4 bg-amber-500/10 rounded-2xl">
          <AlertCircle className="w-8 h-8 text-amber-500 shrink-0" />
        </div>
        <div className="space-y-2">
          <h4 className="font-black text-amber-500 uppercase tracking-[0.2em] text-xs">Logic Transpilation Protocol</h4>
          <p className="text-sm text-muted-foreground leading-relaxed font-medium">
            Our AI-powered converter handles everything from simple syntax to complex algorithmic conversion. 
            <span className="text-white font-bold mx-1">Special Handling:</span> If you translate data-heavy code (like Python or JSON) to 
            <span className="text-primary font-bold mx-1">HTML/Web UI</span>, the engine will automatically generate responsive layouts, 
            interactive tables, or data-visualization structures based on your specific logic.
          </p>
        </div>
      </section>
    </div>
  );
}
