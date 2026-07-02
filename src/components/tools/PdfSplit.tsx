
"use client";

import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { saveAs } from 'file-saver';
import { FileUploader } from './FileUploader';
import { Button } from '@/components/ui/button';
import { Scissors, Loader2, Sparkles, FileText, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function PdfSplit() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const onFilesSelected = async (files: File[]) => {
    const selectedFile = files[0];
    setFile(selectedFile);
    
    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      setPageCount(pdf.getPageCount());
    } catch (e) {
      toast({ title: "Error", description: "Invalid PDF file.", variant: "destructive" });
    }
  };

  const handleSplitAll = async () => {
    if (!file) return;
    setIsProcessing(true);
    
    try {
      const arrayBuffer = await file.arrayBuffer();
      const originalPdf = await PDFDocument.load(arrayBuffer);
      const pages = originalPdf.getPageCount();

      toast({ title: "Splitting...", description: `Creating ${pages} individual PDF files.` });

      for (let i = 0; i < pages; i++) {
        const newPdf = await PDFDocument.create();
        const [copiedPage] = await newPdf.copyPages(originalPdf, [i]);
        newPdf.addPage(copiedPage);
        const pdfBytes = await newPdf.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        saveAs(blob, `${file.name.replace('.pdf', '')}_page_${i + 1}.pdf`);
      }

      toast({ title: "Success", description: "All pages have been split and downloaded." });
    } catch (error) {
      toast({ title: "Split Failed", variant: "destructive" });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <FileUploader 
        onFilesSelected={onFilesSelected} 
        accept={{ 'application/pdf': ['.pdf'] }}
        isLoading={isProcessing}
        label="Upload a PDF to split into individual pages"
      />

      {file && (
        <div className="glass p-8 rounded-[2.5rem] border-white/5 space-y-6 animate-in fade-in slide-in-from-bottom-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-primary/10 rounded-2xl text-primary">
                <FileText className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-xl font-bold">{file.name}</h3>
                <p className="text-muted-foreground">{pageCount} Pages • {(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            </div>
            
            <Button 
              onClick={handleSplitAll} 
              disabled={isProcessing}
              className="h-14 px-8 rounded-2xl bg-primary text-lg shadow-xl shadow-primary/20"
            >
              {isProcessing ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Scissors className="w-5 h-5 mr-2" />}
              Extract All Pages
            </Button>
          </div>
          
          <div className="p-6 bg-secondary/30 rounded-2xl border border-white/5">
             <p className="text-sm text-muted-foreground leading-relaxed">
               This tool will take your PDF and create a separate PDF file for every single page. Ideal for extracting specific pages or breaking down large documents for sharing.
             </p>
          </div>
        </div>
      )}
    </div>
  );
}
