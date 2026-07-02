"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Copy, RefreshCw, ShieldCheck, ShieldAlert, Shield } from 'lucide-react';

export function PasswordGenerator() {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState([16]);
  const [options, setOptions] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true
  });
  const { toast } = useToast();

  const generatePassword = () => {
    const charset = {
      uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      lowercase: 'abcdefghijklmnopqrstuvwxyz',
      numbers: '0123456789',
      symbols: '!@#$%^&*()_+~`|}{[]:;?><,./-='
    };

    let availableChars = '';
    if (options.uppercase) availableChars += charset.uppercase;
    if (options.lowercase) availableChars += charset.lowercase;
    if (options.numbers) availableChars += charset.numbers;
    if (options.symbols) availableChars += charset.symbols;

    if (!availableChars) {
      toast({ title: "Error", description: "Please select at least one character type.", variant: "destructive" });
      return;
    }

    let newPassword = '';
    const array = new Uint32Array(length[0]);
    window.crypto.getRandomValues(array);

    for (let i = 0; i < length[0]; i++) {
      newPassword += availableChars.charAt(array[i] % availableChars.length);
    }

    setPassword(newPassword);
  };

  useEffect(() => {
    generatePassword();
  }, [length, options]);

  const getStrength = () => {
    let score = 0;
    if (length[0] > 12) score++;
    if (length[0] > 20) score++;
    if (options.uppercase && options.lowercase) score++;
    if (options.numbers) score++;
    if (options.symbols) score++;
    
    if (score < 3) return { label: 'Weak', color: 'text-destructive', icon: ShieldAlert };
    if (score < 5) return { label: 'Good', color: 'text-yellow-500', icon: Shield };
    return { label: 'Strong', color: 'text-green-500', icon: ShieldCheck };
  };

  const strength = getStrength();

  return (
    <div className="max-w-2xl mx-auto space-y-8 glass p-8 rounded-3xl border-white/5">
      <div className="space-y-4">
        <div className="relative group">
          <Input 
            value={password}
            readOnly
            className="h-16 text-2xl font-mono text-center pr-16 bg-secondary/50 border-white/10 rounded-2xl tracking-wider"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
            <Button variant="ghost" size="icon" onClick={() => {
              navigator.clipboard.writeText(password);
              toast({ title: "Copied!" });
            }}>
              <Copy className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={generatePassword}>
              <RefreshCw className="w-5 h-5" />
            </Button>
          </div>
        </div>
        
        <div className="flex items-center justify-center gap-2">
          <strength.icon className={`w-4 h-4 ${strength.color}`} />
          <span className={`text-sm font-bold uppercase tracking-widest ${strength.color}`}>
            Security Strength: {strength.label}
          </span>
        </div>
      </div>

      <div className="space-y-8">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label className="text-sm font-medium text-muted-foreground uppercase">Password Length</Label>
            <span className="text-2xl font-bold text-primary">{length[0]}</span>
          </div>
          <Slider 
            value={length}
            onValueChange={setLength}
            max={64}
            min={4}
            step={1}
            className="py-4"
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="flex items-center space-x-3 p-4 bg-secondary/30 rounded-2xl hover:bg-secondary/50 transition-colors cursor-pointer group" onClick={() => setOptions({...options, uppercase: !options.uppercase})}>
            <Checkbox checked={options.uppercase} id="uppercase" />
            <Label htmlFor="uppercase" className="cursor-pointer font-medium">Uppercase (A-Z)</Label>
          </div>
          <div className="flex items-center space-x-3 p-4 bg-secondary/30 rounded-2xl hover:bg-secondary/50 transition-colors cursor-pointer group" onClick={() => setOptions({...options, lowercase: !options.lowercase})}>
            <Checkbox checked={options.lowercase} id="lowercase" />
            <Label htmlFor="lowercase" className="cursor-pointer font-medium">Lowercase (a-z)</Label>
          </div>
          <div className="flex items-center space-x-3 p-4 bg-secondary/30 rounded-2xl hover:bg-secondary/50 transition-colors cursor-pointer group" onClick={() => setOptions({...options, numbers: !options.numbers})}>
            <Checkbox checked={options.numbers} id="numbers" />
            <Label htmlFor="numbers" className="cursor-pointer font-medium">Numbers (0-9)</Label>
          </div>
          <div className="flex items-center space-x-3 p-4 bg-secondary/30 rounded-2xl hover:bg-secondary/50 transition-colors cursor-pointer group" onClick={() => setOptions({...options, symbols: !options.symbols})}>
            <Checkbox checked={options.symbols} id="symbols" />
            <Label htmlFor="symbols" className="cursor-pointer font-medium">Symbols (!@#$)</Label>
          </div>
        </div>
      </div>
    </div>
  );
}