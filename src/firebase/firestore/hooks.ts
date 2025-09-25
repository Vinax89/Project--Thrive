
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
  type WithFieldValue
} from 'firebase/firestore';
import { useFirestore, useMemoFirebase } from '../provider';
import { errorEmitter } from '../error-emitter';
import { FirestorePermissionError, type SecurityRuleContext } from '../errors';


export function useDoc<T>(memoizedDocRef: (DocumentReference | null) & {__memo?: boolean}) {
  const firestore = useFirestore();
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!memoizedDocRef) {
      setLoading(false);
      setData(null);
      return;
    }
     if(memoizedDocRef && !memoizedDocRef.__memo) {
        throw new Error(memoizedDocRef + ' was not properly memoized using useMemoFirebase');
    }

    const unsubscribe = onSnapshot(
      memoizedDocRef,
      (snapshot) => {
        if (snapshot.exists()) {
          setData({ id: snapshot.id, ...snapshot.data() } as T);
        } else {
          setData(null);
        }
        setLoading(false);
      },
      (err) => {
        const permissionError = new FirestorePermissionError({
          path: memoizedDocRef.path,
          operation: 'get',
        } satisfies SecurityRuleContext);
        errorEmitter.emit('permission-error', permissionError);
        setError(permissionError);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [memoizedDocRef]);

  const update = async (newData: Partial<T>) => {
    if (!memoizedDocRef) return;
    updateDoc(memoizedDocRef, { ...newData, updatedAt: serverTimestamp() })
    .catch((serverError) => {
      const permissionError = new FirestorePermissionError({
          path: memoizedDocRef.path,
          operation: 'update',
          requestResourceData: newData,
      } satisfies SecurityRuleContext);
      errorEmitter.emit('permission-error', permissionError);
    });
  };

  return { data, loading, error, update };
}

export function useCollection<T>(memoizedCollectionRef: (CollectionReference | Query | null) & {__memo?: boolean}) {
  const firestore = useFirestore();
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    if (!memoizedCollectionRef) {
      setLoading(false);
      setData([]);
      return;
    }
    if(memoizedCollectionRef && !memoizedCollectionRef.__memo) {
        throw new Error(memoizedCollectionRef + ' was not properly memoized using useMemoFirebase');
    }

    const unsubscribe = onSnapshot(
      memoizedCollectionRef,
      (snapshot) => {
        const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as T));
        setData(items);
        setLoading(false);
      },
      (err) => {
        const permissionError = new FirestorePermissionError({
          path: 'path' in memoizedCollectionRef ? memoizedCollectionRef.path : 'toString()',
          operation: 'list',
        } satisfies SecurityRuleContext);
        errorEmitter.emit('permission-error', permissionError);
        setError(permissionError);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [memoizedCollectionRef]);

  const add = async (newItem: WithFieldValue<Omit<T, 'id'>>) => {
    if (!memoizedCollectionRef || !('path' in memoizedCollectionRef)) return;
    const data = { ...newItem, createdAt: serverTimestamp(), updatedAt: serverTimestamp() };
    addDoc(memoizedCollectionRef as CollectionReference, data)
    .catch((serverError) => {
      const permissionError = new FirestorePermissionError({
          path: (memoizedCollectionRef as CollectionReference).path,
          operation: 'create',
          requestResourceData: data,
      } satisfies SecurityRuleContext);
      errorEmitter.emit('permission-error', permissionError);
    });
  };

  const update = async (id: string, updatedData: Partial<T>) => {
    if (!memoizedCollectionRef || !('path' in memoizedCollectionRef) || !firestore) return;
    const docRef = doc(firestore, (memoizedCollectionRef as CollectionReference).path, id);
    const data = { ...updatedData, updatedAt: serverTimestamp() };
    updateDoc(docRef, data)
    .catch((serverError) => {
        const permissionError = new FirestorePermissionError({
            path: docRef.path,
            operation: 'update',
            requestResourceData: data,
        } satisfies SecurityRuleContext);
        errorEmitter.emit('permission-error', permissionError);
      });
  };
  
  const remove = async (id: string) => {
    if (!memoizedCollectionRef || !('path' in memoizedCollectionRef) || !firestore) return;
    const docRef = doc(firestore, (memoizedCollectionRef as CollectionReference).path, id);
    deleteDoc(docRef)
    .catch((serverError) => {
        const permissionError = new FirestorePermissionError({
            path: docRef.path,
            operation: 'delete',
        } satisfies SecurityRuleContext);
        errorEmitter.emit('permission-error', permissionError);
      });
  };

  return { data, loading, error, add, update, remove };
}
