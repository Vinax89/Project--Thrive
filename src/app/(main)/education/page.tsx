
"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { getFinancialEducationContentAction, type FormState } from "./actions";
import { useUser } from "@/firebase/auth/use-user";
import { useCollection } from "@/firebase/firestore/hooks";
import type { Transaction, Debt } from "@/lib/types";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { BookOpen, Sparkles } from "lucide-react";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Getting Advice..." : "Get Advice"}
      <Sparkles className="ml-2 h-4 w-4" />
    </Button>
  );
}

export default function EducationPage() {
  const initialState: FormState = { message: "" };
  const [state, formAction] = useActionState(getFinancialEducationContentAction, initialState);

  const { user } = useUser();
  const { data: transactions = [] } = useCollection<Transaction>(user ? `users/${user.uid}/transactions` : null);
  const { data: debts = [] } = useCollection<Debt>(user ? `users/${user.uid}/debts` : null);
  
  // These are now hardcoded as we don't have a place to manage them yet
  const totalIncome = 5000;
  const currentSavings = 4500;

  return (
    <div className="flex flex-col gap-8 animate-fade-slide-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">AI Financial Education</h1>
        <p className="text-muted-foreground">
          Get personalized financial content to help you grow.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-2">
          <form action={formAction}>
            <input type="hidden" name="income" value={totalIncome} />
            <input type="hidden" name="expenses" value={JSON.stringify(transactions)} />
            <input type="hidden" name="debts" value={JSON.stringify(debts)} />
            <input type="hidden" name="savings" value={currentSavings} />

            <CardHeader>
              <CardTitle>Your Financial Goals</CardTitle>
              <CardDescription>
                Tell us what you want to achieve financially.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="financialGoals">Financial Goals</Label>
                <Textarea
                  id="financialGoals"
                  name="financialGoals"
                  placeholder="e.g., Save for a down payment, pay off my credit cards, start investing for retirement..."
                  rows={5}
                />
                {state.errors?.financialGoals && <p className="text-xs text-destructive">{state.errors.financialGoals}</p>}
              </div>
            </CardContent>
            <CardFooter>
              <SubmitButton />
            </CardFooter>
          </form>
        </Card>

        <div className="lg:col-span-3">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Your Personalized Content</CardTitle>
              <CardDescription>
                Recommended articles, guides, and tips will appear here.
              </d