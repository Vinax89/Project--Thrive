'use client';

import { useUser } from '@/firebase/auth/use-user';
import { useCollection } from '@/firebase/firestore/use-collection';
import type { Transaction } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function ReportsPage() {
  const { user } = useUser();
  const { data: transactions = [], loading } = useCollection<Transaction>(
    user ? `users/${user.uid}/transactions` : 'users/dummy/transactions'
  );

  if (loading) {
    return <p>Loading reports...</p>
  }
  
  return (
    <div className="flex flex-col gap-8 animate-fade-slide-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
        <p className="text-muted-foreground">
          Analyze your financial performance and trends.
        </p>
      </div>

      <Card>
        <CardHeader>
            <CardTitle>Coming Soon</CardTitle>
            <CardDescription>Advanced reporting and visualizations will be available here.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="flex h-[300px] w-full items-center justify-center rounded-md border border-dashed text-center">
                <p className="text-sm text-muted-foreground">Charts and graphs will appear here soon.</p>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
