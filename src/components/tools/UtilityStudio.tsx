
"use client";

import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Hash, Calendar, RefreshCw, Copy, Sparkles, Clock, Ruler, Scale, BarChart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { QRCodeSVG } from 'qrcode.react';

interface UtilityStudioProps {
  mode: 'uuid' | 'age' | 'date' | 'unit-converter' | 'bmi-calculator' | 'barcode-generator';
}

const UNITS = {
  length: {
    meters: 1,
    kilometers: 0.001,
    centimeters: 100,
    miles: 0.000621371,
    feet: 3.28084,
  },
  weight: {
    kilograms: 1,
    grams: 1000,
    pounds: 2.20462,
    ounces: 35.274,
  },
  data: {
    megabytes: 1,
    gigabytes: 0.001,
    kilobytes: 1024,
    terabytes: 0.000001,
  }
};

export function UtilityStudio({ mode }: UtilityStudioProps) {
  const [uuid, setUuid] = useState('');
  const [barcodeValue, setBarcodeValue] = useState('1234567890');
  const [birthDate, setBirthDate] = useState('1995-01-01');
  const [endDate, setEndDate] = useState('');
  const [ageResult, setAgeResult] = useState({ years: 0, months: 0, days: 0 });
  
  const [bmiData, setBmiData] = useState({ height: 175, weight: 70 });
  const [bmiResult, setBmiResult] = useState({ bmi: 0, label: 'Normal' });

  const [unitCategory, setUnitCategory] = useState<keyof typeof UNITS>('length');
  const [unitFrom, setUnitFrom] = useState('meters');
  const [unitTo, setUnitTo] = useState('kilometers');
  const [unitValue, setUnitValue] = useState('1');
  const [unitResult, setUnitResult] = useState('0.001');

  const { toast } = useToast();

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setEndDate(today);
    if (mode === 'uuid') generateUuid();
  }, [mode]);

  const generateUuid = () => {
    const newUuid = crypto.randomUUID();
    setUuid(newUuid);
  };

  useEffect(() => {
    if ((mode === 'age' || mode === 'date') && birthDate && endDate) {
      const birth = new Date(birthDate);
      const now = new Date(endDate);
      let years = now.getFullYear() - birth.getFullYear();
      let months = now.getMonth() - birth.getMonth();
      let days = now.getDate() - birth.getDate();

      if (days < 0) {
        months--;
        const lastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
        days += lastMonth.getDate();
      }
      if (months < 0) {
        years--;
        months += 12;
      }
      setAgeResult({ years, months, days });
    }
  }, [birthDate, endDate, mode]);

  useEffect(() => {
    if (mode === 'unit-converter') {
      const val = parseFloat(unitValue) || 0;
      const category = UNITS[unitCategory];
      const fromRate = (category as any)[unitFrom];
      const toRate = (category as any)[unitTo];
      const result = (val / fromRate) * toRate;
      setUnitResult(result.toLocaleString(undefined, { maximumFractionDigits: 6 }));
    }
  }, [unitValue, unitFrom, unitTo, unitCategory, mode]);

  useEffect(() => {
    if (mode === 'bmi-calculator') {
      const h = bmiData.height / 100;
      const bmi = bmiData.weight / (h * h);
      let label = 'Normal';
      if (bmi < 18.5) label = 'Underweight';
      else if (bmi >= 25 && bmi < 30) label = 'Overweight';
      else if (bmi >= 30) label = 'Obese';
      setBmiResult({ bmi: Number(bmi.toFixed(1)), label });
    }
  }, [bmiData, mode]);

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in duration-1000">
      <div className="text-center space-y-6">
        <div className="p-5 bg-primary/10 w-fit rounded-[2rem] mx-auto shadow-2xl border border-primary/20">
          {mode === 'uuid' ? <Hash className="w-10 h-10 text-primary" /> : 
           mode === 'unit-converter' ? <Ruler className="w-10 h-10 text-primary" /> : 
           mode === 'bmi-calculator' ? <Scale className="w-10 h-10 text-primary" /> :
           mode === 'barcode-generator' ? <BarChart className="w-10 h-10 text-primary" /> :
           <Calendar className="w-10 h-10 text-primary" />}
        </div>
        <div className="space-y-2">
          <h2 className="text-5xl font-headline font-black tracking-tighter uppercase">
            {mode === 'uuid' ? 'UUID v4 Engine' : 
             mode === 'age' ? 'Age Calculation' : 
             mode === 'date' ? 'Date Duration' : 
             mode === 'bmi-calculator' ? 'Health Analytics' :
             mode === 'barcode-generator' ? 'Barcode Studio' :
             'Unit Transformation'}
          </h2>
          <p className="text-muted-foreground text-xl font-medium opacity-60">High-fidelity local processing workstation.</p>
        </div>
      </div>

      <div className="glass p-12 md:p-16 rounded-[4rem] border-white/5 bg-primary/[0.01] shadow-[0_50px_100px_rgba(0,0,0,0.4)]">
        {mode === 'uuid' && (
          <div className="flex flex-col items-center gap-12">
            <div className="w-full relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 to-accent/30 rounded-[2.5rem] blur opacity-20 group-hover:opacity-100 transition duration-1000"></div>
              <Input 
                value={uuid} 
                readOnly 
                className="h-24 text-3xl font-mono text-center glass rounded-[2.5rem] border-white/10 tracking-widest shadow-2xl text-primary font-black"
              />
            </div>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button size="lg" onClick={generateUuid} className="h-16 px-12 rounded-2xl gap-3 font-black uppercase text-xs tracking-widest shadow-xl shadow-primary/30 hover:scale-105 transition-all">
                <RefreshCw className="w-5 h-5" /> Initialize New ID
              </Button>
              <Button size="lg" variant="secondary" onClick={() => {
                navigator.clipboard.writeText(uuid);
                toast({ title: "Vaulted", description: "UUID copied to clipboard." });
              }} className="h-16 px-12 rounded-2xl gap-3 glass font-black uppercase text-xs tracking-widest hover:bg-white/10 border-white/10 transition-all">
                <Copy className="w-5 h-5" /> Secure Copy
              </Button>
            </div>
          </div>
        )}

        {mode === 'barcode-generator' && (
          <div className="flex flex-col items-center gap-12">
             <div className="space-y-4 w-full">
                <Label className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 ml-4">Input Data Stream</Label>
                <Input 
                  value={barcodeValue} 
                  onChange={(e) => setBarcodeValue(e.target.value)} 
                  className="h-16 glass text-xl font-bold rounded-2xl px-8 border-white/10"
                  placeholder="Enter numbers or text..."
                />
             </div>
             <div className="bg-white p-12 rounded-[3rem] shadow-2xl transition-all hover:scale-105">
                <QRCodeSVG value={barcodeValue} size={256} level="H" includeMargin />
             </div>
             <div className="text-center space-y-2 opacity-60">
                <p className="text-xs font-black uppercase tracking-widest">High-Density Matrix Generator</p>
                <p className="text-[10px] font-medium leading-relaxed max-w-sm mx-auto">This tool generates professional-grade scannable codes. Use for product tracking or labels.</p>
             </div>
          </div>
        )}

        {(mode === 'age' || mode === 'date') && (
          <div className="w-full grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Label className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 ml-2">
                  {mode === 'age' ? 'Date of Birth' : 'Start Date'}
                </Label>
                <Input 
                  type="date" 
                  value={birthDate} 
                  onChange={(e) => setBirthDate(e.target.value)} 
                  className="h-16 glass text-xl font-bold rounded-2xl px-6 border-white/10"
                />
              </div>
              <div className="space-y-4">
                  <Label className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 ml-2">
                    {mode === 'age' ? 'Observation Date' : 'End Period'}
                  </Label>
                  <Input 
                    type="date" 
                    value={endDate} 
                    onChange={(e) => setEndDate(e.target.value)} 
                    className="h-16 glass text-xl font-bold rounded-2xl px-6 border-white/10"
                  />
              </div>
              <div className="p-8 bg-primary/5 rounded-[2.5rem] border border-primary/10 flex gap-6 items-center">
                <Clock className="w-8 h-8 text-primary shrink-0" />
                <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                  Engine tracking system time. All calculations are executed via local browser clock cycles for 100% accuracy.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               {[
                 { label: 'Years', val: ageResult.years },
                 { label: 'Months', val: ageResult.months },
                 { label: 'Days', val: ageResult.days }
               ].map((res, i) => (
                 <div key={i} className="glass p-10 rounded-[2.5rem] border-primary/20 bg-primary/[0.03] text-center space-y-2 hover:border-primary/50 transition-all group">
                   <div className="text-5xl font-headline font-black text-white group-hover:scale-110 transition-transform">{res.val}</div>
                   <div className="text-[10px] font-black uppercase text-primary tracking-widest">{res.label}</div>
                 </div>
               ))}
            </div>
          </div>
        )}

        {mode === 'bmi-calculator' && (
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-10">
               <div className="space-y-4">
                 <Label className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 ml-2">Height (cm)</Label>
                 <Input type="number" value={bmiData.height} onChange={(e) => setBmiData({...bmiData, height: Number(e.target.value)})} className="h-16 glass text-2xl font-black rounded-2xl px-8 border-white/10" />
               </div>
               <div className="space-y-4">
                 <Label className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 ml-2">Weight (kg)</Label>
                 <Input type="number" value={bmiData.weight} onChange={(e) => setBmiData({...bmiData, weight: Number(e.target.value)})} className="h-16 glass text-2xl font-black rounded-2xl px-8 border-white/10" />
               </div>
            </div>
            <div className="glass p-16 rounded-[4rem] border-primary/20 bg-primary/[0.03] text-center space-y-8 relative overflow-hidden group">
               <div className="absolute inset-0 bg-primary/5 blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity"></div>
               <div className="relative space-y-4">
                 <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Biometric BMI Index</p>
                 <h3 className="text-9xl font-headline font-black text-white tracking-tighter">{bmiResult.bmi}</h3>
                 <div className="px-8 py-3 bg-white/10 rounded-full inline-block text-xl font-black text-white uppercase tracking-[0.2em] border border-white/10 backdrop-blur-3xl shadow-2xl">
                    {bmiResult.label}
                 </div>
               </div>
            </div>
          </div>
        )}

        {mode === 'unit-converter' && (
          <div className="space-y-12">
            <div className="flex justify-center mb-4">
               <Select value={unitCategory} onValueChange={(v: any) => {
                  setUnitCategory(v);
                  const first = Object.keys(UNITS[v as keyof typeof UNITS])[0];
                  const second = Object.keys(UNITS[v as keyof typeof UNITS])[1];
                  setUnitFrom(first);
                  setUnitTo(second);
               }}>
                  <SelectTrigger className="w-full md:w-80 h-16 glass rounded-2xl text-xl font-black uppercase tracking-widest border-white/10">
                    <SelectValue placeholder="Select Metric" />
                  </SelectTrigger>
                  <SelectContent className="glass border-white/10">
                    <SelectItem value="length" className="font-bold">📏 Linear Dimensions</SelectItem>
                    <SelectItem value="weight" className="font-bold">⚖️ Mass / Weight</SelectItem>
                    <SelectItem value="data" className="font-bold">💾 Digital Objects</SelectItem>
                  </SelectContent>
               </Select>
            </div>

            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div className="space-y-4">
                <Label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-2">Source Units</Label>
                <div className="flex gap-3">
                  <Input 
                    type="number" 
                    value={unitValue} 
                    onChange={(e) => setUnitValue(e.target.value)} 
                    className="h-16 glass text-2xl font-black rounded-2xl px-6 border-white/10 flex-1"
                  />
                  <Select value={unitFrom} onValueChange={setUnitFrom}>
                    <SelectTrigger className="w-32 md:w-48 h-16 glass rounded-2xl font-bold uppercase text-[10px] tracking-widest border-white/10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="glass border-white/10">
                      {Object.keys(UNITS[unitCategory]).map(u => (
                        <SelectItem key={u} value={u} className="uppercase font-bold text-[10px]">{u}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-2">Target Units</Label>
                <div className="flex gap-3">
                  <div className="h-16 flex-1 glass rounded-2xl flex items-center px-8 text-2xl font-black text-primary border-white/10 shadow-2xl overflow-hidden truncate">
                    {unitResult}
                  </div>
                  <Select value={unitTo} onValueChange={setUnitTo}>
                    <SelectTrigger className="w-32 md:w-48 h-16 glass rounded-2xl font-bold uppercase text-[10px] tracking-widest border-white/10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="glass border-white/10">
                      {Object.keys(UNITS[unitCategory]).map(u => (
                        <SelectItem key={u} value={u} className="uppercase font-bold text-[10px]">{u}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-center gap-3 text-[10px] font-black text-muted-foreground uppercase tracking-[0.4em] opacity-40">
        <Sparkles className="w-4 h-4 text-primary animate-pulse" /> Native Browser Cycle Active
      </div>
    </div>
  );
}
