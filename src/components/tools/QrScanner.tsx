
"use client";

import React, { useState, useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Scan, Copy, ExternalLink, Trash2 } from 'lucide-react';

export function QrScanner() {
  const [scannedResult, setScannedResult] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "reader",
      { fps: 10, qrbox: { width: 250, height: 250 } },
      /* verbose= */ false
    );

    scanner.render((result) => {
      setScannedResult(result);
      scanner.clear();
      toast({ title: "QR Code Scanned!", description: "Check the result below." });
    }, (error) => {
      // Ignore scanning errors
    });

    return () => {
      scanner.clear().catch(error => console.error("Failed to clear scanner", error));
    };
  }, [toast]);

  const reset = () => {
    setScannedResult(null);
    window.location.reload(); // Re-initialize scanner
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="glass rounded-[3rem] overflow-hidden border-white/5 relative bg-black/40">
        <div id="reader" className="w-full"></div>
        {!scannedResult && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none opacity-20">
             <Scan className="w-20 h-20 mb-4" />
             <p className="font-bold uppercase tracking-widest text-sm">Waiting for camera...</p>
          </div>
        )}
      </div>

      {scannedResult && (
        <Card className="glass border-primary/20 bg-primary/5 rounded-[2.5rem] animate-in fade-in slide-in-from-bottom-4">
          <CardContent className="p-8 space-y-6">
            <div className="space-y-2">
              <p className="text-xs font-bold text-primary uppercase tracking-[0.2em]">Scanned Content</p>
              <div className="p-4 glass bg-secondary/30 rounded-2xl break-all font-mono text-sm border-white/5">
                {scannedResult}
              </div>
            </div>

            <div className="flex gap-4">
              <Button className="flex-1 h-12 rounded-xl" onClick={() => {
                navigator.clipboard.writeText(scannedResult);
                toast({ title: "Copied" });
              }}>
                <Copy className="w-4 h-4 mr-2" /> Copy
              </Button>
              {scannedResult.startsWith('http') && (
                <Button className="flex-1 h-12 rounded-xl" variant="outline" onClick={() => window.open(scannedResult, '_blank')}>
                  <ExternalLink className="w-4 h-4 mr-2" /> Visit URL
                </Button>
              )}
              <Button variant="ghost" size="icon" className="h-12 w-12 rounded-xl text-destructive" onClick={reset}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="text-center">
        <p className="text-muted-foreground text-sm">
          Place your QR code within the scan area to decode it instantly.
        </p>
      </div>
    </div>
  );
}
