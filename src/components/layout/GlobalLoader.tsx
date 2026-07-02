
'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Command } from 'lucide-react';

export function GlobalLoader() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate initial setup delay for premium feel
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-background bg-mesh"
        >
          <div className="relative flex flex-col items-center gap-8">
            {/* Animated Logo */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ 
                duration: 0.5, 
                ease: "easeOut"
              }}
              className="relative"
            >
              <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full animate-pulse"></div>
              <div className="relative p-6 bg-primary rounded-[2.5rem] shadow-2xl shadow-primary/40">
                <Command className="w-16 h-16 text-white" />
              </div>
            </motion.div>

            {/* Loading Indicator */}
            <div className="space-y-4 text-center">
              <motion.h2 
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-2xl font-headline font-black tracking-tighter text-white uppercase"
              >
                Infinity<span className="text-primary italic">Tools</span>
              </motion.h2>
              
              <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden relative">
                <motion.div 
                  className="absolute inset-y-0 left-0 bg-primary"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 1, ease: "easeInOut" }}
                />
              </div>
              
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/40"
              >
                Initializing Workstation
              </motion.p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
