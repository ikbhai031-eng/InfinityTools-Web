"use client";

import React, { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Copy, Trash2, CheckCircle2, AlertCircle, Maximize2, Minimize2 } from 'lucide-react';

export function JsonFormatter() {
  const [json, setJson] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const formatJson = (spaces: number = 2) => {
    try {
      if (!json.trim()) return;
      const parsed = JSON.parse(json);
      setJson(JSON.stringify(parsed, null, spaces));
      setError(null);
      toast({ title: "Success", description: "JSON formatted correctly." });
    } catch (e: any) {
      setError(e.message);
      toast({ title: "Format Error", description: "Invalid JSON provided.", variant: "destructive" });
    }
  };

  const minifyJson = () => {
    try {
      if (!json.trim()) return;
      const parsed = JSON.parse(json);
      setJson(JSON.stringify(parsed));
      setError(null);
      toast({ title: "Success", description: "JSON minified correctly." });
    } catch (e: any) {
      setError(e.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => formatJson(2)} variant="default" className="glass bg-primary/10 text-primary hover:bg-primary hover:text-white border-primary/20">
            <Maximize2 className="w-4 h-4 mr-2" /> Format (2 spaces)
          </Button>
          <Button onClick={() => formatJson(4)} variant="outline" className="glass">
            Format (4 spaces)
          </Button>
          <Button onClick={minifyJson} variant="outline" className="glass">
            <Minimize2 className="w-4 h-4 mr-2" /> Minify
          </Button>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" onClick={() => {
            navigator.clipboard.writeText(json);
            toast({ title: "Copied" });
          }}>
            <Copy className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setJson('')} className="text-destructive">
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="relative group">
        <Textarea 
          placeholder='Paste your JSON here (e.g. {"name": "InfinityTools", "active": true})'
          className={`min-h-[500px] glass font-code text-sm p-6 leading-relaxed transition-all border-white/5 ${error ? 'border-destructive/50 ring-1 ring-destructive/20' : ''}`}
          value={json}
          onChange={(e) => {
            setJson(e.target.value);
            if (error) setError(null);
          }}
        />
        
        <div className="absolute bottom-4 right-4 flex items-center gap-2">
          {error ? (
            <div className="flex items-center gap-2 text-destructive bg-destructive/10 px-4 py-2 rounded-xl text-sm font-medium animate-in fade-in slide-in-from-bottom-2">
              <AlertCircle className="w-4 h-4" /> Invalid JSON
            </div>
          ) : json && (
            <div className="flex items-center gap-2 text-green-500 bg-green-500/10 px-4 py-2 rounded-xl text-sm font-medium animate-in fade-in slide-in-from-bottom-2">
              <CheckCircle2 className="w-4 h-4" /> Valid JSON
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-destructive/5 border border-destructive/20 text-destructive text-sm font-mono whitespace-pre-wrap">
          {error}
        </div>
      )}
    </div>
  );
}