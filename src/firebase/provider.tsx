'use client';

import React, { createContext, useContext, ReactNode, useMemo, useState, useEffect } from 'react';
import { FirebaseApp } from 'firebase/app';
import { Firestore, DocumentReference, Query } from 'firebase/firestore';
import { Auth, User, onAuthStateChanged } from 'firebase/auth';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener';

interface FirebaseProviderProps {
  children: ReactNode;
  firebaseApp: FirebaseApp;
  firestore: Firestore;
  auth: Auth;
}

// Combined state for the Firebase context
export interface FirebaseContextState {
  firebaseApp: FirebaseApp | null;
  firestore: Firestore | null;
  auth: Auth | null;
  user: User | null;
  isUserLoading: boolean;
  userError: Error | null;
}

// React Context
export const FirebaseContext = createContext<FirebaseContextState | undefined>(undefined);

export const FirebaseProvider: React.FC<FirebaseProviderProps> = ({
  children,
  firebaseApp,
  firestore,
  auth,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isUserLoading, setUserLoading] = useState(true);
  const [userError, setUserError] = useState<Error | null>(null);

  useEffect(() => {
    if (!auth) {
      setUserLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth,
      (firebaseUser) => {
        setUser(firebaseUser);
        setUserLoading(false);
      },
      (error) => {
        console.error("FirebaseProvider: onAuthStateChanged error:", error);
        setUserError(error);
        setUserLoading(false);
      }
    );
    return () => unsubscribe();
  }, [auth]);

  const contextValue = useMemo((): FirebaseContextState => ({
    firebaseApp,
    firestore,
    auth,
    user,
    isUserLoading,
    userError,
  }), [firebaseApp, firestore, auth, user, isUserLoading, userError]);

  return (
    <FirebaseContext.Provider value={contextValue}>
      <FirebaseErrorListener />
      {children}
    </FirebaseContext.Provider>
  );
};


export const useFirebase = (): FirebaseContextState => {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useFirebase must be used within a FirebaseProvider.');
  }
  return context;
};

export const useAuth = (): Auth => {
  const { auth } = useFirebase();
  if (!auth) throw new Error("Auth service is not available.");
  return auth;
};

export const useFirestore = (): Firestore => {
  const { firestore } = useFirebase();
  if (!firestore) throw new Error("Firestore service is not available.");
  return firestore;
};

export const useFirebaseApp = (): FirebaseApp => {
  const { firebaseApp } = useFirebase();
  if (!firebaseApp) throw new Error("Firebase App is not available.");
  return firebaseApp;
};

export const useUser = () => {
    const { user, isUserLoading, userError } = useFirebase();
    return { user, loading: isUserLoading, error: userError };
};


export function useMemoFirebase<T extends DocumentReference | Query | null>(
  factory: () => T,
  deps: React.DependencyList
): T & { __memo?: boolean } {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const memoizedRef = useMemo(factory, deps);
  if (memoizedRef) {
    (memoizedRef as any).__memo = true;
  }
  return memoizedRef as T & { __memo?: boolean };
}
