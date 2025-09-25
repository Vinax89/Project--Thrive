'use client';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { getFinancialEducationContentAction, FormState } from './actions';
import { useUser } from '@/firebase/auth/use-user';
import { useCollection, useDoc } from '@/firebase/firestore/hooks';
import type { Debt, Transaction, UserProfile } from '@/lib/types';
import { Sparkles, BookOpen } from 'lucide-react';
import { useFirestore, useMemoFirebase } from '@/firebase/provider';
import { collection, doc } from 'firebase/firestore';
import ReactMarkdown from 'react-markdown';


function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? "Generating..." : "Get My Learning Plan"}
      <Sparkles className="ml-2 h-4 w-4" />
    </Button>
  );
}

export default function EducationPage() {
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


  const initialState: FormState = { message: "" };
  const [state, formAction] = useActionState(getFinancialEducationContentAction, initialState);

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
            <CardHeader>
              <CardTitle>Your Financial Goals</CardTitle>
              <CardDescription>
                Tell us what you want to achieve, and we'll create a personalized learning plan for you.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <input type="hidden" name="income" value={(profile as any)?.income || 0} />
              <input type="hidden" name="debts" value={JSON.stringify(debts)} />
              <input type="hidden" name="expenses" value={JSON.stringify(transactions)} />
              <input type="hidden" name="savings" value={(profile as any)?.savings || 0} />
              <div className="grid w-full gap-2">
                <Label htmlFor="financialGoals">My financial goals are...</Label>
                <Textarea id="financialGoals" name="financialGoals" placeholder="e.g., Save for a down payment on a house, pay off my student loans, learn how to invest..." rows={5}/>
                {state.errors?.financialGoals && <p className="text-xs text-destructive">{state.errors.financialGoals}</p>}
              </div>
            </CardContent>
            <CardContent>
                <SubmitButton />
            </CardContent>
          </form>
        </Card>
        
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Your Learning Plan</CardTitle>
            <CardDescription>AI-driven content suggestions will appear here.</CardDescription>
          </CardHeader>
          <CardContent>
            {state.suggestedContent ? (
              <Alert>
                <BookOpen className="h-4 w-4" />
                <AlertTitle>Topics For You</AlertTitle>
                <AlertDescription className="mt-2 prose prose-sm max-w-none">
                  <ReactMarkdown>{state.suggestedContent}</ReactMarkdown>
                </AlertDescription>
              </Alert>
            ) : (
              <div className="flex h-[300px] w-full items-center justify-center rounded-md border border-dashed text-center">
                  <p className="text-sm text-muted-foreground">
                    {state.message || "Your personalized learning plan awaits."}
                  </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
