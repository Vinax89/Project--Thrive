"use client";
import { useMemo, useState } from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useUser } from "@/firebase/auth/use-user";
import { useCollection, useDoc } from "@/firebase/firestore/hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { BudgetCategory, Transaction, Debt, UserProfile } from "@/lib/types";
import { PlusCircle, Trash2, Sparkles, Terminal } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { getEnvelopeBudgetAction, FormState } from "./actions";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useFirestore, useMemoFirebase } from "@/firebase/provider";
import { collection, doc, arrayUnion } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? "Analyzing..." : "Get AI Suggestions"}
      <Sparkles className="ml-2 h-4 w-4" />
    </Button>
  );
}

export default function BudgetPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const userDocRef = useMemoFirebase(
    () => (user && firestore ? doc(firestore, `users/${user.uid}`) : null),
    [user, firestore]
  );
  const { data: profile, update: updateUser } = useDoc<UserProfile>(userDocRef);

  const budgetCategoriesColRef = useMemoFirebase(
    () => (user && firestore ? collection(firestore, `users/${user.uid}/budgetCategories`) : null),
    [user, firestore]
  );
  const { data: budgetCategories = [], add, remove } = useCollection<BudgetCategory>(budgetCategoriesColRef);

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


  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryAllocated, setNewCategoryAllocated] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const initialState: FormState = { message: "" };
  const [state, formAction] = useActionState(getEnvelopeBudgetAction, initialState);

  const handleAddCategory = async () => {
    if (newCategoryName && newCategoryAllocated) {
      const isFirstCategory = budgetCategories.length === 0;

      await add({
        name: newCategoryName,
        allocated: parseFloat(newCategoryAllocated),
      });

      // Check for first budget badge
      if (isFirstCategory) {
        const earnedBadges = (profile as any)?.earnedBadges || [];
        if (!earnedBadges.includes('first-budget')) {
           await updateUser({ earnedBadges: arrayUnion('first-budget') });
           toast({
              title: "Achievement Unlocked!",
              description: "You've earned the 'Budget Boss' badge!",
          });
        }
      }

      setNewCategoryName("");
      setNewCategoryAllocated("");
      setIsDialogOpen(false);
    }
  };

  const categoriesWithSpent = useMemo(() => {
    return budgetCategories.map((category) => {
      const spent = transactions
        .filter(
          (t) => t.category.toLowerCase() === category.name.toLowerCase()
        )
        .reduce((sum, t) => sum + t.amount, 0);
      return { ...category, spent };
    });
  }, [budgetCategories, transactions]);

  const totalIncome = (profile as any)?.income || 0;

  const suggestedAllocations = useMemo(() => {
    if (!state.suggestedAllocations) return null;
    try {
      return JSON.parse(state.suggestedAllocations);
    } catch (e) {
      return null;
    }
  }, [state.suggestedAllocations]);


  return (
    <div className="flex flex-col gap-8 animate-fade-slide-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Budget Envelopes</h1>
          <p className="text-muted-foreground">
            Allocate and track your spending by category.
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Budget Category</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Input
                placeholder="Category Name"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
              />
              <Input
                type="number"
                placeholder="Allocated Amount"
                value={newCategoryAllocated}
                onChange={(e) => setNewCategoryAllocated(e.target.value)}
              />
              <Button onClick={handleAddCategory}>Add Category</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
           <div className="grid gap-6 md:grid-cols-2">
            {categoriesWithSpent.map((category) => {
              const progress =
                category.allocated > 0
                  ? ((category.spent || 0) / category.allocated) * 100
                  : 0;
              return (
                <Card key={category.id}>
                  <CardHeader className="flex flex-row items-start justify-between">
                    <div>
                      <CardTitle>{category.name}</CardTitle>
                      <CardDescription>
                        ${(category.spent || 0).toFixed(2)} spent of $
                        {category.allocated.toFixed(2)}
                      </CardDescription>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => category.id && remove(category.id)}
                    >
                      <Trash2 className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <Progress value={progress} />
                    <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                      <span>{progress.toFixed(0)}% Used</span>
                      <span>
                        $
                        {(category.allocated - (category.spent || 0)).toFixed(2)}{" "}
                        Left
                      </span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
            </div>
        </div>

        <div className="lg:col-span-1">
             <Card>
                <CardHeader>
                    <CardTitle>AI Budget Advisor</CardTitle>
                    <CardDescription>Get smart suggestions for your budget based on your financial data.</CardDescription>
                </CardHeader>
                <CardContent>
                     {suggestedAllocations ? (
                        <Alert>
                            <Terminal className="h-4 w-4" />
                            <AlertTitle>Suggested Allocations</AlertTitle>
                            <AlertDescription className="mt-2 space-y-1">
                                {Object.entries(suggestedAllocations).map(([key, value]) => (
                                    <div key={key} className="flex justify-between">
                                        <span>{key}</span>
                                        <span>${(value as number).toFixed(2)}</span>
                                    </div>
                                ))}
                            </AlertDescription>
                        </Alert>
                    ) : (
                        <div className="flex h-[150px] items-center justify-center rounded-md border border-dashed text-center">
                            <p className="text-sm text-muted-foreground">
                            {state.message || "Click the button for AI suggestions."}
                            </p>
                        </div>
                    )}
                </CardContent>
                 <CardContent>
                    <form action={formAction}>
                        <input type="hidden" name="income" value={totalIncome} />
                        <input type="hidden" name="expenses" value={JSON.stringify(transactions)} />
                        <input type="hidden" name="priorDebts" value={JSON.stringify(debts)} />
                        <SubmitButton />
                    </form>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
