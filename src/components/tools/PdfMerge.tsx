
"use client";

import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { saveAs } from 'file-saver';
import { FileUploader } from './FileUploader';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, X, GripVertical, ArrowDownToLine, Loader2, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function PdfMerge() {
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const onFilesSelected = (newFiles: File[]) => {
    setFiles(prev => [...prev, ...newFiles]);
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleMerge = async () => {
    if (files.length < 2) {
      toast({ title: "At least 2 files required", variant: "destructive" });
      return;
    }

    setIsProcessing(true);
    setProgress(10);

    try {
      const mergedPdf = await PDFDocument.create();
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
        
        setProgress(Math.round(10 + (i / files.length) * 80));
      }

      const pdfBytes = await mergedPdf.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      
      setProgress(100);
      saveAs(blob, `merged_infinity_${Date.now()}.pdf`);
      
      toast({ title: "Success!", description: "PDF files merged and downloaded." });
    } catch (error) {
      console.error(error);
      toast({ title: "Merge Failed", description: "Could not process PDF files.", variant: "destructive" });
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <FileUploader 
        onFilesSelected={onFilesSelected} 
        accept={{ 'application/pdf': ['.pdf'] }}
        maxFiles={10}
        isLoading={isProcessing}
        progress={progress}
        label="Drop your PDF files here to merge them"
      />

      {files.length > 0 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          <div className="flex items-center justify-between">
            <h3 className="font-headline font-bold text-xl">{files.length} Files Selected</h3>
            <Button 
              onClick={handleMerge} 
              disabled={isProcessing || files.length < 2}
              className="rounded-xl h-12 px-8 shadow-xl shadow-primary/20"
            >
              {isProcessing ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Sparkles className="w-5 h-5 mr-2" />}
              Merge PDFs Now
            </Button>
          </div>

          <div className="grid gap-3">
            {files.map((file, idx) => (
              <div key={`${file.name}-${idx}`} className="flex items-center gap-4 p-4 glass rounded-2xl border-white/5 group hover:border-primary/30 transition-all">
                <div className="p-3 bg-primary/10 rounded-xl">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate text-white">{file.name}</p>
                  <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => removeFile(idx)} className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <X className="w-4 h-4 text-destructive" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
