
"use client";

import { useState } from "react";
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
import type { BudgetCategory } from "@/lib/types";
import { PlusCircle, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function BudgetPage() {
  const { user } = useUser();
  const { data: budgetCategories = [], add, remove } = useCollection<BudgetCategory>(
    user ? `users/${user.uid}/budgetCategories` : null
  );

  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryAllocated, setNewCategoryAllocated] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAddCategory = () => {
    if (newCategoryName && newCategoryAllocated) {
      add({
        name: newCategoryName,
        allocated: parseFloat(newCategoryAllocated),
        spent: 0,
      });
      setNewCategoryName("");
      setNewCategoryAllocated("");
      setIsDialogOpen(false);
    }
  };

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
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {budgetCategories.map((category) => {
          const progress = category.allocated > 0 ? (category.spent / category.allocated) * 100 : 0;
          return (
            <Card key={category.id}>
              <CardHeader className="flex flex-row items-start justify-between">
                <div>
                  <CardTitle>{category.name}</CardTitle>
                  <CardDescription>
                    ${category.spent.toFixed(2)} spent of ${category.allocated.toFixed(2)}
                  </CardDescription>
                </div>
                 <Button variant="ghost" size="icon" onClick={() => category.id && remove(category.id)}>
                    <Trash2 className="h-4 w-4 text-muted-foreground" />
                </Button>
              </CardHeader>
              <CardContent>
                <Progress value={progress} />
                <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                  <span>{progress.toFixed(0)}% Used</span>
                  <span>${(category.allocated - category.spent).toFixed(2)} Left</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
