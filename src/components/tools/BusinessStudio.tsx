"use client";

import React, { useState, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { 
  FileText, Receipt, User, Building, 
  Plus, Download, Trash2, CreditCard,
  DollarSign, Loader2, RefreshCw
} from 'lucide-react';

interface BusinessStudioProps {
  mode: 'invoice' | 'receipt';
}

export function BusinessStudio({ mode }: BusinessStudioProps) {
  const previewRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [data, setData] = useState({
    from: 'InfinityTools Professional\n123 Workspace Blvd',
    to: 'Client Representative\nCorporate Office',
    items: [{ desc: 'Consultation Services', qty: '1', price: '500' }],
    tax: '10',
    invoiceNo: `${mode === 'invoice' ? 'INV' : 'REC'}-${Date.now().toString().slice(-6)}`
  });
  const { toast } = useToast();

  const addItem = () => setData({...data, items: [...data.items, { desc: '', qty: '1', price: '0' }]});
  const removeItem = (i: number) => setData({...data, items: data.items.filter((_, idx) => idx !== i)});
  
  const updateItem = (i: number, field: string, val: string) => {
    const newItems = [...data.items];
    (newItems[i] as any)[field] = val;
    setData({...data, items: newItems});
  };

  const calculateSubtotal = () => data.items.reduce((acc, item) => acc + (parseFloat(item.qty) * parseFloat(item.price) || 0), 0);
  const calculateTotal = () => {
    const sub = calculateSubtotal();
    return sub + (sub * parseFloat(data.tax) / 100);
  };

  const handleExport = async () => {
    if (!previewRef.current) return;
    setIsExporting(true);
    toast({ title: "Rendering Engine Ready", description: "Applying high-resolution professional layers..." });

    try {
      const canvas = await html2canvas(previewRef.current, {
        scale: 2.5,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false
      });
      
      const imgData = canvas.toDataURL('image/png', 1.0);
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`infinity_${mode}_${data.invoiceNo}.pdf`);
      
      toast({ title: "Document Saved", description: "Professional PDF has been successfully generated." });
    } catch (error) {
      console.error(error);
      toast({ title: "Export Error", description: "Failed to generate document layers.", variant: "destructive" });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8 md:gap-12 max-w-6xl mx-auto px-2">
      <div className="space-y-6 md:space-y-8">
        <div className="glass p-6 md:p-8 rounded-[2rem] md:rounded-[3.5rem] border-white/5 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold flex items-center gap-3">
               <Building className="w-5 h-5 text-primary" /> Entity Details
            </h3>
            <Button variant="ghost" size="sm" className="h-8 rounded-lg glass text-[10px] font-black uppercase tracking-widest" onClick={() => setData({...data, invoiceNo: `${mode === 'invoice' ? 'INV' : 'REC'}-${Date.now().toString().slice(-6)}` })}>
               <RefreshCw className="w-3 h-3 mr-2" /> New ID
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="space-y-2">
               <Label className="text-[10px] font-black uppercase opacity-40 ml-1">Sender / Billing From</Label>
               <Textarea value={data.from} onChange={(e) => setData({...data, from: e.target.value})} className="glass h-24 text-sm font-medium focus:ring-primary/20" />
             </div>
             <div className="space-y-2">
               <Label className="text-[10px] font-black uppercase opacity-40 ml-1">Recipient / Bill To</Label>
               <Textarea value={data.to} onChange={(e) => setData({...data, to: e.target.value})} className="glass h-24 text-sm font-medium focus:ring-primary/20" />
             </div>
          </div>
        </div>

        <div className="glass p-6 md:p-8 rounded-[2rem] md:rounded-[3.5rem] border-white/5 space-y-6">
           <div className="flex items-center justify-between">
             <h3 className="text-xl font-bold flex items-center gap-3"><DollarSign className="w-5 h-5 text-primary" /> Line Items</h3>
             <Button variant="ghost" size="sm" onClick={addItem} className="text-primary hover:bg-primary/10 rounded-full h-8 px-4 font-black uppercase text-[10px] tracking-widest border border-primary/20">
               <Plus className="w-3 h-3 mr-1.5" /> Add Row
             </Button>
           </div>
           <div className="space-y-4">
             {data.items.map((item, i) => (
               <div key={i} className="flex flex-col md:flex-row gap-4 items-start md:items-center group bg-white/5 p-4 rounded-2xl border border-white/5">
                 <div className="flex-1 w-full space-y-1">
                   <Label className="md:hidden text-[9px] uppercase font-black opacity-30">Description</Label>
                   <Input placeholder="Description" value={item.desc} onChange={(e) => updateItem(i, 'desc', e.target.value)} className="glass h-11 text-sm font-bold border-none" />
                 </div>
                 <div className="flex gap-4 w-full md:w-auto">
                    <div className="w-20 space-y-1">
                      <Label className="md:hidden text-[9px] uppercase font-black opacity-30">Qty</Label>
                      <Input placeholder="Qty" type="number" value={item.qty} onChange={(e) => updateItem(i, 'qty', e.target.value)} className="glass h-11 text-sm font-bold border-none text-center" />
                    </div>
                    <div className="w-32 space-y-1">
                      <Label className="md:hidden text-[9px] uppercase font-black opacity-30">Price ($)</Label>
                      <Input placeholder="Price" type="number" value={item.price} onChange={(e) => updateItem(i, 'price', e.target.value)} className="glass h-11 text-sm font-bold border-none text-right" />
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => removeItem(i)} className="h-11 w-11 rounded-xl text-destructive/40 hover:text-destructive hover:bg-destructive/10 transition-all mt-auto md:mt-0"><Trash2 className="w-4 h-4" /></Button>
                 </div>
               </div>
             ))}
           </div>
        </div>

        <Button 
          className="w-full h-16 rounded-2xl text-lg font-black uppercase tracking-widest shadow-2xl shadow-primary/20 transition-all active:scale-95" 
          onClick={handleExport}
          disabled={isExporting}
        >
          {isExporting ? <Loader2 className="w-5 h-5 animate-spin mr-3" /> : <Download className="w-5 h-5 mr-3" />}
          Download {mode}
        </Button>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between px-2">
           <h3 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
              <CreditCard className="w-4 h-4" /> Professional Preview
           </h3>
           <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-[10px] font-black uppercase text-emerald-500 tracking-widest">Live Sync</span>
           </div>
        </div>
        
        {/* Preview Container with Mobile Overflow */}
        <div className="glass rounded-[2rem] md:rounded-[4rem] border-white/10 p-2 md:p-6 overflow-hidden shadow-2xl bg-black/20">
          <div className="overflow-x-auto no-scrollbar custom-scrollbar">
            <div ref={previewRef} className="bg-white text-black min-h-[842px] w-[210mm] mx-auto p-16 flex flex-col font-sans shadow-2xl origin-top transition-transform">
               <div className="flex justify-between items-start border-b-2 border-black/10 pb-10 mb-10">
                  <div className="space-y-1">
                    <h2 className="text-5xl font-black uppercase tracking-tighter leading-none">{mode}</h2>
                    <p className="text-[10px] font-black text-gray-400 tracking-[0.2em]">DOCUMENT ID: {data.invoiceNo}</p>
                  </div>
                  <div className="text-right">
                    <div className="font-black text-2xl tracking-tighter leading-none">INFINITY TOOLS</div>
                    <div className="text-[9px] text-gray-400 font-black uppercase tracking-widest mt-1">Verification Engine Enabled</div>
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-12 mb-16">
                  <div className="space-y-3">
                    <p className="text-[11px] font-black text-primary uppercase tracking-[0.2em]">Billed From</p>
                    <p className="text-xs font-bold whitespace-pre-wrap text-gray-800 leading-relaxed">{data.from}</p>
                  </div>
                  <div className="space-y-3 text-right">
                    <p className="text-[11px] font-black text-primary uppercase tracking-[0.2em]">Bill To</p>
                    <p className="text-xs font-bold whitespace-pre-wrap text-gray-800 leading-relaxed">{data.to}</p>
                  </div>
               </div>

               <div className="flex-1">
                  <div className="grid grid-cols-4 gap-4 border-b-2 border-black/5 pb-3 mb-6 text-[10px] font-black uppercase text-gray-400 tracking-widest">
                    <div className="col-span-2">Service Description</div>
                    <div className="text-center">Units</div>
                    <div className="text-right">Total (USD)</div>
                  </div>
                  <div className="space-y-6">
                    {data.items.map((item, i) => (
                      <div key={i} className="grid grid-cols-4 gap-4 text-sm font-bold text-gray-900 border-b border-gray-50 pb-4">
                        <div className="col-span-2">{item.desc || 'Consulting Module Layer'}</div>
                        <div className="text-center">{item.qty}</div>
                        <div className="text-right">${(parseFloat(item.qty) * parseFloat(item.price) || 0).toLocaleString()}</div>
                      </div>
                    ))}
                  </div>
               </div>

               <div className="border-t-4 border-black/5 pt-10 mt-16 space-y-3">
                  <div className="flex justify-between text-xs font-black uppercase tracking-widest text-gray-400">
                    <span>Subtotal Balance</span>
                    <span className="text-gray-900">${calculateSubtotal().toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs font-black uppercase tracking-widest text-gray-400">
                    <span>Tax Assessment ({data.tax}%)</span>
                    <span className="text-gray-900">${(calculateSubtotal() * parseFloat(data.tax) / 100).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-end pt-6 mt-4 border-t border-black/5">
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">Final Verification</p>
                      <h4 className="text-4xl font-black uppercase tracking-tighter">Grand Total</h4>
                    </div>
                    <span className="text-5xl font-black tracking-tighter text-primary">${calculateTotal().toLocaleString()}</span>
                  </div>
               </div>

               <div className="mt-auto pt-16 flex justify-between items-center opacity-40">
                  <div className="text-[8px] font-black uppercase tracking-[0.5em] text-gray-400">
                    Authentic Professional Utility • Processed Locally
                  </div>
                  <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center">
                    <ShieldCheck className="w-6 h-6 text-gray-300" />
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
