
"use client";

import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, File as FileIcon, Loader2, Files, CheckCircle2, AlertTriangle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';

interface FileUploaderProps {
  onFilesSelected: (files: File[]) => void;
  accept?: Record<string, string[]>;
  maxFiles?: number;
  isLoading?: boolean;
  progress?: number;
  label?: string;
  multiple?: boolean;
  maxSizeMB?: number;
  processingLabel?: string;
}

export function FileUploader({ 
  onFilesSelected, 
  accept, 
  maxFiles = 1, 
  isLoading = false,
  progress = 0,
  label = "Click to upload or drag and drop",
  multiple = false,
  maxSizeMB = 50,
  processingLabel = "Initializing Engine"
}: FileUploaderProps) {
  const [localFiles, setLocalFiles] = useState<File[]>([]);
  const { toast } = useToast();

  const onDrop = useCallback((acceptedFiles: File[], fileRejections: any[]) => {
    if (fileRejections.length > 0) {
      const error = fileRejections[0].errors[0];
      let msg = "Invalid file type or size.";
      if (error.code === "file-too-large") msg = `File exceeds the ${maxSizeMB}MB safety limit.`;
      if (error.code === "file-invalid-type") msg = "File type not supported for this module.";
      
      toast({ 
        title: "Validation Error", 
        description: msg, 
        variant: "destructive" 
      });
      return;
    }

    setLocalFiles(acceptedFiles);
    onFilesSelected(acceptedFiles);
  }, [onFilesSelected, maxSizeMB, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxFiles: multiple ? 100 : maxFiles,
    maxSize: maxSizeMB * 1024 * 1024,
    multiple,
    disabled: isLoading
  });

  return (
    <div className="w-full space-y-6">
      <div 
        {...getRootProps()} 
        className={cn(
          "relative group border-2 border-dashed rounded-[3rem] p-12 md:p-20 transition-all cursor-pointer text-center flex flex-col items-center justify-center gap-6 bg-secondary/[0.03] overflow-hidden",
          isDragActive ? "border-primary bg-primary/10 scale-[0.99] shadow-2xl shadow-primary/20" : "border-white/10 hover:border-primary/50 hover:bg-white/[0.05]",
          isLoading && "opacity-80 cursor-not-allowed border-primary/30"
        )}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        
        <input {...getInputProps()} />
        
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div 
              key="loading"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="flex flex-col items-center gap-8 relative z-10"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full animate-pulse"></div>
                <div className="p-8 bg-primary/10 rounded-[2.5rem] relative">
                  <Loader2 className="w-12 h-12 text-primary animate-spin" />
                </div>
              </div>
              
              <div className="space-y-3">
                <p className="text-2xl font-headline font-bold text-white tracking-tight animate-pulse">
                  {processingLabel}...
                </p>
                <div className="flex flex-col items-center gap-4">
                  <div className="w-64 h-2 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-primary"
                      initial={{ width: "0%" }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                  <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">
                    Sovereign Buffer: {progress}% Complete
                  </span>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="idle"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center gap-6 relative z-10"
            >
              <div className="p-8 bg-primary/10 rounded-[2.5rem] group-hover:scale-110 transition-all duration-700 shadow-2xl group-hover:shadow-primary/40 group-hover:rotate-6">
                {multiple ? (
                  <Files className="w-12 h-12 text-primary" />
                ) : (
                  <Upload className="w-12 h-12 text-primary" />
                )}
              </div>
              
              <div className="space-y-3">
                <p className="text-2xl md:text-3xl font-headline font-bold text-white tracking-tight">{label}</p>
                <div className="flex flex-col items-center gap-1">
                  <p className="text-xs md:text-sm font-black text-muted-foreground/60 uppercase tracking-[0.3em]">
                    {accept ? `Supports: ${Object.values(accept).flat().join(', ')}` : "All enterprise file types supported"}
                  </p>
                  <p className="text-[10px] font-bold text-muted-foreground/30 uppercase tracking-widest">Safety Limit: {maxSizeMB}MB per file</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {localFiles.length > 0 && !isLoading && (
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="absolute bottom-8 px-6 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center gap-2"
          >
             <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
             <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">{localFiles.length} {localFiles.length === 1 ? 'File' : 'Files'} Staged</span>
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {localFiles.length > 0 && !isLoading && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
             {localFiles.slice(0, 4).map((file, i) => (
               <motion.div 
                 key={i} 
                 initial={{ scale: 0.9, opacity: 0 }}
                 animate={{ scale: 1, opacity: 1 }}
                 transition={{ delay: i * 0.1 }}
                 className="glass p-4 rounded-2xl border-white/5 flex items-center justify-between group"
               >
                  <div className="flex items-center gap-3 overflow-hidden">
                     <div className="p-2 bg-white/5 rounded-lg"><FileIcon className="w-4 h-4 text-primary" /></div>
                     <div className="min-w-0">
                        <p className="text-xs font-bold text-white truncate">{file.name}</p>
                        <p className="text-[9px] font-black uppercase text-muted-foreground/40 tracking-widest">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                     </div>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive/40 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/10" onClick={(e) => { e.stopPropagation(); setLocalFiles(prev => prev.filter((_, idx) => idx !== i)) }}>
                     <X className="w-3.5 h-3.5" />
                  </Button>
               </motion.div>
             ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
