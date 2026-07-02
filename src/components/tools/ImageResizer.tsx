
"use client";

import React, { useState, useRef, useEffect } from 'react';
import { FileUploader } from './FileUploader';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Maximize2, Loader2, Download, Scale, ArrowRightLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function ImageResizer() {
  const [file, setFile] = useState<File | null>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [aspectRatio, setAspectRatio] = useState(1);
  const [lockAspect, setLockAspect] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const onFilesSelected = (files: File[]) => {
    const img = new Image();
    const reader = new FileReader();
    reader.onload = (e) => {
      img.onload = () => {
        setDimensions({ width: img.width, height: img.height });
        setAspectRatio(img.width / img.height);
        setFile(files[0]);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(files[0]);
  };

  const handleWidthChange = (val: string) => {
    const width = parseInt(val) || 0;
    const height = lockAspect ? Math.round(width / aspectRatio) : dimensions.height;
    setDimensions({ width, height });
  };

  const handleHeightChange = (val: string) => {
    const height = parseInt(val) || 0;
    const width = lockAspect ? Math.round(height * aspectRatio) : dimensions.width;
    setDimensions({ width, height });
  };

  const handleResize = () => {
    if (!file) return;
    setIsProcessing(true);

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      canvas.width = dimensions.width;
      canvas.height = dimensions.height;
      ctx?.drawImage(img, 0, 0, dimensions.width, dimensions.height);
      
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `resized_infinity_${file.name}`;
          a.click();
          toast({ title: "Success", description: "Image resized and downloaded." });
        }
        setIsProcessing(false);
      }, file.type);
    };

    const reader = new FileReader();
    reader.onload = (e) => img.src = e.target?.result as string;
    reader.readAsDataURL(file);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <FileUploader 
        onFilesSelected={onFilesSelected} 
        accept={{ 'image/*': [] }}
        isLoading={isProcessing}
        label="Drop image here to change its dimensions"
      />

      {file && (
        <div className="grid md:grid-cols-2 gap-12 animate-in fade-in slide-in-from-bottom-4">
          <div className="space-y-8 glass p-8 rounded-[2.5rem] border-white/5">
            <h3 className="text-xl font-bold flex items-center gap-2"><Scale className="w-5 h-5 text-primary" /> Dimensions</h3>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase text-muted-foreground">Width (px)</Label>
                <Input 
                  type="number" 
                  value={dimensions.width} 
                  onChange={(e) => handleWidthChange(e.target.value)}
                  className="h-12 glass text-lg font-bold"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase text-muted-foreground">Height (px)</Label>
                <Input 
                  type="number" 
                  value={dimensions.height} 
                  onChange={(e) => handleHeightChange(e.target.value)}
                  className="h-12 glass text-lg font-bold"
                />
              </div>
            </div>

            <div 
              className={`flex items-center gap-3 p-4 rounded-2xl cursor-pointer transition-colors ${lockAspect ? 'bg-primary/10 text-primary border border-primary/20' : 'bg-secondary/30 text-muted-foreground border border-white/5'}`}
              onClick={() => setLockAspect(!lockAspect)}
            >
              <ArrowRightLeft className="w-4 h-4" />
              <span className="text-sm font-bold uppercase tracking-widest">Maintain Aspect Ratio</span>
            </div>

            <Button onClick={handleResize} disabled={isProcessing} className="w-full h-14 rounded-2xl text-lg shadow-xl shadow-primary/20">
              {isProcessing ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Maximize2 className="w-5 h-5 mr-2" />}
              Resize & Download
            </Button>
          </div>

          <div className="relative aspect-square glass rounded-[2.5rem] overflow-hidden flex items-center justify-center p-8">
             {/* eslint-disable-next-line @next/next/no-img-element */}
             <img src={URL.createObjectURL(file)} alt="Preview" className="max-w-full max-h-full object-contain rounded-xl shadow-2xl" />
             <div className="absolute bottom-4 right-4 bg-black/80 px-4 py-1.5 rounded-full text-xs font-bold text-white backdrop-blur-md">
                Original: {Math.round(aspectRatio * 100) / 100}:1
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
