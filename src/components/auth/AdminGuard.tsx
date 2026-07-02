
'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase';
import { Loader2, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const OWNER_EMAIL = 'ikbhai031@gmail.com';

interface AdminGuardProps {
  children: React.ReactNode;
}

/**
 * Strict security wrapper for Admin-only routes.
 * Only allows the hardcoded owner email to access.
 */
export function AdminGuard({ children }: AdminGuardProps) {
  const { user, loading } = useUser();
  const router = useRouter();

  const isOwner = user?.email === OWNER_EMAIL;

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-background flex flex-col items-center justify-center space-y-4 z-50">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-xs font-black uppercase tracking-[0.3em] text-primary/50 animate-pulse">
          Verifying Admin Credentials
        </p>
      </div>
    );
  }

  if (!isOwner) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-destructive/10 flex items-center justify-center text-destructive mb-4">
          <ShieldAlert className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-headline font-bold">403 - Access Denied</h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            This area is restricted to the platform owner. Your attempt has been logged for security purposes.
          </p>
        </div>
        <Link href="/">
          <Button variant="outline" className="rounded-2xl h-12 px-8 glass">
            Return to Safety
          </Button>
        </Link>
      </div>
    );
  }

  return <>{children}</>;
}
