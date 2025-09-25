
'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { usePlaidLink } from 'react-plaid-link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Banknote, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { createLinkToken, exchangePublicToken } from './actions';

export default function LinkAccountPage() {
  const [linkToken, setLinkToken] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    async function getToken() {
      try {
        const token = await createLinkToken();
        if (token) {
          setLinkToken(token);
        } else {
          toast({
            variant: "destructive",
            title: 'Error creating Plaid link token',
            description: 'Could not create a Plaid link token. Please try again later.',
          });
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: 'Error creating Plaid link token',
          description: 'Could not create a Plaid link token. Please try again later.',
        });
      }
    }
    getToken();
  }, [toast]);

  const onSuccess = useCallback(async (public_token: string) => {
    // In a real application, you would send the public_token to your server
    // to exchange it for an access_token and securely store it.
    await exchangePublicToken(public_token);
    toast({
      title: 'Connection Successful (Simulation)',
      description:
        'Your account has been securely linked. This is a frontend demonstration. No data has been stored.',
    });
  }, [toast]);

  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess,
  });

  return (
    <div className="flex flex-col gap-8 animate-fade-slide-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Link Financial Accounts
        </h1>
        <p className="text-muted-foreground">
          Automatically import transactions by connecting your bank accounts via Plaid.
        </p>
      </div>

      <Card className="mx-auto w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Connect a Bank Account</CardTitle>
          <CardDescription>
            Securely link your bank using Plaid. This demonstration shows the client-side flow. A full implementation requires a backend to handle API secrets and access tokens.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex w-full items-center justify-center rounded-md border border-dashed p-12 text-center">
            <p className="text-sm text-muted-foreground">
              Your linked accounts will appear here once connected.
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={() => open()} disabled={!ready} className="w-full">
            {!ready ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
                <Banknote className="mr-2 h-4 w-4" />
            )}
            Connect an Account
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
