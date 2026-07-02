"use client";

import React, { useState, useRef, useEffect } from 'react';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';
import { saveAs } from 'file-saver';
import { FileUploader } from './FileUploader';
import { Button } from '@/components/ui/button';
import { 
  Type, Loader2, Download, 
  Trash2, ZoomIn, ZoomOut, PenTool, 
  Square, MousePointer2, X, RotateCcw,
  PlusSquare, Minus, Save, Layers, List,
  Columns, Layout, ArrowUp, ArrowDown, Copy
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

// Set worker path
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.worker.min.mjs`;

type ToolMode = 'select' | 'text' | 'draw' | 'whiteout' | 'shape';

interface Annotation {
  id: string;
  type: ToolMode;
  pageIndex: number;
  x: number;
  y: number;
  content?: string;
  width?: number;
  height?: number;
  fontSize?: number;
  color?: string;
}

export function PdfEditor() {
  const [file, setFile] = useState<File | null>(null);
  const [pdfDoc, setPdfDoc] = useState<pdfjsLib.PDFDocumentProxy | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(1.0);
  const [activeTool, setActiveTool] = useState<ToolMode>('select');
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRendering, setIsRendering] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [thumbnails, setThumbnails] = useState<string[]>([]);
  const [showSidebar, setShowSidebar] = useState(true);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const generateThumbnails = async (pdf: pdfjsLib.PDFDocumentProxy) => {
    const thumbs = [];
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale: 0.2 });
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      if (context) {
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        await page.render({ canvasContext: context, viewport }).promise;
        thumbs.push(canvas.toDataURL());
      }
    }
    setThumbnails(thumbs);
  };

  const onFilesSelected = async (files: File[]) => {
    const selectedFile = files[0];
    if (!selectedFile) return;
    
    setIsProcessing(true);
    setFile(selectedFile);

    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;
      setPdfDoc(pdf);
      setCurrentPage(1);
      setAnnotations([]);
      await generateThumbnails(pdf);
      toast({ title: "Workstation Initialized", description: `${pdf.numPages} pages loaded for processing.` });
    } catch (e) {
      toast({ title: "Integrity Error", description: "Failed to load document.", variant: "destructive" });
      setFile(null);
    } finally {
      setIsProcessing(false);
    }
  };

  const renderPage = async (num: number, zoomLevel: number) => {
    if (!pdfDoc || !canvasRef.current) return;
    setIsRendering(true);

    try {
      const page = await pdfDoc.getPage(num);
      const viewport = page.getViewport({ scale: zoomLevel * 2 }); // High-res rendering
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      if (context) {
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        await page.render({ canvasContext: context, viewport }).promise;
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsRendering(false);
    }
  };

  useEffect(() => {
    if (pdfDoc) renderPage(currentPage, zoom);
  }, [pdfDoc, currentPage, zoom]);

  const handleInteraction = (e: React.MouseEvent) => {
    if (!containerRef.current || activeTool === 'select') return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / zoom;
    const y = (e.clientY - rect.top) / zoom;

    const newAnn: Annotation = {
      id: Date.now().toString(),
      type: activeTool,
      pageIndex: currentPage - 1,
      x,
      y,
      content: activeTool === 'text' ? 'Double click to edit' : '',
      width: activeTool === 'whiteout' || activeTool === 'shape' ? 120 : 0,
      height: activeTool === 'whiteout' || activeTool === 'shape' ? 40 : 0,
      fontSize: 16,
      color: activeTool === 'shape' ? '#6366f1' : '#000000'
    };

    setAnnotations(prev => [...prev, newAnn]);
    setActiveTool('select');
    setSelectedId(newAnn.id);
  };

  const deletePage = async () => {
    if (!file || !pdfDoc || pdfDoc.numPages <= 1) {
      toast({ title: "Operation Denied", description: "Cannot delete the last page.", variant: "destructive" });
      return;
    }
    setIsProcessing(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const doc = await PDFDocument.load(arrayBuffer);
      doc.removePage(currentPage - 1);
      const pdfBytes = await doc.save();
      const newFile = new File([pdfBytes], file.name, { type: 'application/pdf' });
      setFile(newFile);
      
      const pdf = await pdfjsLib.getDocument({ data: pdfBytes }).promise;
      setPdfDoc(pdf);
      setCurrentPage(Math.max(1, currentPage - 1));
      await generateThumbnails(pdf);
      toast({ title: "Page Purged", description: "Structure updated in local buffer." });
    } finally {
      setIsProcessing(false);
    }
  };

  const addBlankPage = async () => {
    if (!file || !pdfDoc) return;
    setIsProcessing(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const doc = await PDFDocument.load(arrayBuffer);
      doc.insertPage(currentPage, [595.28, 841.89]); // A4 Size
      const pdfBytes = await doc.save();
      const newFile = new File([pdfBytes], file.name, { type: 'application/pdf' });
      setFile(newFile);
      
      const pdf = await pdfjsLib.getDocument({ data: pdfBytes }).promise;
      setPdfDoc(pdf);
      await generateThumbnails(pdf);
      toast({ title: "Page Added", description: "Blank A4 page inserted." });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleExport = async () => {
    if (!file) return;
    setIsProcessing(true);
    toast({ title: "Export Protocol Active", description: "Flattening professional layers..." });

    try {
      const arrayBuffer = await file.arrayBuffer();
      const doc = await PDFDocument.load(arrayBuffer);
      const pages = doc.getPages();
      const standardFont = await doc.embedFont(StandardFonts.HelveticaBold);

      for (const ann of annotations) {
        if (ann.pageIndex >= pages.length) continue;
        const page = pages[ann.pageIndex];
        const { height: pageHeight } = page.getSize();
        
        const pdfX = ann.x;
        const pdfY = pageHeight - ann.y;

        if (ann.type === 'text' && ann.content) {
          page.drawText(ann.content, {
            x: pdfX,
            y: pdfY - (ann.fontSize || 16),
            size: ann.fontSize || 16,
            font: standardFont,
            color: rgb(0, 0, 0)
          });
        } else if (ann.type === 'whiteout') {
          page.drawRectangle({
            x: pdfX - (ann.width || 120) / 2,
            y: pdfY - (ann.height || 40) / 2,
            width: ann.width || 120,
            height: ann.height || 40,
            color: rgb(1, 1, 1)
          });
        } else if (ann.type === 'shape') {
          page.drawRectangle({
            x: pdfX - (ann.width || 120) / 2,
            y: pdfY - (ann.height || 40) / 2,
            width: ann.width || 120,
            height: ann.height || 40,
            color: rgb(99/255, 102/255, 241/255),
            opacity: 0.5
          });
        }
      }

      const pdfBytes = await doc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      saveAs(blob, `edited_station_${file.name}`);
      toast({ title: "Workstation Exported", description: "Professional PDF saved to disk." });
    } catch (e) {
      toast({ title: "Export Failed", variant: "destructive" });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col h-[85vh] bg-[#0c0c0e] rounded-[3rem] overflow-hidden border border-white/5 shadow-2xl relative">
      {!file ? (
        <div className="flex-1 flex items-center justify-center p-12">
          <FileUploader 
            onFilesSelected={onFilesSelected} 
            accept={{ 'application/pdf': ['.pdf'] }}
            isLoading={isProcessing}
            label="Initialize Professional PDF Workstation"
            maxSizeMB={150}
          />
        </div>
      ) : (
        <>
          <header className="h-20 bg-[#121214] border-b border-white/5 flex items-center justify-between px-6 md:px-10 shrink-0">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => setFile(null)} className="hover:bg-white/5 hidden md:flex"><RotateCcw className="w-5 h-5 text-muted-foreground" /></Button>
              <Button variant="ghost" size="icon" onClick={() => setShowSidebar(!showSidebar)} className={cn("transition-colors", showSidebar ? "text-primary bg-primary/10" : "text-muted-foreground")}><Columns className="w-5 h-5" /></Button>
              <div className="w-px h-8 bg-white/10 mx-2 hidden md:block" />
              <div className="flex items-center gap-1 md:gap-2">
                <ToolIcon icon={MousePointer2} active={activeTool === 'select'} onClick={() => setActiveTool('select')} label="Select" />
                <ToolIcon icon={Type} active={activeTool === 'text'} onClick={() => setActiveTool('text')} label="Text" />
                <ToolIcon icon={Square} active={activeTool === 'shape'} onClick={() => setActiveTool('shape')} label="Shape" />
                <ToolIcon icon={Layers} active={activeTool === 'whiteout'} onClick={() => setActiveTool('whiteout')} label="Erase" />
              </div>
            </div>

            <div className="flex items-center gap-3 md:gap-6">
              <div className="hidden lg:flex items-center glass rounded-2xl px-4 py-1.5 h-12">
                <Button variant="ghost" size="icon" onClick={() => setZoom(z => Math.max(0.3, z - 0.1))} className="h-8 w-8"><Minus className="w-4 h-4" /></Button>
                <span className="text-[10px] font-black w-14 text-center uppercase tracking-widest text-primary">{Math.round(zoom * 100)}%</span>
                <Button variant="ghost" size="icon" onClick={() => setZoom(z => Math.min(3, z + 0.1))} className="h-8 w-8"><PlusSquare className="w-4 h-4" /></Button>
              </div>
              <Button onClick={handleExport} disabled={isProcessing} className="bg-primary hover:bg-primary/90 h-12 px-6 md:px-8 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] shadow-xl shadow-primary/20">
                {isProcessing ? <Loader2 className="w-4 h-4 animate-spin mr-3" /> : <Save className="w-4 h-4 mr-3" />}
                Export
              </Button>
            </div>
          </header>

          <div className="flex-1 flex overflow-hidden">
            <AnimatePresence>
              {showSidebar && (
                <motion.aside 
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 300, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  className="border-r border-white/5 bg-[#121214] flex flex-col overflow-hidden"
                >
                  <div className="p-6 border-b border-white/5 flex items-center justify-between">
                     <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/30">Hierarchy</p>
                     <div className="flex gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8" title="Add Page" onClick={addBlankPage}><PlusSquare className="w-3.5 h-3.5" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" title="Delete Page" onClick={deletePage}><Trash2 className="w-3.5 h-3.5" /></Button>
                     </div>
                  </div>
                  <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                    {thumbnails.map((thumb, i) => (
                      <div 
                        key={i} 
                        onClick={() => setCurrentPage(i + 1)}
                        className={cn(
                          "relative cursor-pointer rounded-2xl overflow-hidden border-2 transition-all p-1.5 group",
                          currentPage === i + 1 ? "border-primary bg-primary/10" : "border-transparent bg-white/5"
                        )}
                      >
                        <img src={thumb} alt={`P${i + 1}`} className="w-full h-auto rounded-xl" />
                        <div className="absolute top-4 left-4 bg-black/80 px-2.5 py-1 rounded-lg text-[9px] font-black text-white uppercase">{i + 1}</div>
                        <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    ))}
                  </div>
                </motion.aside>
              )}
            </AnimatePresence>

            <main className="flex-1 overflow-auto bg-[#08080a] relative flex justify-center p-8 md:p-16 custom-scrollbar no-scrollbar">
              {isRendering && (
                <div className="absolute inset-0 z-50 bg-[#08080a]/80 backdrop-blur-xl flex flex-col items-center justify-center gap-6">
                  <Loader2 className="w-12 h-12 text-primary animate-spin" />
                  <p className="text-[10px] font-black uppercase tracking-[0.5em] text-primary">Rendering Engine...</p>
                </div>
              )}

              <div 
                ref={containerRef}
                onClick={handleInteraction}
                className={cn(
                  "relative bg-white shadow-2xl transition-all duration-500 origin-top border-4 border-white/10",
                  activeTool === 'select' ? "cursor-default" : "cursor-crosshair"
                )}
                style={{ 
                  width: canvasRef.current?.width ? (canvasRef.current.width / 2) * zoom : 'auto',
                  height: canvasRef.current?.height ? (canvasRef.current.height / 2) * zoom : 'auto'
                }}
              >
                <canvas ref={canvasRef} className="w-full h-full" />
                
                {annotations.filter(a => a.pageIndex === currentPage - 1).map(ann => (
                  <div 
                    key={ann.id}
                    className={cn(
                      "absolute group transition-all",
                      selectedId === ann.id ? "ring-4 ring-primary ring-offset-4 ring-offset-white" : ""
                    )}
                    style={{ 
                      left: `${ann.x * zoom}px`, 
                      top: `${ann.y * zoom}px`,
                      transform: 'translate(-50%, -50%)',
                      zIndex: selectedId === ann.id ? 100 : 10
                    }}
                    onMouseDown={(e) => { e.stopPropagation(); setSelectedId(ann.id); }}
                  >
                    {ann.type === 'text' && (
                      <input 
                        className="bg-transparent border-none outline-none font-black text-black min-w-[20px]"
                        style={{ fontSize: `${(ann.fontSize || 16) * zoom}px`, width: `${(ann.content?.length || 1) * 12 * zoom}px` }}
                        value={ann.content}
                        onChange={(e) => setAnnotations(prev => prev.map(a => a.id === ann.id ? { ...a, content: e.target.value } : a))}
                        autoFocus
                      />
                    )}
                    {ann.type === 'whiteout' && (
                      <div 
                        className="bg-white border border-gray-100 shadow-sm"
                        style={{ width: `${(ann.width || 120) * zoom}px`, height: `${(ann.height || 40) * zoom}px` }}
                      />
                    )}
                    {ann.type === 'shape' && (
                      <div 
                        className="bg-primary/50 border border-primary/20"
                        style={{ width: `${(ann.width || 120) * zoom}px`, height: `${(ann.height || 40) * zoom}px` }}
                      />
                    )}
                    {selectedId === ann.id && (
                      <Button variant="destructive" size="icon" className="absolute -top-10 -right-10 h-8 w-8 rounded-lg" onClick={() => setAnnotations(prev => prev.filter(a => a.id !== ann.id))}>
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </main>
          </div>
        </>
      )}
    </div>
  );
}

function ToolIcon({ icon: Icon, active, onClick, label }: { icon: any, active: boolean, onClick: () => void, label: string }) {
  return (
    <Button 
      variant="ghost" 
      onClick={onClick}
      className={cn(
        "h-12 px-4 md:px-5 rounded-2xl transition-all gap-3 font-bold text-[10px] uppercase tracking-widest",
        active ? "bg-primary text-white shadow-xl shadow-primary/20 scale-105" : "hover:bg-white/5 text-muted-foreground/60"
      )}
    >
      <Icon className="w-5 h-5" />
      <span className="hidden lg:inline">{label}</span>
    </Button>
  );
}
