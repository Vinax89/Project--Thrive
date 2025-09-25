
"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { getFinancialEducationContentAction, type FormState } from "./actions";
import { useUser } from "@/firebase/auth/use-user";
import { useCollection, useDoc } from "@/firebase/firestore/hooks";
import type { Transaction, Debt, UserProfile } from "@/lib/types";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { BookOpen, Sparkles, Terminal } from "lucide-react";
import { useFirestore, useMemoFirebase } from "@/firebase/provider";
import { collection, doc } from "firebase/firestore";

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
  const firestore = useFirestore();

  const userDocRef = useMemoFirebase(
    () => (user && firestore ? doc(firestore, `users/${user.uid}`) : null),
    [user, firestore]
  );
  const { data: profile } = useDoc<UserProfile>(userDocRef);

  const transactionsColRef = useMemoFirebase(
    () => (user && firestore ? collection(firestore, `users/${user.uid}/transactions`) : null),
    [user, firestore]
  );
  const { data: transactions = [] } = useCollection<Transaction>(transactionsColRef);

  const debtsColRef = useMemoFirebase(
    () => (user && firestore ? collection(firestore, `users/${user.uid}/debts`) : null),
    [user, firestore]
  );
  const { data: debts = [] } = useCollection<Debt>(debtsColRef);
  
  const totalIncome = profile?.income || 0;
  const currentSavings = profile?.savings || 0;

  // Prepare simplified data for the AI prompt
  const simplifiedExpenses = JSON.stringify(transactions.map(({ name, amount, category }) => ({ name, amount, category })));
  const simplifiedDebts = JSON.stringify(debts.map(({ name, amount, type }) => ({ name, amount, type })));


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
            <input type="hidden" name="expenses" value={simplifiedExpenses} />
            <input type="hidden" name="debts" value={simplifiedDebts} />
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
              </CardDescription>
            </CardHeader>
            <CardContent>
               {state.suggestedContent ? (
                    <Alert>
                        <BookOpen className="h-4 w-4" />
                        <AlertTitle>Content Ready!</AlertTitle>
                        <AlertDescription className="mt-2 whitespace-pre-wrap text-sm">
                            {state.suggestedContent}
                        </AlertDescription>
                    </Alert>
                ) : (
                    <div className="flex h-[300px] items-center justify-center rounded-md border border-dashed text-center">
                        <p className="text-sm text-muted-foreground">
                        {state.message || "Your personalized content is waiting to be generated."}
                        </p>
                    </div>
                )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
