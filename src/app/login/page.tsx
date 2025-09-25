'use client';

import { useState } from 'react';
import { useAuth, useFirestore } from '@/firebase/provider';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  UserCredential,
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp, writeBatch } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CircleDollarSign } from 'lucide-react';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { sampleBudgetCategories, sampleDebts, sampleTransactions } from '@/lib/data';

export default function LoginPage() {
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const createUserProfile = async (userCredential: UserCredential) => {
    if (!firestore) return;
    const user = userCredential.user;
    const isNewUser = userCredential.metadata.creationTime === userCredential.metadata.lastSignInTime;

    const userRef = doc(firestore, 'users', user.uid);
    const userData = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || user.email?.split('@')[0],
      photoURL: user.photoURL,
      createdAt: serverTimestamp(),
      lastLogin: serverTimestamp(),
      // Initialize with default values
      income: 5000,
      savings: 1000,
      savingsGoal: 10000,
      earnedBadges: [],
    };
    
    if (isNewUser) {
        const batch = writeBatch(firestore);
        
        // Set user profile
        batch.set(userRef, userData, { merge: true });

        // Seed sample data
        sampleTransactions.forEach(t => {
            const newTransactionRef = doc(collection(firestore, `users/${user.uid}/transactions`));
            batch.set(newTransactionRef, t);
        });
        sampleDebts.forEach(d => {
            const newDebtRef = doc(collection(firestore, `users/${user.uid}/debts`));
            batch.set(newDebtRef, d);
        });
        sampleBudgetCategories.forEach(b => {
            const newBudgetRef = doc(collection(firestore, `users/${user.uid}/budgetCategories`));
            batch.set(newBudgetRef, b);
        });

        return batch.commit().catch(serverError => {
            const permissionError = new FirestorePermissionError({
                path: `users/${user.uid} and subcollections`,
                operation: 'write',
                requestResourceData: {note: "Batch write for new user setup."},
              });
            errorEmitter.emit('permission-error', permissionError);
        });

    } else {
         // For existing users, just update last login
        return setDoc(userRef, { lastLogin: serverTimestamp() }, { merge: true })
            .catch((serverError) => {
                const permissionError = new FirestorePermissionError({
                    path: userRef.path,
                    operation: 'update',
                    requestResourceData: { lastLogin: 'serverTimestamp' },
                  });
                errorEmitter.emit('permission-error', permissionError);
            });
    }
  };


  const handleEmailPasswordSignUp = async () => {
    if (!auth) return;
    setError(null);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, signUpEmail, signUpPassword);
      await createUserProfile(userCredential);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleEmailPasswordSignIn = async () => {
    if (!auth || !firestore) return;
    setError(null);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
      const userRef = doc(firestore, 'users', userCredential.user.uid);
      
      setDoc(userRef, { lastLogin: serverTimestamp() }, { merge: true })
        .catch((serverError) => {
          const permissionError = new FirestorePermissionError({
            path: userRef.path,
            operation: 'update',
            requestResourceData: { lastLogin: 'serverTimestamp' },
          });
          errorEmitter.emit('permission-error', permissionError);
        });
      
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleGoogleSignIn = async () => {
    if (!auth) return;
    setError(null);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      await createUserProfile(result);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2 xl:min-h-screen">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[400px] gap-6">
          <div className="grid gap-2 text-center">
             <div className="flex items-center justify-center gap-2 text-2xl font-headline font-semibold">
                <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <CircleDollarSign className="h-5 w-5" />
                </div>
                <span>Project: Thrive</span>
            </div>
            <p className="text-balance text-muted-foreground">
              Your all-in-one financial dashboard.
            </p>
          </div>
          <Tabs defaultValue="login" className="w-full" onValueChange={() => setError(null)}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <Card className="border-none shadow-none">
                <CardContent className="space-y-4 pt-6">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="m@example.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <Input
                      id="login-password"
                      type="password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                    />
                  </div>
                  {error && <p className="text-sm text-destructive">{error}</p>}
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                  <Button onClick={handleEmailPasswordSignIn} className="w-full">
                    Login
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleGoogleSignIn}
                    className="w-full"
                  >
                    Sign In with Google
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="signup">
               <Card className="border-none shadow-none">
                <CardContent className="space-y-4 pt-6">
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="m@example.com"
                      value={signUpEmail}
                      onChange={(e) => setSignUpEmail(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      value={signUpPassword}
                      onChange={(e) => setSignUpPassword(e.target.value)}
                    />
                  </div>
                  {error && <p className="text-sm text-destructive">{error}</p>}
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                  <Button onClick={handleEmailPasswordSignUp} className="w-full">
                    Sign Up
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleGoogleSignIn}
                    className="w-full"
                  >
                    Sign Up with Google
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <div className="hidden bg-muted lg:block">
        <Image
          data-ai-hint="finance abstract"
          src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyMHx8ZmluYW5jZXxlbnwwfHx8fDE3MjE4MzY3MTZ8MA&ixlib=rb-4.0.3&q=80&w=1080"
          alt="Abstract financial background"
          width="1920"
          height="1080"
          className="h-full w-full object-cover dark:brightness-[0.3] dark:grayscale"
        />
      </div>
    </div>
  );
}
