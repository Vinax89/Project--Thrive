
'use client';

import { useEffect } from 'react';
import { errorEmitter } from '@/firebase/error-emitter';
import { useToast } from '@/hooks/use-toast';
import { type FirestorePermissionError } from '@/firebase/errors';

export function FirebaseErrorListener() {
  const { toast } = useToast();

  useEffect(() => {
    const handleError = (error: FirestorePermissionError) => {
      console.error(error); // This will show the detailed error in the dev console.

      // In a production environment, you might want to show a more user-friendly toast.
      // For development, we throw the error to leverage the Next.js error overlay.
      if (process.env.NODE_ENV === 'development') {
         // We throw the error to make it visible in the Next.js error overlay for debugging
        throw error;
      } else {
        toast({
          variant: 'destructive',
          title: 'Permission Denied',
          description: 'You do not have permission to perform this action.',
        });
      }
    };

    errorEmitter.on('permission-error', handleError);

    return () => {
      errorEmitter.removeListener('permission-error', handleError);
    };
  }, [toast]);

  return null; // This component does not render anything
}
