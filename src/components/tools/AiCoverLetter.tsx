"use client";

import React, { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { generateAiCoverLetter } from '@/ai/flows/ai-cover-letter-generation';
import { useToast } from '@/hooks/use-toast';
import { Sparkles, Loader2, Copy, Trash2, FileText, Briefcase } from 'lucide-react';

export function AiCoverLetter() {
  const [resume, setResume] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!resume.trim() || !jobDescription.trim()) return;
    setIsLoading(true);
    try {
      const output = await generateAiCoverLetter({ 
        resumeContent: resume, 
        jobDescription 
      });
      setResult(output.coverLetterContent);
      toast({ title: "Generated!", description: "Your personalized cover letter is ready." });
    } catch (error) {
      toast({ title: "Error", description: "Generation failed.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid lg:grid-cols-5 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
            <FileText className="w-4 h-4" /> Your Resume Info
          </h3>
          <Textarea 
            placeholder="Paste your resume text here..."
            className="min-h-[200px] glass p-4 text-sm border-white/5"
            value={resume}
            onChange={(e) => setResume(e.target.value)}
          />
        </div>
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
            <Briefcase className="w-4 h-4" /> Job Description
          </h3>
          <Textarea 
            placeholder="Paste the job description you are applying for..."
            className="min-h-[200px] glass p-4 text-sm border-white/5"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
          />
        </div>
        <Button 
          onClick={handleGenerate} 
          disabled={isLoading || !resume.trim() || !jobDescription.trim()}
          className="w-full h-12 rounded-xl shadow-lg shadow-primary/20"
        >
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Sparkles className="w-5 h-5 mr-2" />}
          Generate Cover Letter
        </Button>
      </div>

      <div className="lg:col-span-3 space-y-4">
        <div className="flex items-center justify-between">
           <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">AI Draft</h3>
           {result && (
             <Button variant="ghost" size="sm" onClick={() => {
               navigator.clipboard.writeText(result);
               toast({ title: "Copied" });
             }}>
               <Copy className="w-4 h-4 mr-2" /> Copy to Clipboard
             </Button>
           )}
        </div>
        <div className="min-h-[500px] glass p-8 rounded-3xl border-primary/20 bg-primary/5 relative whitespace-pre-wrap leading-relaxed text-white/90 font-body">
          {result ? result : (
            <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground space-y-4 opacity-40">
              <Sparkles className="w-16 h-16 opacity-10" />
              <p className="max-w-[240px]">Provide your resume and the job requirements to generate a tailored cover letter.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}