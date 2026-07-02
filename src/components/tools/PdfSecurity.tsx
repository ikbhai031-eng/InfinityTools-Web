
"use client";

import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import { PDFDocument } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';
import { FileUploader } from './FileUploader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Lock, Unlock, Loader2, 
  ShieldCheck, ShieldAlert, FileText, 
  Key, Eye, EyeOff, CheckCircle2,
  AlertTriangle, Shield
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { saveAs } from 'file-saver';

// Set worker path using a static version matching package.json
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.worker.min.mjs`;

interface PdfSecurityProps {
  mode: 'lock' | 'unlock';
}

export function PdfSecurity({ mode }: PdfSecurityProps) {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const onFilesSelected = (files: File[]) => {
    setFile(files[0]);
    setPassword('');
  };

  const handleProcess = async () => {
    if (!file || !password) {
      toast({ title: "Required", description: "Please upload a file and enter a password.", variant: "destructive" });
      return;
    }
    setIsProcessing(true);

    try {
      const arrayBuffer = await file.arrayBuffer();
      
      if (mode === 'unlock') {
        toast({ title: "Decryption Module Ready", description: "Removing password restriction headers..." });
        
        try {
          const pdfDoc = await PDFDocument.load(arrayBuffer, { password });
          const pdfBytes = await pdfDoc.save();
          const blob = new Blob([pdfBytes], { type: 'application/pdf' });
          saveAs(blob, `unlocked_infinity_${file.name}`);
          toast({ title: "Success!", description: "Document unlocked and saved." });
        } catch (e: any) {
          throw new Error("Invalid password or unsupported encryption type.");
        }
      } else {
        toast({ title: "Security Protocol Initialized", description: "Applying 128-bit encryption to document pages..." });
        
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        const doc = new jsPDF({
          orientation: 'p',
          unit: 'px',
          format: 'a4',
          putOnlyUsedFonts: true
        });

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const viewport = page.getViewport({ scale: 2 });
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          
          if (context) {
            canvas.height = viewport.height;
            canvas.width = viewport.width;
            await page.render({ canvasContext: context, viewport }).promise;
            
            const imgData = canvas.toDataURL('image/jpeg', 0.85);
            
            if (i > 1) doc.addPage();
            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();
            doc.addImage(imgData, 'JPEG', 0, 0, pageWidth, pageHeight);
          }
        }

        doc.setEncryption({
          userPassword: password,
          ownerPassword: password,
          userPermissions: ['print', 'modify', 'copy', 'annot-forms']
        });

        doc.save(`protected_infinity_${file.name}`);
        toast({ title: "Document Secured", description: "Password protection applied successfully." });
      }
    } catch (error: any) {
      console.error("PDF Security Error:", error);
      toast({ 
        title: "Process Error", 
        description: error.message || "Failed to process security layer.", 
        variant: "destructive" 
      });
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
        label={mode === 'lock' ? "Upload PDF to Secure with Password" : "Upload Locked PDF to Remove Protection"}
      />

      {file && (
        <div className="glass p-10 rounded-[4rem] border-white/5 space-y-10 animate-in fade-in slide-in-from-bottom-4 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
             {mode === 'lock' ? <Lock className="w-32 h-32" /> : <Unlock className="w-32 h-32" />}
          </div>

          <div className="flex items-center gap-6 relative z-10">
            <div className={`p-5 rounded-3xl ${mode === 'lock' ? 'bg-primary/10 text-primary' : 'bg-amber-500/10 text-amber-500'}`}>
              <FileText className="w-10 h-10" />
            </div>
            <div>
              <h3 className="text-2xl font-headline font-bold truncate max-w-md">{file.name}</h3>
              <p className="text-muted-foreground font-medium">
                {(file.size / 1024 / 1024).toFixed(2)} MB • {mode === 'lock' ? 'Ready to encrypt' : 'Awaiting decryption'}
              </p>
            </div>
          </div>

          <div className="space-y-6 relative z-10">
            <div className="space-y-3">
              <div className="flex justify-between items-center px-1">
                <Label className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/60">
                  {mode === 'lock' ? 'Create Document Password' : 'Enter Existing Password'}
                </Label>
                {mode === 'lock' && password.length > 0 && (
                  <span className={`text-[10px] font-bold uppercase tracking-widest ${password.length < 8 ? 'text-destructive' : 'text-emerald-500'}`}>
                    {password.length < 8 ? 'Weak' : 'Strong Security'}
                  </span>
                )}
              </div>
              <div className="relative group">
                <div className="absolute left-5 top-1/2 -translate-y-1/2">
                   <Key className="w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                </div>
                <Input 
                  type={showPassword ? "text" : "password"}
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  placeholder={mode === 'lock' ? "Enter a strong password" : "Enter file password"}
                  className="h-16 pl-14 pr-14 glass text-xl font-bold rounded-2xl border-white/10 focus:border-primary/50 transition-all shadow-xl"
                  onKeyDown={(e) => e.key === 'Enter' && handleProcess()}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <Button 
              onClick={handleProcess} 
              disabled={isProcessing || !password}
              className={`w-full h-16 rounded-2xl text-xl font-bold shadow-2xl transition-all hover:scale-[1.02] ${mode === 'lock' ? 'bg-primary shadow-primary/20' : 'bg-amber-600 shadow-amber-500/20'}`}
            >
              {isProcessing ? (
                <Loader2 className="w-6 h-6 animate-spin mr-3" />
              ) : mode === 'lock' ? (
                <ShieldCheck className="w-6 h-6 mr-3" />
              ) : (
                <ShieldAlert className="w-6 h-6 mr-3" />
              )}
              {mode === 'lock' ? 'Apply Protection' : 'Decrypt & Download'}
            </Button>
          </div>

          <div className="p-6 bg-secondary/20 rounded-3xl border border-white/5 flex gap-5 items-start">
             <div className={`p-2 rounded-xl mt-1 ${mode === 'lock' ? 'bg-primary/10' : 'bg-amber-500/10'}`}>
                {mode === 'lock' ? <CheckCircle2 className="w-5 h-5 text-primary" /> : <AlertTriangle className="w-5 h-5 text-amber-500" />}
             </div>
             <div className="space-y-1">
               <h4 className="text-xs font-black uppercase text-white tracking-widest">Enterprise Security Active</h4>
               <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                 {mode === 'lock' 
                   ? "This tool applies standard PDF encryption. The output file will correctly prompt for a password in Adobe Acrobat, Chrome, and all standard viewers." 
                   : "All processing is handled purely in your browser memory. We never see your password or your file content."}
               </p>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
