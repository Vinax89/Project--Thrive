'use client';
import { useUser } from '@/firebase/auth/use-user';
import { redirect } from 'next/navigation';
import { useEffect } from 'react';

export default function RootPage() {
  const { user, loading } = useUser();

  useEffect(() => {
    if (!loading) {
      if (user) {
        redirect('/dashboard');
      } else {
        redirect('/login');
      }
    }
  }, [user, loading]);

  return (
    <div className="flex h-screen items-center justify-center">
      <p>Loading...</p>
    </div>
  );
}
