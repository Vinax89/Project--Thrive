
'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  collection,
  doc,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  DocumentReference,
  CollectionReference,
  Query,
} from 'firebase/firestore';
import { useFirestore } from '../provider';

// Helper to stabilize reference objects
function useMemoizedRef<T extends DocumentReference | CollectionReference | Query | null>(ref: T): T {
  const refString = ref ? ('path' in ref ? ref.path : 'id' in ref ? ref.id : '') : '';
  return useMemo(() => ref, [refString]);
}

export function useDoc<T>(path: string | null) {
  const firestore = useFirestore();
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const docRef = useMemoizedRef(path && firestore ? doc(firestore, path) : null);

  useEffect(() => {
    if (!docRef) {
      setLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(
      docRef,
      (snapshot) => {
        if (snapshot.exists()) {
          setData({ id: snapshot.id, ...snapshot.data() } as T);
        } else {
          setData(null);
        }
        setLoading(false);
      },
      (err) => {
        console.error(err);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [docRef]);

  const update = async (newData: Partial<T>) => {
    if (!docRef) return;
    await updateDoc(docRef, { ...newData, updatedAt: serverTimestamp() });
  };

  return { data, loading, error, update };
}

export function useCollection<T>(path: string | null) {
  const firestore = useFirestore();
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  const collectionRef = useMemoizedRef(path && firestore ? collection(firestore, path) : null);

  useEffect(() => {
    if (!collectionRef) {
      setLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(
      collectionRef,
      (snapshot) => {
        const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as T));
        setData(items);
        setLoading(false);
      },
      (err) => {
        console.error(err);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [collectionRef]);

  const add = async (newItem: Omit<T, 'id'>) => {
    if (!collectionRef) return;
    await addDoc(collectionRef, { ...newItem, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
  };

  const update = async (id: string, updatedData: Partial<T>) => {
    if (!path || !firestore) return;
    const docRef = doc(firestore, path, id);
    await updateDoc(docRef, { ...updatedData, updatedAt: serverTimestamp() });
  };
  
  const remove = async (id: string) => {
    if (!path || !firestore) return;
    const docRef = doc(firestore, path, id);
    await deleteDoc(docRef);
  };

  return { data, loading, error, add, update, remove };
}
