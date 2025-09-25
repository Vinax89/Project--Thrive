
"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useUser } from "@/firebase/auth/use-user";
import { useCollection, useDoc } from "@/firebase/firestore/hooks";
import type { Transaction, Debt, UserProfile } from "@/lib/types";
import { getCashFlowAdviceAction, type FormState } from "./actions";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? "Analyzing..." : "Get AI Insights"}
      <Sparkles className="ml-2 h-4 w-4" />
    </Button>
  );
}


export default function DashboardPage() {
  const { user } = useUser();
  const { data: profile } = useDoc<UserProfile>(user ? `users/${user.uid}` : null);
  const { data: transactions = [] } = useCollection<Transaction>(user ? `users/${user.uid}/transactions` : null);
  const { data: debts = [] } = useCollection<Debt>(user ? `users/${user.uid}/debts` : null);

  const initialState: FormState = { message: "" };
  const [state, formAction] = useActionState(getCashFlowAdviceAction, initialState);

  const totalIncome = profile?.income || 0;
  const totalSpending = transactions.reduce((sum, t) => sum + t.amount, 0);
  const totalDebt = debts.reduce((sum, d) => sum + d.amount, 0);
  const savingsGoal = profile?.savingsGoal || 0;
  const currentSavings = profile?.savings || 0;
  const savingsProgress = savingsGoal > 0 ? (currentSavings / savingsGoal) * 100 : 0;
  
  // Create a summary of recent spending for the AI prompt
  const spendingHabitsSummary = transactions
    .slice(0, 10)
    .map(t => `${t.category}: $${t.amount.toFixed(2)} on ${t.name}`)
    .join(', ');

  return (
    <div className="flex flex-col gap-8">
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
            <p className="text-xs text-muted-foreground">Your monthly income</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spending</CardTitle>
            <ArrowDownLeft className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalSpending.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">This month</p>
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
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Debt</CardTitle>
            <Landmark className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalDebt.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Across all accounts</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 grid gap-4">
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
                        <div className="text-sm text-muted-foreground">{new Date(transaction.date).toLocaleDateString()}</div>
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
                Your progress towards your ${savingsGoal > 0 ? savingsGoal.toLocaleString() : 'goal'}.
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
                    {savingsGoal > 0 ? "You're on track! Keep going, you've got this." : "Set a savings goal in your profile to track your progress."}
                </div>
            </CardContent>
            </Card>
        </div>
        <div className="lg:col-span-1">
          <Card>
             <form action={formAction}>
                <input type="hidden" name="income" value={totalIncome} />
                <input type="hidden" name="expenses" value={totalSpending} />
                <input type="hidden" name="debts" value={totalDebt} />
                <input type="hidden" name="savings" value={currentSavings} />
                <input type="hidden" name="spendingHabits" value={spendingHabitsSummary} />
                <CardHeader>
                    <CardTitle>AI Cash Flow Advisor</CardTitle>
                    <CardDescription>
                        Get personalized insights and suggestions on your financial health.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                {state.insights || state.suggestions ? (
                    <Alert>
                        <Sparkles className="h-4 w-4" />
                        <AlertTitle>Your Financial Insights</AlertTitle>
                        <AlertDescription className="mt-2 space-y-4">
                            <div>
                                <h4 className="font-semibold">Insights:</h4>
                                <p className="text-sm">{state.insights}</p>
                            </div>
                            <Separator />
                             <div>
                                <h4 className="font-semibold">Suggestions:</h4>
                                <p className="text-sm">{state.suggestions}</p>
                            </div>
                        </AlertDescription>
                    </Alert>
                ) : (
                    <div className="flex h-[200px] items-center justify-center rounded-md border border-dashed text-center">
                        <p className="text-sm text-muted-foreground">
                        {state.message || "Click the button to get AI-powered advice."}
                        </p>
                    </div>
                )}

                </CardContent>
                <CardFooter>
                     <SubmitButton />
                </CardFooter>
             </form>
           </Card>
        </div>
      </div>
    </div>
  );
}
