'use client';

import { useUser } from '@/firebase/auth/use-user';
import { useCollection, useDoc } from '@/firebase/firestore/hooks';
import type { Debt, Investment, UserProfile } from '@/lib/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useFirestore, useMemoFirebase } from '@/firebase/provider';
import { collection, doc } from 'firebase/firestore';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Banknote, Landmark, Scale, TrendingUp } from 'lucide-react';

export default function NetWorthPage() {
  const { user, loading: userLoading } = useUser();
  const firestore = useFirestore();

  const userDocRef = useMemoFirebase(
    () => (user && firestore ? doc(firestore, `users/${user.uid}`) : null),
    [user, firestore]
  );
  const { data: profile, loading: profileLoading } = useDoc<UserProfile>(userDocRef);

  const investmentsColRef = useMemoFirebase(
    () => (user && firestore ? collection(firestore, `users/${user.uid}/investments`) : null),
    [user, firestore]
  );
  const { data: investments = [], loading: investmentsLoading } =
    useCollection<Investment>(investmentsColRef);

  const debtsColRef = useMemoFirebase(
    () => (user && firestore ? collection(firestore, `users/${user.uid}/debts`) : null),
    [user, firestore]
  );
  const { data: debts = [], loading: debtsLoading } = useCollection<Debt>(debtsColRef);

  const loading = userLoading || profileLoading || investmentsLoading || debtsLoading;

  const totalSavings = (profile as any)?.savings || 0;
  const totalInvestmentValue = investments.reduce(
    (sum, investment) => sum + investment.quantity * investment.currentPrice,
    0
  );
  const totalAssets = totalSavings + totalInvestmentValue;
  const totalLiabilities = debts.reduce((sum, debt) => sum + debt.amount, 0);
  const netWorth = totalAssets - totalLiabilities;

  if (loading) {
    return <p>Calculating Balance Sheet...</p>;
  }

  return (
    <div className="flex flex-col gap-8 animate-fade-slide-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Balance Sheet</h1>
        <p className="text-muted-foreground">
          A snapshot of your financial health (Assets - Liabilities = Net Worth).
        </p>
      </div>

      <Card className="lg:col-span-3">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Total Net Worth</CardTitle>
              <CardDescription>The ultimate measure of your financial health.</CardDescription>
            </div>
            <div className="flex items-center gap-2">
                <Scale className="h-8 w-8 text-muted-foreground" />
                <span className="text-3xl font-bold">${netWorth.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
          </CardHeader>
      </Card>
      

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Banknote className="text-green-500" /> Assets</CardTitle>
            <CardDescription>What you own.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Asset</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Cash Savings</TableCell>
                  <TableCell className="text-right">${totalSavings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                </TableRow>
                {investments.map(inv => (
                  <TableRow key={inv.id}>
                    <TableCell>{inv.name} ({inv.type})</TableCell>
                    <TableCell className="text-right">${(inv.quantity * inv.currentPrice).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <CardHeader className="px-0">
              <div className="flex justify-between items-center border-t pt-4">
                <p className="font-semibold">Total Assets</p>
                <p className="font-semibold text-green-500">${totalAssets.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              </div>
            </CardHeader>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Landmark className="text-red-500" /> Liabilities</CardTitle>
            <CardDescription>What you owe.</CardDescription>
          </CardHeader>
          <CardContent>
             <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Liability</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {debts.map(debt => (
                  <TableRow key={debt.id}>
                    <TableCell>{debt.name} ({debt.type})</TableCell>
                    <TableCell className="text-right">${(debt.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
             <CardHeader className="px-0">
              <div className="flex justify-between items-center border-t pt-4">
                <p className="font-semibold">Total Liabilities</p>
                <p className="font-semibold text-red-500">${totalLiabilities.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              </div>
            </CardHeader>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
