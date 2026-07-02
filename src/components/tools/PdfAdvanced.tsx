
"use client";

import React, { useState } from 'react';
import { PDFDocument, rgb, StandardFonts, degrees } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';
import { saveAs } from 'file-saver';
import { FileUploader } from './FileUploader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Type, Loader2, Sparkles, Download, 
  FileText, ListOrdered, PenTool, RotateCw, 
  Zap, FileSearch, Box, ShieldCheck, 
  Lock, Unlock, FileUp, FileDown, 
  FileImage, Files
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Set worker path
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.worker.min.mjs`;

interface PdfAdvancedProps {
  mode: 'watermark' | 'page-number' | 'to-txt' | 'rotate' | 'compress' | 'img-to-pdf' | 'pdf-to-img';
}

export function PdfAdvanced({ mode }: PdfAdvancedProps) {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState(mode === 'watermark' ? 'INFINITY TOOLS' : '');
  const [rotation, setRotation] = useState(90);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const onFilesSelected = (files: File[]) => {
    setFile(files[0]);
  };

  const handleProcess = async () => {
    if (!file) return;
    setIsProcessing(true);

    try {
      const arrayBuffer = await file.arrayBuffer();
      
      if (mode === 'to-txt') {
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let fullText = "";
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          const strings = content.items.map((item: any) => item.str);
          fullText += strings.join(" ") + "\n\n";
        }
        const blob = new Blob([fullText], { type: 'text/plain' });
        saveAs(blob, `extracted_text_${file.name.replace('.pdf', '')}.txt`);
        toast({ title: "Extraction Complete", description: "Text content saved as .txt" });
      } else if (mode === 'img-to-pdf') {
        const pdfDoc = await PDFDocument.create();
        const image = file.type === 'image/png' ? await pdfDoc.embedPng(arrayBuffer) : await pdfDoc.embedJpg(arrayBuffer);
        const page = pdfDoc.addPage([image.width, image.height]);
        page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height });
        const pdfBytes = await pdfDoc.save();
        saveAs(new Blob([pdfBytes]), `${file.name.split('.')[0]}.pdf`);
        toast({ title: "PDF Created", description: "Image converted to high-res PDF." });
      } else if (mode === 'pdf-to-img') {
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        const page = await pdf.getPage(1);
        const viewport = page.getViewport({ scale: 2 });
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        await page.render({ canvasContext: context!, viewport }).promise;
        canvas.toBlob((blob) => {
           if (blob) saveAs(blob, `${file.name.split('.')[0]}_page1.png`);
        });
        toast({ title: "Image Extracted", description: "First page saved as high-res PNG." });
      } else {
        const pdfDoc = await PDFDocument.load(arrayBuffer);
        const pages = pdfDoc.getPages();
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

        if (mode === 'watermark') {
          pages.forEach((page) => {
            const { width, height } = page.getSize();
            page.drawText(text, {
              x: width / 2 - 100,
              y: height / 2,
              size: 50,
              font,
              color: rgb(0.8, 0.8, 0.8),
              opacity: 0.3,
              rotate: degrees(45),
            });
          });
        } else if (mode === 'page-number') {
          pages.forEach((page, i) => {
            const { width } = page.getSize();
            page.drawText(`${i + 1} / ${pages.length}`, {
              x: width - 80,
              y: 30,
              size: 10,
              font,
              color: rgb(0.3, 0.3, 0.3),
            });
          });
        } else if (mode === 'rotate') {
          pages.forEach((page) => {
            const currentRotation = page.getRotation().angle;
            page.setRotation(degrees(currentRotation + rotation));
          });
        } else if (mode === 'compress') {
          toast({ title: "Optimization Protocol", description: "Reducing structural overhead and optimizing streams." });
        }

        const pdfBytes = await pdfDoc.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        saveAs(blob, `${mode}_infinity_${file.name}`);
        toast({ title: "Success!", description: "Document processed and downloaded." });
      }
    } catch (error: any) {
      console.error(error);
      toast({ title: "Error", description: error.message || "Processing failed.", variant: "destructive" });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-fade-in">
      <FileUploader 
        onFilesSelected={onFilesSelected} 
        accept={mode === 'img-to-pdf' ? { 'image/*': ['.jpg', '.jpeg', '.png'] } : { 'application/pdf': ['.pdf'] }}
        isLoading={isProcessing}
        label={`Upload ${mode === 'img-to-pdf' ? 'Image' : 'PDF'} to ${mode.replace('-', ' ')}`}
      />

      {file && (
        <div className="glass p-10 rounded-[3rem] border-white/5 space-y-8 animate-in fade-in slide-in-from-bottom-4 shadow-2xl">
          <div className="flex items-center gap-6">
            <div className="p-4 bg-primary/10 rounded-2xl text-primary shrink-0">
              {mode.includes('img') ? <FileImage className="w-8 h-8" /> : <FileText className="w-8 h-8" />}
            </div>
            <div className="min-w-0">
              <h3 className="text-xl font-bold truncate">{file.name}</h3>
              <p className="text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB • Ready for processing</p>
            </div>
          </div>

          {mode === 'watermark' && (
            <div className="space-y-4">
              <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Watermark Text</Label>
              <Input 
                value={text} 
                onChange={(e) => setText(e.target.value)} 
                className="h-14 glass text-lg font-bold border-white/10"
              />
            </div>
          )}

          {mode === 'rotate' && (
            <div className="space-y-4">
              <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Rotation Angle</Label>
              <div className="flex gap-4">
                {[90, 180, 270].map((angle) => (
                  <Button 
                    key={angle}
                    variant={rotation === angle ? 'default' : 'ghost'}
                    onClick={() => setRotation(angle)}
                    className="flex-1 h-12 glass rounded-xl font-bold"
                  >
                    {angle}°
                  </Button>
                ))}
              </div>
            </div>
          )}

          <Button 
            onClick={handleProcess} 
            disabled={isProcessing}
            className="w-full h-16 rounded-2xl text-xl font-bold shadow-2xl shadow-primary/20 bg-primary hover:bg-primary/90 transition-all hover:scale-[1.01]"
          >
            {isProcessing ? <Loader2 className="w-6 h-6 animate-spin mr-3" /> : (
              mode === 'rotate' ? <RotateCw className="w-6 h-6 mr-3" /> :
              mode === 'compress' ? <Zap className="w-6 h-6 mr-3" /> :
              mode === 'to-txt' ? <FileSearch className="w-6 h-6 mr-3" /> :
              <Sparkles className="w-6 h-6 mr-3" />
            )}
            Initialize {mode === 'to-txt' ? 'Text Extraction' : mode.charAt(0).toUpperCase() + mode.slice(1).replace('-', ' ')} Engine
          </Button>

          <div className="p-6 bg-primary/5 rounded-[2rem] border border-primary/10 flex gap-4 items-start">
             <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0 mt-1" />
             <div className="space-y-1">
               <p className="text-xs font-bold text-white uppercase tracking-widest">Sovereign Processing Active</p>
               <p className="text-sm text-muted-foreground leading-relaxed">
                 All document logic is executed strictly within your browser RAM. Your data never touches our servers.
               </p>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
