
'use client';

import React, { useState, useEffect } from 'react';
import { Share2, Heart, RotateCcw, ShieldCheck, Activity, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface ToolInteractionProps {
  toolId?: string;
  toolName?: string;
  onReset?: () => void;
}

export function ToolInteraction({ toolId, toolName, onReset }: ToolInteractionProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!toolId) return;
    const favorites = JSON.parse(localStorage.getItem('infinity_favorites') || '[]');
    setIsFavorite(favorites.includes(toolId));

    const history = JSON.parse(localStorage.getItem('infinity_history') || '[]');
    const newHistory = [toolId, ...history.filter((id: string) => id !== toolId)].slice(0, 10);
    localStorage.setItem('infinity_history', JSON.stringify(newHistory));
  }, [toolId]);

  const toggleFavorite = () => {
    if (!toolId) return;
    const favorites = JSON.parse(localStorage.getItem('infinity_favorites') || '[]');
    let newFavorites;
    if (isFavorite) {
      newFavorites = favorites.filter((id: string) => id !== toolId);
      toast({ title: "Workstation Updated", description: `${toolName} unpinned from dashboard.` });
    } else {
      newFavorites = [...favorites, toolId];
      toast({ title: "Workstation Updated", description: `${toolName} pinned to dashboard.` });
    }
    localStorage.setItem('infinity_favorites', JSON.stringify(newFavorites));
    setIsFavorite(!isFavorite);
  };

  const handleShare = async () => {
    setIsSharing(true);
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast({ title: "Link Saved", description: "Station URL copied to clipboard." });
    } finally {
      setTimeout(() => setIsSharing(false), 800);
    }
  };

  return (
    <motion.div 
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="flex flex-wrap items-center justify-between gap-8 py-10 border-y border-white/5 px-10 glass rounded-[2.5rem] mb-24"
    >
      <div className="flex items-center gap-10">
         <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500/40">
           <ShieldCheck className="w-5 h-5 text-emerald-500" /> Professional Engine
         </div>
         <div className="hidden md:flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-primary/40 border-l border-white/5 pl-10">
           <Activity className="w-5 h-5 text-primary" /> Active Local Process
         </div>
      </div>

      <div className="flex items-center gap-4 flex-1 md:flex-none justify-end">
        {onReset && (
          <Button variant="ghost" onClick={onReset} className="h-12 px-6 rounded-2xl glass font-black uppercase text-[10px] tracking-widest text-destructive/60 hover:text-destructive transition-all">
            <RotateCcw className="w-4 h-4 mr-2" /> Reset Logic
          </Button>
        )}
        <Button 
          variant="ghost" 
          onClick={toggleFavorite} 
          className={cn(
            "h-12 px-8 rounded-2xl glass font-black uppercase text-[10px] tracking-widest transition-all", 
            isFavorite && "bg-primary/20 text-primary border-primary/40 shadow-lg shadow-primary/10"
          )}
        >
          <Heart className={cn("w-4 h-4 mr-2 transition-all duration-500", isFavorite && "fill-primary scale-110")} /> 
          {isFavorite ? 'Pinned' : 'Pin Station'}
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          isLoading={isSharing}
          className="h-12 w-12 glass rounded-2xl" 
          onClick={handleShare}
        >
          {!isSharing && <Share2 className="w-5 h-5" />}
        </Button>
      </div>
    </motion.div>
  );
}
