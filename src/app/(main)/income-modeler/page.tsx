'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Sparkles, Bot, Banknote } from 'lucide-react';
import { modelIncomeAction, type FormState } from './actions';
import ReactMarkdown from 'react-markdown';


function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? 'Calculating...' : 'Model My Income'}
      <Sparkles className="ml-2 h-4 w-4" />
    </Button>
  );
}

export default function IncomeModelerPage() {
  const initialState: FormState = { message: '' };
  const [state, formAction] = useActionState(modelIncomeAction, initialState);

  return (
    <div className="flex flex-col gap-8 animate-fade-slide-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">AI Income Modeler</h1>
        <p className="text-muted-foreground">
          Describe your work schedule and pay to get a precise income estimate.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <form action={formAction}>
            <Card>
              <CardHeader>
                <CardTitle>Describe Your Schedule</CardTitle>
                <CardDescription>
                  Be as detailed as possible, including hourly rates, overtime, and shift differentials.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                 <div className="space-y-2">
                    <Label htmlFor="scheduleDescription">Work & Pay Details</Label>
                    <Textarea
                      id="scheduleDescription"
                      name="scheduleDescription"
                      placeholder="e.g., I work 40 hours/week at $25/hr. I get time-and-a-half for any hours over 40. On weekends, I get a 15% pay differential."
                      rows={6}
                    />
                    {state.errors?.scheduleDescription && <p className="text-xs text-destructive">{state.errors.scheduleDescription[0]}</p>}
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
              <CardTitle>Income Analysis</CardTitle>
              <CardDescription>
                The AI's calculation and estimates will appear here.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {state.output ? (
                <Alert>
                  <Bot className="h-4 w-4" />
                  <AlertTitle>AI Calculation Breakdown</AlertTitle>
                  <AlertDescription className="mt-4 space-y-4">
                    <div className="prose prose-sm max-w-none">
                        <ReactMarkdown>{state.output.reasoning}</ReactMarkdown>
                    </div>
                    <div className="grid grid-cols-2 gap-4 rounded-lg border bg-background p-4">
                         <div>
                            <p className="text-sm text-muted-foreground">Est. Weekly Income</p>
                            <p className="text-2xl font-bold">${state.output.estimatedWeeklyIncome.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
                         </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Est. Monthly Income</p>
                            <p className="text-2xl font-bold">${state.output.estimatedMonthlyIncome.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
                         </div>
                    </div>
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="flex h-[300px] w-full items-center justify-center rounded-md border border-dashed text-center">
                  <p className="text-sm text-muted-foreground">
                    {state.message || 'Your income model awaits.'}
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
