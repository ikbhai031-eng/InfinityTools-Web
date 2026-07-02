"use client";

import React, { useState, useRef, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  QrCode, Download, Link, Type, Mail, 
  MessageSquare, Wifi, Palette, Sparkles,
  Smartphone, Share2, Copy
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type QrType = 'url' | 'text' | 'email' | 'sms' | 'wifi';

export function QrGenerator() {
  const [activeType, setActiveType] = useState<QrType>('url');
  const [value, setValue] = useState('https://infinitytools.com');
  const [fgColor, setFgColor] = useState('#6366f1');
  const [bgColor, setBgColor] = useState('#ffffff');
  
  // Specific Data States
  const [url, setUrl] = useState('https://infinitytools.com');
  const [text, setText] = useState('Hello from InfinityTools');
  const [email, setEmail] = useState({ to: '', subject: '', body: '' });
  const [sms, setSms] = useState({ phone: '', message: '' });
  const [wifi, setWifi] = useState({ ssid: '', password: '', encryption: 'WPA' });

  const qrRef = useRef<SVGSVGElement>(null);
  const { toast } = useToast();

  // Update QR value when specific data changes
  useEffect(() => {
    switch (activeType) {
      case 'url':
        setValue(url || 'https://');
        break;
      case 'text':
        setValue(text);
        break;
      case 'email':
        setValue(`mailto:${email.to}?subject=${encodeURIComponent(email.subject)}&body=${encodeURIComponent(email.body)}`);
        break;
      case 'sms':
        setValue(`smsto:${sms.phone}:${sms.message}`);
        break;
      case 'wifi':
        setValue(`WIFI:T:${wifi.encryption};S:${wifi.ssid};P:${wifi.password};;`);
        break;
    }
  }, [activeType, url, text, email, sms, wifi]);

  const downloadQR = () => {
    const svg = qrRef.current;
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    
    img.onload = () => {
      canvas.width = 1024; // High-res
      canvas.height = 1024;
      if (ctx) {
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, 1024, 1024);
      }
      
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = `qr-code-infinity-${activeType}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
      toast({ title: "Branded QR Saved!", description: "High-resolution PNG downloaded." });
    };

    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  return (
    <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
      <div className="space-y-8">
        <Tabs defaultValue="url" onValueChange={(v) => setActiveType(v as QrType)} className="w-full">
          <TabsList className="grid grid-cols-5 glass p-1 h-auto rounded-2xl mb-8">
            <TabsTrigger value="url" className="rounded-xl py-3 gap-2 flex-col md:flex-row"><Link className="w-4 h-4" /> <span className="hidden md:inline">URL</span></TabsTrigger>
            <TabsTrigger value="text" className="rounded-xl py-3 gap-2 flex-col md:flex-row"><Type className="w-4 h-4" /> <span className="hidden md:inline">Text</span></TabsTrigger>
            <TabsTrigger value="email" className="rounded-xl py-3 gap-2 flex-col md:flex-row"><Mail className="w-4 h-4" /> <span className="hidden md:inline">Email</span></TabsTrigger>
            <TabsTrigger value="sms" className="rounded-xl py-3 gap-2 flex-col md:flex-row"><MessageSquare className="w-4 h-4" /> <span className="hidden md:inline">SMS</span></TabsTrigger>
            <TabsTrigger value="wifi" className="rounded-xl py-3 gap-2 flex-col md:flex-row"><Wifi className="w-4 h-4" /> <span className="hidden md:inline">WiFi</span></TabsTrigger>
          </TabsList>

          <div className="glass p-8 rounded-[2.5rem] border-white/5 bg-primary/[0.02] space-y-6">
            <TabsContent value="url" className="space-y-4 m-0 animate-in fade-in slide-in-from-left-4">
              <Label className="text-xs font-black uppercase tracking-widest opacity-60">Website Address</Label>
              <Input 
                placeholder="https://example.com" 
                value={url} 
                onChange={(e) => setUrl(e.target.value)} 
                className="h-14 glass text-lg font-medium"
              />
            </TabsContent>

            <TabsContent value="text" className="space-y-4 m-0 animate-in fade-in slide-in-from-left-4">
              <Label className="text-xs font-black uppercase tracking-widest opacity-60">Custom Message</Label>
              <Input 
                placeholder="Enter plain text..." 
                value={text} 
                onChange={(e) => setText(e.target.value)} 
                className="h-14 glass text-lg font-medium"
              />
            </TabsContent>

            <TabsContent value="email" className="space-y-4 m-0 animate-in fade-in slide-in-from-left-4">
              <div className="space-y-4">
                <Input placeholder="Recipient Email" value={email.to} onChange={(e) => setEmail({...email, to: e.target.value})} className="h-12 glass" />
                <Input placeholder="Subject" value={email.subject} onChange={(e) => setEmail({...email, subject: e.target.value})} className="h-12 glass" />
                <Input placeholder="Body Content" value={email.body} onChange={(e) => setEmail({...email, body: e.target.value})} className="h-12 glass" />
              </div>
            </TabsContent>

            <TabsContent value="sms" className="space-y-4 m-0 animate-in fade-in slide-in-from-left-4">
              <div className="space-y-4">
                <Input placeholder="Phone Number (e.g. +123456789)" value={sms.phone} onChange={(e) => setSms({...sms, phone: e.target.value})} className="h-12 glass" />
                <Input placeholder="SMS Message" value={sms.message} onChange={(e) => setSms({...sms, message: e.target.value})} className="h-12 glass" />
              </div>
            </TabsContent>

            <TabsContent value="wifi" className="space-y-4 m-0 animate-in fade-in slide-in-from-left-4">
              <div className="space-y-4">
                <Input placeholder="WiFi Network Name (SSID)" value={wifi.ssid} onChange={(e) => setWifi({...wifi, ssid: e.target.value})} className="h-12 glass" />
                <Input placeholder="WiFi Password" type="password" value={wifi.password} onChange={(e) => setWifi({...wifi, password: e.target.value})} className="h-12 glass" />
              </div>
            </TabsContent>
          </div>
        </Tabs>

        {/* Branding Controls */}
        <div className="glass p-8 rounded-[2.5rem] border-white/5 space-y-6">
          <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
            <Palette className="w-4 h-4" /> Branding & Styling
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase opacity-40">Foreground</Label>
              <div className="flex gap-2">
                <input 
                  type="color" 
                  value={fgColor} 
                  onChange={(e) => setFgColor(e.target.value)}
                  className="w-10 h-10 rounded-lg bg-transparent border-none cursor-pointer"
                />
                <Input value={fgColor} readOnly className="h-10 glass font-mono text-xs" />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase opacity-40">Background</Label>
              <div className="flex gap-2">
                <input 
                  type="color" 
                  value={bgColor} 
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-10 h-10 rounded-lg bg-transparent border-none cursor-pointer"
                />
                <Input value={bgColor} readOnly className="h-10 glass font-mono text-xs" />
              </div>
            </div>
          </div>
        </div>

        <Button onClick={downloadQR} className="w-full h-16 rounded-2xl text-xl font-bold shadow-2xl shadow-primary/30 group">
          <Download className="w-5 h-5 mr-3 group-hover:bounce" /> Export Branding Kit (PNG)
        </Button>
      </div>

      <div className="flex flex-col items-center justify-center space-y-8">
        <div 
          className="p-16 rounded-[4rem] shadow-2xl transition-all duration-700 hover:scale-[1.02]"
          style={{ backgroundColor: bgColor }}
        >
          <QRCodeSVG 
            ref={qrRef}
            value={value} 
            size={300} 
            fgColor={fgColor}
            bgColor={bgColor}
            level="H"
            includeMargin={true}
          />
        </div>
        
        <div className="text-center space-y-2 max-w-sm">
           <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full text-[10px] font-black uppercase tracking-widest text-primary border border-primary/20">
             <Sparkles className="w-3 h-3" /> Live Precision Rendering
           </div>
           <p className="text-muted-foreground text-sm font-medium">
             This QR code is generated using <span className="text-white font-bold">Error Correction Level H</span>, making it readable even if 30% of the surface is damaged.
           </p>
        </div>

        <div className="flex gap-4">
          <Button variant="ghost" className="rounded-xl glass gap-2 h-12" onClick={() => {
            navigator.clipboard.writeText(value);
            toast({ title: "Copied to clipboard" });
          }}>
            <Copy className="w-4 h-4" /> Copy Content
          </Button>
          <Button variant="ghost" className="rounded-xl glass gap-2 h-12">
            <Share2 className="w-4 h-4" /> Share Template
          </Button>
        </div>
      </div>
    </div>
  );
}