
"use client";

import React, { useState } from 'react';
import imageCompression from 'browser-image-compression';
import { saveAs } from 'file-saver';
import { FileUploader } from './FileUploader';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { ImageIcon, Download, Zap, Loader2, Sparkles, Scale } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function ImageCompressor() {
  const [file, setFile] = useState<File | null>(null);
  const [quality, setQuality] = useState([0.8]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<{ blob: Blob, size: number, saved: string } | null>(null);
  const { toast } = useToast();

  const onFilesSelected = (files: File[]) => {
    setFile(files[0]);
    setResult(null);
  };

  const handleCompress = async () => {
    if (!file) return;
    setIsProcessing(true);

    try {
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
        initialQuality: quality[0]
      };

      const compressedFile = await imageCompression(file, options);
      const savedBytes = file.size - compressedFile.size;
      const savedPercentage = ((savedBytes / file.size) * 100).toFixed(1);

      setResult({
        blob: compressedFile,
        size: compressedFile.size,
        saved: savedPercentage
      });

      toast({ title: "Compression Complete", description: `Reduced size by ${savedPercentage}%` });
    } catch (error) {
      toast({ title: "Compression Failed", variant: "destructive" });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <FileUploader 
        onFilesSelected={onFilesSelected} 
        accept={{ 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] }}
        isLoading={isProcessing}
        label="Drop your image here to compress"
      />

      {file && (
        <div className="grid md:grid-cols-2 gap-12 items-start animate-in fade-in slide-in-from-bottom-4">
          <div className="space-y-8 glass p-8 rounded-[2.5rem] border-white/5">
            <h3 className="font-headline font-bold text-xl flex items-center gap-2">
              <Scale className="w-5 h-5 text-primary" /> Settings
            </h3>
            
            <div className="space-y-6">
               <div className="space-y-4">
                 <div className="flex justify-between items-center">
                   <Label className="font-bold text-sm uppercase tracking-widest text-muted-foreground">Compression Level</Label>
                   <span className="text-xl font-bold text-primary">{Math.round((1 - quality[0]) * 100)}%</span>
                 </div>
                 <Slider 
                   value={[1 - quality[0]]} 
                   onValueChange={(v) => setQuality([1 - v[0]])}
                   max={0.9} 
                   min={0.1} 
                   step={0.05}
                 />
                 <p className="text-xs text-muted-foreground">Higher compression results in smaller files but lower image quality.</p>
               </div>

               <Button 
                onClick={handleCompress} 
                disabled={isProcessing} 
                className="w-full h-14 rounded-2xl text-lg shadow-xl shadow-primary/20"
               >
                 {isProcessing ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Zap className="w-5 h-5 mr-2" />}
                 Compress Image
               </Button>
            </div>
          </div>

          <div className="space-y-8">
            <h3 className="font-headline font-bold text-xl">Preview</h3>
            <div className="relative aspect-video rounded-[2.5rem] overflow-hidden bg-secondary/30 flex items-center justify-center border border-white/5">
               {/* eslint-disable-next-line @next/next/no-img-element */}
               <img 
                 src={URL.createObjectURL(file)} 
                 alt="Preview" 
                 className="w-full h-full object-contain"
               />
               <div className="absolute top-4 left-4 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-xs font-bold text-white uppercase">
                 Original: {(file.size / 1024).toFixed(1)} KB
               </div>
            </div>

            {result && (
              <Card className="glass border-primary/20 bg-primary/5 rounded-[2.5rem] overflow-hidden">
                <CardContent className="p-8 space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-primary uppercase tracking-widest">New Size</p>
                      <p className="text-4xl font-headline font-bold text-white">{(result.size / 1024).toFixed(1)} KB</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-green-500 uppercase tracking-widest">Saved</p>
                      <p className="text-3xl font-headline font-bold text-green-500">-{result.saved}%</p>
                    </div>
                  </div>
                  <Button 
                    className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90"
                    onClick={() => saveAs(result.blob, `compressed_infinity_${file.name}`)}
                  >
                    <Download className="w-5 h-5 mr-2" /> Download Compressed Image
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
