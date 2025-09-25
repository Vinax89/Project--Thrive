
"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import {
  ArrowDownLeft,
  ArrowUpRight,
  DollarSign,
  Landmark,
} from "lucide-react";
import { sampleTransactions, sampleDebts } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { useLocalStorage } from "@/hooks/use-local-storage";
import type { Transaction, Debt } from "@/lib/types";

export default function DashboardPage() {
  const [transactions] = useLocalStorage<Transaction[]>("transactions", sampleTransactions);
  const [debts] = useLocalStorage<Debt[]>("debts", sampleDebts);
  
  const totalIncome = 5000;
  const totalSpending = transactions.reduce((sum, t) => sum + t.amount, 0);
  const totalDebt = debts.reduce((sum, d) => sum + d.amount, 0);
  const savingsGoal = 10000;
  const currentSavings = 4500;
  const savingsProgress = (currentSavings / savingsGoal) * 100;

  return (
    <div className="flex flex-col gap-8 animate-fade-slide-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Money Hub</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's your financial snapshot.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalIncome.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+10.2% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spending</CardTitle>
            <ArrowDownLeft className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalSpending.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">-5.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Surplus</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${(totalIncome - totalSpending).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Debt</CardTitle>
            <Landmark className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalDebt.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Down ${500} from last month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Your latest spending activity.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Transaction</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.slice(0, 5).map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>
                      <div className="font-medium">{transaction.name}</div>
                      <div className="text-sm text-muted-foreground">{transaction.date}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{transaction.category}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      -${transaction.amount.toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Savings Goal</CardTitle>
            <CardDescription>
              Your progress towards your ${savingsGoal.toLocaleString()} goal.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="space-y-2">
              <Progress value={savingsProgress} />
              <div className="flex justify-between text-sm font-medium">
                <span>${currentSavings.toLocaleString()}</span>
                <span className="text-muted-foreground">{savingsProgress.toFixed(0)}%</span>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              You're on track! Keep going, you've got this. At this rate, you'll reach your goal in approximately 6 months.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
