'use client';

import { ReactNode, useMemo } from 'react';
import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { FirebaseProvider, FirebaseContextType } from './provider';
import { firebaseConfig } from './config';

export function FirebaseClientProvider({ children }: { children: ReactNode }) {
  const firebaseContextValue: FirebaseContextType = useMemo(() => {
    const app =
      getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const firestore = getFirestore(app);
    return { app, auth, firestore };
  }, []);

  return (
    <FirebaseProvider value={firebaseContextValue}>{children}</FirebaseProvider>
  );
}
