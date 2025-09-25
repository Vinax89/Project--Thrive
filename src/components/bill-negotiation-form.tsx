"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { generateScriptAction, type FormState } from "@/app/(main)/negotiate/actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal, Sparkles } from "lucide-react";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Generating..." : "Generate Script"}
      <Sparkles className="ml-2 h-4 w-4" />
    </Button>
  );
}

export function BillNegotiationForm() {
  const initialState: FormState = { message: "" };
  const [state, formAction] = useActionState(generateScriptAction, initialState);

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <Card className="lg:col-span-2">
        <form action={formAction}>
          <CardHeader>
            <CardTitle>Bill Details</CardTitle>
            <CardDescription>
              Fill in your bill details and our AI will generate a negotiation
              script for you.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="billType">Bill Type</Label>
                <Input id="billType" name="billType" placeholder="e.g., Internet, Phone" />
                {state.errors?.billType && <p className="text-xs text-destructive">{state.errors.billType}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="currentProvider">Provider</Label>
                <Input id="currentProvider" name="currentProvider" placeholder="e.g., Comcast" />
                {state.errors?.currentProvider && <p className="text-xs text-destructive">{state.errors.currentProvider}</p>}
              </div>
            </div>
             <div className="space-y-2">
              <Label htmlFor="monthlyCost">Monthly Cost ($)</Label>
              <Input id="monthlyCost" name="monthlyCost" type="number" step="0.01" placeholder="e.g., 79.99" />
              {state.errors?.monthlyCost && <p className="text-xs text-destructive">{state.errors.monthlyCost}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="servicesProvided">Services Provided</Label>
              <Textarea id="servicesProvided" name="servicesProvided" placeholder="e.g., 1Gbps internet, 2 phone lines" />
               {state.errors?.servicesProvided && <p className="text-xs text-destructive">{state.errors.servicesProvided}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="reasonForNegotiation">Reason for Negotiation</Label>
              <Textarea id="reasonForNegotiation" name="reasonForNegotiation" placeholder="e.g., Found cheaper offer, service issues" />
              {state.errors?.reasonForNegotiation && <p className="text-xs text-destructive">{state.errors.reasonForNegotiation}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="desiredOutcome">Desired Outcome</Label>
              <Input id="desiredOutcome" name="desiredOutcome" placeholder="e.g., Lower monthly bill to $50" />
               {state.errors?.desiredOutcome && <p className="text-xs text-destructive">{state.errors.desiredOutcome}</p>}
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
                <CardTitle>Your Negotiation Script</CardTitle>
                <CardDescription>The generated script will appear below.</CardDescription>
            </CardHeader>
            <CardContent>
                {state.script ? (
                    <Alert>
                        <Terminal className="h-4 w-4" />
                        <AlertTitle>Script Ready!</AlertTitle>
                        <AlertDescription className="mt-2 whitespace-pre-wrap font-mono text-sm">
                            {state.script}
                        </AlertDescription>
                    </Alert>
                ) : (
                    <div className="flex h-[300px] items-center justify-center rounded-md border border-dashed text-center">
                        <p className="text-sm text-muted-foreground">
                        {state.message || "Your script is waiting to be generated."}
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
