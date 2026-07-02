"use client";

import React, { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { 
  Code2, Copy, Trash2, Terminal, Braces, 
  Minimize, Zap, CheckCircle2, ShieldCheck,
  FileCode, Palette, AlignLeft, Loader2
} from 'lucide-react';

interface DevStudioProps {
  mode: 'url-encoder' | 'html-entities' | 'text-to-slug' | 'binary-converter' | 'html-formatter' | 'css-minifier' | 'js-minifier' | 'css-beautifier';
}

export function DevStudio({ mode }: DevStudioProps) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const processLogic = async () => {
    if (!input.trim()) return;
    setIsProcessing(true);
    
    // Artificial latency for high-fidelity feel
    await new Promise(r => setTimeout(r, 600));

    try {
      let result = '';

      switch (mode) {
        case 'url-encoder':
          result = input.includes('%') ? decodeURIComponent(input) : encodeURIComponent(input);
          break;
        case 'html-entities':
          if (input.includes('&')) {
            const div = document.createElement('div');
            div.innerHTML = input;
            result = div.textContent || div.innerText || "";
          } else {
            result = input.replace(/[\u00A0-\u9999<>\&]/g, i => '&#' + i.charCodeAt(0) + ';');
          }
          break;
        case 'text-to-slug':
          result = input.toLowerCase().trim()
            .replace(/[^\w ]+/g, '')
            .replace(/ +/g, '-');
          break;
        case 'binary-converter':
          if (/^[01 ]+$/.test(input.trim())) {
            result = input.split(/\s+/).filter(b => b.length > 0).map(bin => String.fromCharCode(parseInt(bin, 2))).join('');
          } else {
            result = input.split('').map(char => char.charCodeAt(0).toString(2).padStart(8, '0')).join(' ');
          }
          break;
        case 'html-formatter':
          // Enhanced HTML Beautifier logic
          let formattedHtml = '';
          let indent = 0;
          const tab = '  ';
          input.split(/>\s*</).forEach(node => {
            if (node.match(/^\/\w/)) indent--;
            formattedHtml += tab.repeat(Math.max(0, indent)) + '<' + node + '>\n';
            if (node.match(/^<?\w[^>]*[^\/]$/) && !node.startsWith('input') && !node.startsWith('img') && !node.startsWith('br')) indent++;
          });
          result = formattedHtml.substring(1, formattedHtml.length - 3);
          break;
        case 'css-beautifier':
          result = input.replace(/\s*\{\s*/g, " {\n  ")
            .replace(/\s*;\s*/g, ";\n  ")
            .replace(/\s*\}\s*/g, "\n}\n")
            .replace(/\n\s*\n/g, "\n")
            .trim();
          break;
        case 'css-minifier':
        case 'js-minifier':
          result = input
            .replace(/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm, '$1') // Comments
            .replace(/\s+/g, ' ') // Whitespace
            .replace(/ ?\{ ?/g, '{')
            .replace(/ ?\} ?/g, '}')
            .replace(/ ?\: ?/g, ':')
            .replace(/ ?\; ?/g, ';')
            .trim();
          break;
        default:
          result = input;
      }

      setOutput(result);
      toast({ title: "Module Logic Success", description: "Data transformed in secure local buffer." });
    } catch (e) {
      toast({ title: "Module Error", description: "Invalid logic stream for this workstation.", variant: "destructive" });
    } finally {
      setIsProcessing(false);
    }
  };

  const labels = {
    'url-encoder': 'URL Encode / Decode',
    'html-entities': 'HTML Entity Converter',
    'text-to-slug': 'URL Slug Generator',
    'binary-converter': 'Binary / Text Engine',
    'html-formatter': 'HTML Code Beautifier',
    'css-minifier': 'CSS Logic Minifier',
    'js-minifier': 'JS Logic Minifier',
    'css-beautifier': 'CSS Code Beautifier'
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-fade-in">
      <div className="grid lg:grid-cols-2 gap-16">
        <div className="space-y-8">
          <div className="flex items-center justify-between px-2">
            <Label className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/40">Native Data Input</Label>
            <Button variant="ghost" size="sm" onClick={() => { setInput(''); setOutput(''); }} className="h-8 glass text-[10px] uppercase font-black text-destructive/40 hover:text-destructive">
               <Trash2 className="w-4 h-4 mr-2" /> Clear Workspace
            </Button>
          </div>
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-b from-primary/10 to-transparent rounded-[3rem] blur opacity-30"></div>
            <Textarea 
              placeholder={`Paste your ${labels[mode] || 'code'} logic here...`}
              className="min-h-[500px] glass p-10 font-mono text-sm leading-relaxed border-white/5 focus-visible:ring-primary/20 shadow-2xl rounded-[3rem] custom-scrollbar"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </div>
          <Button 
            onClick={processLogic} 
            disabled={isProcessing || !input.trim()}
            className="w-full h-20 rounded-[2rem] bg-primary text-xl font-black uppercase tracking-widest shadow-2xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95"
          >
            {isProcessing ? <Loader2 className="w-6 h-6 mr-3 animate-spin" /> : <Zap className="w-6 h-6 mr-3" />}
            Initialize Transform
          </Button>
        </div>

        <div className="space-y-8">
          <div className="flex items-center justify-between px-2">
            <Label className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500/40">Processed Logic Result</Label>
            <Button 
              variant="ghost" 
              size="sm" 
              disabled={!output} 
              className="h-8 glass text-[10px] uppercase font-black text-emerald-500 hover:bg-emerald-500/10" 
              onClick={() => { 
                navigator.clipboard.writeText(output); 
                toast({ title: "Vaulted", description: "Result saved to clipboard." }); 
              }}
            >
              <Copy className="w-4 h-4 mr-2" /> Copy Output
            </Button>
          </div>
          <div className="relative h-full min-h-[500px]">
            <div className="absolute -inset-1 bg-emerald-500/5 rounded-[3rem] blur opacity-20"></div>
            <div className="absolute inset-0 glass p-10 font-mono text-sm leading-relaxed bg-[#08080a] rounded-[3rem] overflow-auto text-emerald-400 shadow-2xl border-white/5 custom-scrollbar">
              {output ? (
                <pre className="whitespace-pre-wrap selection:bg-emerald-500/20">{output}</pre>
              ) : (
                <div className="h-full flex flex-col items-center justify-center opacity-10 italic uppercase font-black tracking-widest text-center">
                  <Terminal className="w-16 h-16 mb-4" /> 
                  <p className="max-w-[200px]">Awaiting Logic Execution Stream</p>
                </div>
              )}
            </div>
          </div>
          <div className="p-8 bg-white/[0.02] border border-white/5 rounded-[2.5rem] flex gap-6 items-center">
             <ShieldCheck className="w-10 h-10 text-emerald-500/40 shrink-0" />
             <div className="space-y-1">
               <p className="text-[10px] font-black uppercase text-white/80 tracking-[0.2em]">Zero-Trust Architecture</p>
               <p className="text-[10px] font-black uppercase text-muted-foreground/30 tracking-[0.1em] leading-relaxed">
                 Data transformation is executed strictly within your local machine cycles. No transmission detected.
               </p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
