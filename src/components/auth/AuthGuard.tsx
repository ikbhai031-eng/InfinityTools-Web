
'use client';

import React from 'react';

interface AuthGuardProps {
  children: React.ReactNode;
}

/**
 * AuthGuard is now disabled to allow 100% free access.
 * It simply renders children without any checks.
 */
export function AuthGuard({ children }: AuthGuardProps) {
  return <>{children}</>;
}
