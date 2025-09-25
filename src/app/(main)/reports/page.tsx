
'use client';

import { useUser } from '@/firebase/auth/use-user';
import { useCollection, useDoc } from '@/firebase/firestore/hooks';
import type { Transaction, UserProfile } from '@/lib/types';
import { CashFlowLineChart } from '@/components/cash-flow-line-chart';
import { SpendingBarChart } from '@/components/spending-bar-chart';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function ReportsPage() {
  const { user } = useUser();
  const { data: profile } = useDoc<UserProfile>(user ? `users/${user.uid}` : null);
  const { data: transactions = [], loading } = useCollection<Transaction>(user ? `users/${user.uid}/transactions` : null);

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

      <div className="grid gap-6 lg:grid-cols-2">
         <Card>
            <CardHeader>
                <CardTitle>Spending by Category</CardTitle>
                <CardDescription>Breakdown of your spending for the current month.</CardDescription>
            </CardHeader>
            <CardContent>
                <SpendingBarChart transactions={transactions} />
            </CardContent>
        </Card>
         <Card>
            <CardHeader>
                <CardTitle>Cash Flow Over Time</CardTitle>
                <CardDescription>Your income vs. expenses over the past months.</CardDescription>
            </CardHeader>
            <CardContent>
                <CashFlowLineChart transactions={transactions} income={profile?.income || 0} />
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
