'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Banknote, CreditCard, Landmark, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const institutions = [
  { name: 'Chase Bank', icon: Landmark },
  { name: 'Bank of America', icon: Landmark },
  { name: 'Wells Fargo', icon: Landmark },
  { name: 'American Express', icon: CreditCard },
  { name: 'Capital One', icon: CreditCard },
  { name: 'Citi Bank', icon: Landmark },
];

export default function LinkAccountPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();

  const handleConnectClick = () => {
    setIsConnecting(true);
    // Simulate API call
    setTimeout(() => {
      setIsConnecting(false);
      setIsDialogOpen(false);
      toast({
        title: 'Connection Successful (Simulation)',
        description:
          'Your account has been securely linked. Transactions will begin syncing shortly.',
      });
    }, 2500);
  };

  return (
    <div className="flex flex-col gap-8 animate-fade-slide-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Link Financial Accounts
        </h1>
        <p className="text-muted-foreground">
          Automatically import transactions by connecting your bank accounts.
        </p>
      </div>

      <Card className="mx-auto w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Connect a Bank Account</CardTitle>
          <CardDescription>
            Securely link your bank using our integration partner. This is a
            demonstration UI. To implement this for real, you would use a
            service like Plaid or Teller.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex w-full items-center justify-center rounded-md border border-dashed p-12 text-center">
            <p className="text-sm text-muted-foreground">
              Your linked accounts will appear here.
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={() => setIsDialogOpen(true)} className="w-full">
            <Banknote className="mr-2 h-4 w-4" />
            Connect an Account
          </Button>
        </CardFooter>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Link a New Account</DialogTitle>
            <DialogDescription>
              Select your financial institution to get started.
            </DialogDescription>
          </DialogHeader>
          {isConnecting ? (
            <div className="flex h-64 w-full flex-col items-center justify-center gap-4">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
              <p className="text-muted-foreground">
                Securely connecting to your bank...
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 py-4">
              {institutions.map((inst, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="h-16 justify-start gap-3"
                  onClick={handleConnectClick}
                >
                  <inst.icon className="h-6 w-6 text-muted-foreground" />
                  <span>{inst.name}</span>
                </Button>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
