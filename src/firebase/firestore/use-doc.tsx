
'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  doc,
  onSnapshot,
  updateDoc,
  serverTimestamp,
  DocumentReference,
  FirestoreError,
} from 'firebase/firestore';
import { useFirestore } from '../provider';
import { errorEmitter } from '../error-emitter';
import { FirestorePermissionError } from '../errors';

export type WithId<T> = T & { id: string };

export function useDoc<T>(docPath: string) {
  const firestore = useFirestore();
  const [data, setData] = useState<WithId<T> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const docRef = useMemo(
    () => (firestore ? doc(firestore, docPath) : null),
    [firestore, docPath]
  );

  useEffect(() => {
    if (!docRef) {
      setLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(
      docRef,
      (snapshot) => {
        if (snapshot.exists()) {
          setData({ id: snapshot.id, ...snapshot.data() } as WithId<T>);
        } else {
          setData(null);
        }
        setLoading(false);
      },
      (err: FirestoreError) => {
        const permissionError = new FirestorePermissionError({
          path: docRef.path,
          operation: 'get',
        });
        errorEmitter.emit('permission-error', permissionError);
        setError(permissionError);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [docRef]);
  
  const update = async (newData: Partial<T>) => {
    if (!docRef) throw new Error("Document reference not available for update.");
    const dataToUpdate = { ...newData, updatedAt: serverTimestamp() };
    return updateDoc(docRef, dataToUpdate)
    .catch((serverError) => {
      const permissionError = new FirestorePermissionError({
          path: docRef.path,
          operation: 'update',
          requestResourceData: dataToUpdate,
      });
      errorEmitter.emit('permission-error', permissionError);
      throw permissionError; // Re-throw the error after emitting
    });
  };


  return { data, loading, error, update };
}
    