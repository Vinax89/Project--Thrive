'use client';

import { useActionState, useMemo } from 'react';
import { useFormStatus } from 'react-dom';
import ReactMarkdown from 'react-markdown';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Sparkles, Bot } from 'lucide-react';
import { getTaxSuggestionsAction, type FormState } from './actions';
import { useUser } from '@/firebase/auth/use-user';
import { useDoc } from '@/firebase/firestore/hooks';
import type { UserProfile } from '@/lib/types';
import { useFirestore, useMemoFirebase } from '@/firebase/provider';
import { doc } from 'firebase/firestore';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? 'Analyzing...' : 'Get Suggestions'}
      <Sparkles className="ml-2 h-4 w-4" />
    </Button>
  );
}

export default function TaxOptimizerPage() {
  const { user } = useUser();
  const firestore = useFirestore();

  const userDocRef = useMemoFirebase(
    () => (user && firestore ? doc(firestore, `users/${user.uid}`) : null),
    [user, firestore]
  );
  const { data: profile } = useDoc<UserProfile>(userDocRef);

  const income = useMemo(() => (profile as any)?.income || 0, [profile]);

  const initialState: FormState = { message: '' };
  const [state, formAction] = useActionState(getTaxSuggestionsAction, initialState);

  return (
    <div className="flex flex-col gap-8 animate-fade-slide-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">AI Tax Optimizer</h1>
        <p className="text-muted-foreground">
          Get educational suggestions on how you could optimize your tax situation.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <form action={formAction}>
            <Card>
              <CardHeader>
                <CardTitle>Your Financial Profile</CardTitle>
                <CardDescription>
                  Provide some details for the AI to analyze.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                 <input type="hidden" name="income" value={income * 12} />
                <div className="space-y-2">
                    <Label>Annual Gross Income (from Profile)</Label>
                    <Input
                        type="text"
                        disabled
                        value={`$${(income * 12).toLocaleString()}`}
                    />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="filingStatus">Filing Status</Label>
                   <Select name="filingStatus">
                    <SelectTrigger id="filingStatus">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Single">Single</SelectItem>
                      <SelectItem value="Married Filing Jointly">Married Filing Jointly</SelectItem>
                      <SelectItem value="Married Filing Separately">Married Filing Separately</SelectItem>
                      <SelectItem value="Head of Household">Head of Household</SelectItem>
                      <SelectItem value="Qualifying Widow(er)">Qualifying Widow(er)</SelectItem>
                    </SelectContent>
                  </Select>
                  {state.errors?.filingStatus && <p className="text-xs text-destructive">{state.errors.filingStatus[0]}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="currentDeductions">Current Deductions</Label>
                    <Textarea id="currentDeductions" name="currentDeductions" placeholder="e.g., Taking the standard deduction, 401k contributions." />
                    {state.errors?.currentDeductions && <p className="text-xs text-destructive">{state.errors.currentDeductions[0]}</p>}
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="retirementContribution">Annual Retirement Contribution</Label>
                    <Input id="retirementContribution" name="retirementContribution" type="number" placeholder="e.g., 6000"/>
                    {state.errors?.retirementContribution && <p className="text-xs text-destructive">{state.errors.retirementContribution[0]}</p>}
                </div>
              </CardContent>
              <CardFooter>
                <SubmitButton />
              </CardFooter>
            </Card>
          </form>
        </div>

        <div className="lg:col-span-3">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>AI-Generated Suggestions</CardTitle>
              <CardDescription>
                Potential tax-saving strategies will appear here.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {state.suggestions ? (
                <Alert>
                  <Bot className="h-4 w-4" />
                  <AlertTitle>Tax Saving Ideas</AlertTitle>
                  <AlertDescription className="mt-4 prose prose-sm max-w-none">
                     <ReactMarkdown>{state.suggestions}</ReactMarkdown>
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="flex h-[300px] w-full items-center justify-center rounded-md border border-dashed text-center">
                  <p className="text-sm text-muted-foreground">
                    {state.message || 'Your tax suggestions await.'}
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
