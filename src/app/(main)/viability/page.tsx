'use client';

import { useActionState, useFormStatus } from 'react-dom';
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
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Banknote, Sparkles, Scale } from 'lucide-react';
import { getIncomeViabilityAction, type FormState } from './actions';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? 'Calculating...' : 'Calculate Viability'}
      <Sparkles className="ml-2 h-4 w-4" />
    </Button>
  );
}

function ViabilityResults({ output }: { output: FormState['output'] }) {
  if (!output) return null;
  return (
    <Alert>
      <Scale className="h-4 w-4" />
      <AlertTitle>Viability Assessment</AlertTitle>
      <AlertDescription className="mt-4 space-y-4">
        <p className="font-semibold">{output.assessment}</p>
        <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-1">
                <p className="text-muted-foreground">Gross Income</p>
                <p className="font-medium">${output.netIncome + output.taxBurden}</p>
            </div>
            <div className="space-y-1">
                <p className="text-muted-foreground">Est. Zip-Aware Tax</p>
                <p className="font-medium text-red-600">-${output.taxBurden.toLocaleString()}</p>
            </div>
            <div className="space-y-1">
                <p className="text-muted-foreground">Net Income</p>
                <p className="font-medium">${output.netIncome.toLocaleString()}</p>
            </div>
            <div className="space-y-1">
                <p className="text-muted-foreground">Est. Cost of Living</p>
                <p className="font-medium text-red-600">-${output.costOfLiving.toLocaleString()}</p>
            </div>
        </div>
        <div className="border-t pt-4">
            <p className="text-muted-foreground">Est. Disposable Income</p>
            <p className="text-xl font-bold">${output.disposableIncome.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Income after taxes and estimated cost of living.</p>
        </div>
      </AlertDescription>
    </Alert>
  );
}

export default function ViabilityPage() {
  const initialState: FormState = { message: '' };
  const [state, formAction] = useActionState(getIncomeViabilityAction, initialState);

  return (
    <div className="flex flex-col gap-8 animate-fade-slide-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Income Viability & Tax</h1>
        <p className="text-muted-foreground">
          Assess your income against zip-aware tax estimates and cost of living.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <form action={formAction}>
            <Card>
              <CardHeader>
                <CardTitle>Enter Your Details</CardTitle>
                <CardDescription>
                  Provide your gross annual income and 5-digit US zip code for analysis.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="grossIncome">Annual Gross Income</Label>
                  <Input
                    id="grossIncome"
                    name="grossIncome"
                    type="number"
                    placeholder="e.g., 80000"
                    required
                  />
                  {state.issues?.grossIncome && <p className="text-xs text-destructive">{state.issues.grossIncome}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zipCode">5-Digit Zip Code</Label>
                  <Input
                    id="zipCode"
                    name="zipCode"
                    placeholder="e.g., 90210"
                    required
                    maxLength={5}
                  />
                   {state.issues?.zipCode && <p className="text-xs text-destructive">{state.issues.zipCode}</p>}
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
              <CardTitle>Analysis Results</CardTitle>
              <CardDescription>
                Your income viability assessment will appear here.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {state.output ? (
                <ViabilityResults output={state.output} />
              ) : (
                <div className="flex h-[300px] w-full items-center justify-center rounded-md border border-dashed text-center">
                  <p className="text-sm text-muted-foreground">
                    {state.message || 'Your income analysis awaits.'}
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
