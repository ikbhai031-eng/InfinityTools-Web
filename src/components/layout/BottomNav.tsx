
"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Zap, 
  LayoutGrid, 
  FileText, 
  Globe, 
  LayoutDashboard
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export function BottomNav() {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Home", icon: Zap },
    { href: "/categories", label: "Modules", icon: LayoutGrid },
    { href: "/tools/pdf-editor", label: "PDF Editor", icon: FileText },
    { href: "/link-directory", label: "Directory", icon: Globe },
    { href: "/dashboard", label: "Station", icon: LayoutDashboard },
  ];

  return (
    <nav 
      className="fixed bottom-0 inset-x-0 z-[60] lg:hidden"
    >
      {/* Safe area background */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-2xl border-t border-white/5 pointer-events-none"></div>
      
      <div className="relative flex justify-around items-center px-4 h-20 safe-bottom">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link 
              key={link.href} 
              href={link.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1.5 flex-1 h-full relative transition-all active:scale-90 outline-none",
                isActive ? "text-primary" : "text-muted-foreground/60"
              )}
            >
              <div className={cn(
                "p-2 rounded-xl transition-all duration-300",
                isActive ? "bg-primary/10" : "bg-transparent"
              )}>
                <link.icon className={cn("w-5 h-5 transition-transform duration-500", isActive && "scale-110")} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest">{link.label}</span>
              
              {isActive && (
                <motion.div 
                  layoutId="bottom-nav-active"
                  className="absolute -top-px left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full shadow-[0_0_10px_rgba(99,102,241,0.8)]"
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
