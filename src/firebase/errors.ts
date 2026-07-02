
'use client';

export type SecurityRuleContext = {
  path: string;
  operation: 'get' | 'list' | 'create' | 'update' | 'delete' | 'write';
  requestResourceData?: any;
};

/**
 * Specialized error class for Firestore permission issues.
 */
export class FirestorePermissionError extends Error {
  context: SecurityRuleContext;

  constructor(context: SecurityRuleContext) {
    super(`Firestore permission denied at ${context.path} for ${context.operation}`);
    this.name = 'FirestorePermissionError';
    this.context = context;
  }
}
