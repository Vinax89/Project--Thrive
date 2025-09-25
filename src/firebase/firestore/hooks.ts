'use client';

import { useState, useEffect } from 'react';
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
  type WithFieldValue,
  FirestoreError,
  QuerySnapshot,
  DocumentData,
  DocumentSnapshot,
} from 'firebase/firestore';
import { useFirestore } from '../provider';
import { errorEmitter } from '../error-emitter';
import { FirestorePermissionError } from '../errors';

export type WithId<T> = T & { id: string };

/**
 * Interface for the return value of the useDoc hook.
 * @template T Type of the document data.
 */
export interface UseDocResult<T> {
  data: WithId<T> | null;
  loading: boolean;
  error: FirestoreError | Error | null;
  update: (data: Partial<T>) => Promise<void>;
}


export function useDoc<T>(memoizedDocRef: (DocumentReference | null) & {__memo?: boolean}): UseDocResult<T> {
  const firestore = useFirestore();
  const [data, setData] = useState<WithId<T> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!memoizedDocRef) {
      setLoading(false);
      setData(null);
      return;
    }
     if(memoizedDocRef && !memoizedDocRef.__memo) {
        console.warn('A non-memoized Firestore reference was passed to useDoc. This can cause infinite loops. Use the useMemoFirebase hook to memoize the reference.');
    }

    const unsubscribe = onSnapshot(
      memoizedDocRef,
      (snapshot:  DocumentSnapshot<DocumentData>) => {
        if (snapshot.exists()) {
          setData({ id: snapshot.id, ...snapshot.data() } as WithId<T>);
        } else {
          setData(null);
        }
        setLoading(false);
      },
      (err: FirestoreError) => {
        const permissionError = new FirestorePermissionError({
          path: memoizedDocRef.path,
          operation: 'get',
        });
        errorEmitter.emit('permission-error', permissionError);
        setError(permissionError);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [memoizedDocRef]);

  const update = async (newData: Partial<T>) => {
    if (!memoizedDocRef) throw new Error("Document reference not available for update.");
    const dataToUpdate = { ...newData, updatedAt: serverTimestamp() };
    return updateDoc(memoizedDocRef, dataToUpdate)
    .catch((serverError) => {
      const permissionError = new FirestorePermissionError({
          path: memoizedDocRef.path,
          operation: 'update',
          requestResourceData: dataToUpdate,
      });
      errorEmitter.emit('permission-error', permissionError);
      throw permissionError; // Re-throw the error after emitting
    });
  };

  return { data, loading, error, update };
}


/**
 * Interface for the return value of the useCollection hook.
 * @template T Type of the document data.
 */
export interface UseCollectionResult<T> {
  data: WithId<T>[];
  loading: boolean;
  error: FirestoreError | Error | null;
  add: (data: WithFieldValue<Omit<T, 'id'>>) => Promise<DocumentReference | void>;
  update: (id: string, data: Partial<T>) => Promise<void>;
  remove: (id: string) => Promise<void>;
}


export function useCollection<T>(memoizedCollectionRef: (CollectionReference | Query | null) & {__memo?: boolean}): UseCollectionResult<T> {
  const firestore = useFirestore();
  const [data, setData] = useState<WithId<T>[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    if (!memoizedCollectionRef) {
      setLoading(false);
      setData([]);
      return;
    }
    if(memoizedCollectionRef && !memoizedCollectionRef.__memo) {
        console.warn('A non-memoized Firestore reference was passed to useCollection. This can cause infinite loops. Use the useMemoFirebase hook to memoize the reference.');
    }

    const unsubscribe = onSnapshot(
      memoizedCollectionRef,
      (snapshot: QuerySnapshot<DocumentData>) => {
        const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as WithId<T>));
        setData(items);
        setLoading(false);
      },
      (err: FirestoreError) => {
        const path = 'path' in memoizedCollectionRef ? memoizedCollectionRef.path : 'unknown path';
        const permissionError = new FirestorePermissionError({
          path: path,
          operation: 'list',
        });
        errorEmitter.emit('permission-error', permissionError);
        setError(permissionError);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [memoizedCollectionRef]);

  const add = async (newItem: WithFieldValue<Omit<T, 'id'>>) => {
    if (!memoizedCollectionRef || !('path' in memoizedCollectionRef)) {
       throw new Error("Collection reference not available for adding document.");
    }
    const dataToAdd = { ...newItem, createdAt: serverTimestamp(), updatedAt: serverTimestamp() };
    return addDoc(memoizedCollectionRef as CollectionReference, dataToAdd).catch((serverError) => {
      const permissionError = new FirestorePermissionError({
          path: (memoizedCollectionRef as CollectionReference).path,
          operation: 'create',
          requestResourceData: dataToAdd,
      });
      errorEmitter.emit('permission-error', permissionError);
      throw permissionError; // Re-throw the error after emitting
    });
  };

  const update = async (id: string, updatedData: Partial<T>) => {
    if (!memoizedCollectionRef || !('path' in memoizedCollectionRef) || !firestore) {
        throw new Error("Collection reference not available for updating document.");
    }
    const docRef = doc(firestore, (memoizedCollectionRef as CollectionReference).path, id);
    const dataToUpdate = { ...updatedData, updatedAt: serverTimestamp() };
    return updateDoc(docRef, dataToUpdate)
    .catch((serverError) => {
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
    if (!memoizedCollectionRef || !('path' in memoizedCollectionRef) || !firestore) {
         throw new Error("Collection reference not available for removing document.");
    }
    const docRef = doc(firestore, (memoizedCollectionRef as CollectionReference).path, id);
    return deleteDoc(docRef)
    .catch((serverError) => {
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
