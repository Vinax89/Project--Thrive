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
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { ChartTooltipContent } from "@/components/ui/chart";
import { ArrowDown, ArrowUp, Banknote, Landmark, Scale, TrendingUp } from 'lucide-react';

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

  const chartData = [
    {
      name: 'Financials',
      assets: totalAssets,
      liabilities: totalLiabilities * -1, // Make liabilities negative for stacking
    },
  ];

  if (loading) {
    return <p>Calculating Net Worth...</p>;
  }

  return (
    <div className="flex flex-col gap-8 animate-fade-slide-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Net Worth</h1>
        <p className="text-muted-foreground">
          A snapshot of your financial health: Assets vs. Liabilities.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
            <ArrowUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalAssets.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            <p className="text-xs text-muted-foreground">Savings + Investments</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Liabilities</CardTitle>
            <ArrowDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalLiabilities.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            <p className="text-xs text-muted-foreground">Total outstanding debt</p>
          </CardContent>
        </Card>
        <Card className="md:col-span-2 lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Worth</CardTitle>
            <Scale className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${netWorth.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            <p className="text-xs text-muted-foreground">The ultimate measure</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Assets vs. Liabilities</CardTitle>
            <CardDescription>A visual breakdown of your financial position.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
               <BarChart data={chartData} layout="vertical" barGap={-15} barSize={30}>
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="name" hide />
                <Tooltip cursor={{fill: 'transparent'}} content={<ChartTooltipContent />} />
                <Bar dataKey="assets" fill="hsl(var(--chart-2))" radius={[0, 4, 4, 0]} />
                <Bar dataKey="liabilities" fill="hsl(var(--chart-5))" radius={[4, 0, 0, 4]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
         <div className="lg:col-span-2 space-y-6">
            <Card>
                <CardHeader className="flex flex-row items-center space-x-4 p-4">
                    <Banknote className="h-8 w-8 text-muted-foreground" />
                    <div>
                        <p className="text-sm text-muted-foreground">Savings</p>
                        <p className="text-lg font-semibold">${totalSavings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                    </div>
                </CardHeader>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center space-x-4 p-4">
                    <TrendingUp className="h-8 w-8 text-muted-foreground" />
                    <div>
                        <p className="text-sm text-muted-foreground">Investments</p>
                        <p className="text-lg font-semibold">${totalInvestmentValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                    </div>
                </CardHeader>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center space-x-4 p-4">
                    <Landmark className="h-8 w-8 text-muted-foreground" />
                    <div>
                        <p className="text-sm text-muted-foreground">Debts</p>
                        <p className="text-lg font-semibold">${totalLiabilities.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                    </div>
                </CardHeader>
            </Card>
        </div>
      </div>
    </div>
  );
}
