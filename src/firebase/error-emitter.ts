
'use client';

import { EventEmitter } from 'events';

/**
 * Centralized error emitter for Firebase-related errors.
 */
export const errorEmitter = new EventEmitter();
