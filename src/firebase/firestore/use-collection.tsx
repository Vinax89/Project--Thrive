
'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  CollectionReference,
  WithFieldValue,
  Query,
  DocumentReference,
  FirestoreError,
} from 'firebase/firestore';
import { useFirestore } from '../provider';
import { errorEmitter } from '../error-emitter';
import { FirestorePermissionError } from '../errors';

export type WithId<T> = T & { id: string };

export function useCollection<T>(collectionName: string) {
  const firestore = useFirestore();
  const [data, setData] = useState<WithId<T>[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const collectionRef = useMemo(
    () => (firestore ? collection(firestore, collectionName) : null),
    [firestore, collectionName]
  );

  useEffect(() => {
    if (!collectionRef) {
      setLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(
      collectionRef,
      (snapshot) => {
        const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as WithId<T>));
        setData(items);
        setLoading(false);
      },
      (err: FirestoreError) => {
        const permissionError = new FirestorePermissionError({
          path: collectionRef.path,
          operation: 'list',
        });
        errorEmitter.emit('permission-error', permissionError);
        setError(permissionError);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [collectionRef]);

  const add = async (newItem: WithFieldValue<Omit<T, 'id'>>) => {
    if (!collectionRef) return;
    const dataToAdd = { ...newItem, createdAt: serverTimestamp(), updatedAt: serverTimestamp() };
    return addDoc(collectionRef, dataToAdd).catch((serverError) => {
      const permissionError = new FirestorePermissionError({
        path: collectionRef.path,
        operation: 'create',
        requestResourceData: dataToAdd,
      });
      errorEmitter.emit('permission-error', permissionError);
      throw permissionError;
    });
  };
  
  const update = async (id: string, updatedData: Partial<T>) => {
    if (!firestore || !collectionRef) return;
    const docRef = doc(firestore, collectionRef.path, id);
    const dataToUpdate = { ...updatedData, updatedAt: serverTimestamp() };
    return updateDoc(docRef, dataToUpdate).catch((serverError) => {
        const permissionError = new FirestorePermissionError({
            path: docRef.path,
            operation: 'update',
            requestResourceData: dataToUpdate,
        });
        errorEmitter.emit('permission-error', permissionError);
        throw permissionError;
      });
  };

  const remove = async (id: string) => {
    if (!firestore || !collectionRef) return;
    const docRef = doc(firestore, collectionRef.path, id);
    return deleteDoc(docRef).catch((serverError) => {
        const permissionError = new FirestorePermissionError({
            path: docRef.path,
            operation: 'delete',
        });
        errorEmitter.emit('permission-error', permissionError);
        throw permissionError;
      });
  };

  return { data, loading, error, add, update, remove };
}
    