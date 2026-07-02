
"use client";

import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import { 
  Calculator, Receipt, TrendingUp, 
  Download, Wallet, Percent, Calendar
} from 'lucide-react';

interface FinanceStudioProps {
  mode: 'emi' | 'gst' | 'sip';
}

export function FinanceStudio({ mode }: FinanceStudioProps) {
  const [amount, setAmount] = useState(100000);
  const [rate, setRate] = useState(8);
  const [tenure, setTenure] = useState(5);
  const [result, setResult] = useState<any>(null);
  const { toast } = useToast();

  const calculate = () => {
    if (mode === 'emi') {
      const r = rate / 12 / 100;
      const n = tenure * 12;
      const emi = (amount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      const totalPayable = emi * n;
      const totalInterest = totalPayable - amount;
      setResult({ 
        mainValue: Math.round(emi), 
        label: "Monthly EMI",
        secondaryLabel: "Total Interest",
        secondaryValue: Math.round(totalInterest),
        totalLabel: "Total Payment",
        totalValue: Math.round(totalPayable)
      });
    } else if (mode === 'gst') {
      const gst = (amount * rate) / 100;
      setResult({ 
        mainValue: Math.round(gst), 
        label: "GST Amount",
        secondaryLabel: "Net Amount",
        secondaryValue: Math.round(amount),
        totalLabel: "Gross Total",
        totalValue: Math.round(amount + gst)
      });
    } else if (mode === 'sip') {
      const i = rate / 12 / 100;
      const n = tenure * 12;
      const fv = amount * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
      const invested = amount * n;
      setResult({ 
        mainValue: Math.round(fv), 
        label: "Future Wealth",
        secondaryLabel: "Returns Gained",
        secondaryValue: Math.round(fv - invested),
        totalLabel: "Total Invested",
        totalValue: Math.round(invested)
      });
    }
  };

  useEffect(() => {
    calculate();
  }, [amount, rate, tenure, mode]);

  return (
    <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto items-start">
      <div className="space-y-8 glass p-10 rounded-[3rem] border-white/5 bg-primary/[0.02]">
        <div className="space-y-8">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                {mode === 'sip' ? 'Monthly Investment' : 'Principal Amount'}
              </Label>
              <span className="text-primary font-bold">${amount.toLocaleString()}</span>
            </div>
            <Input 
              type="number" 
              value={amount} 
              onChange={(e) => setAmount(Number(e.target.value))}
              className="h-14 glass text-lg font-bold border-white/5"
            />
            <Slider value={[amount]} onValueChange={(v) => setAmount(v[0])} max={mode === 'sip' ? 100000 : 10000000} step={100} />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Rate (%)</Label>
              <span className="text-primary font-bold">{rate}%</span>
            </div>
            <Input 
              type="number" 
              value={rate} 
              onChange={(e) => setRate(Number(e.target.value))}
              className="h-14 glass text-lg font-bold border-white/5"
            />
            <Slider value={[rate]} onValueChange={(v) => setRate(v[0])} max={30} min={1} step={0.1} />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                {mode === 'gst' ? 'GST Rate (%)' : 'Tenure (Years)'}
              </Label>
              <span className="text-primary font-bold">{tenure} {mode !== 'gst' && 'Years'}</span>
            </div>
            <Input 
              type="number" 
              value={tenure} 
              onChange={(e) => setTenure(Number(e.target.value))}
              className="h-14 glass text-lg font-bold border-white/5"
            />
            <Slider value={[tenure]} onValueChange={(v) => setTenure(v[0])} max={30} min={1} step={1} />
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-center space-y-6">
        {result && (
          <div className="glass p-10 rounded-[3rem] border-primary/20 bg-primary/5 space-y-8 animate-in fade-in slide-in-from-right-4">
            <div className="space-y-2">
              <p className="text-sm font-bold text-primary uppercase tracking-widest">
                {result.label}
              </p>
              <h2 className="text-6xl font-headline font-bold text-white tracking-tighter">
                ${result.mainValue.toLocaleString()}
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-8 border-t border-white/10 pt-8">
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase mb-1">{result.totalLabel}</p>
                <p className="text-2xl font-bold text-white">${result.totalValue.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase mb-1">{result.secondaryLabel}</p>
                <p className="text-2xl font-bold text-emerald-500">${result.secondaryValue.toLocaleString()}</p>
              </div>
            </div>

            <Button className="w-full h-16 rounded-2xl shadow-xl shadow-primary/20 text-lg font-bold bg-primary hover:bg-primary/90" onClick={() => toast({ title: "Report Download Started", description: "Generating detailed financial PDF..." })}>
               <Download className="w-5 h-5 mr-3" /> Get Financial Statement
            </Button>
            
            <p className="text-[10px] text-center text-muted-foreground uppercase tracking-widest font-bold opacity-50">
              * Calculations based on standard financial algorithms
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
