"use client";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useUser } from "@/firebase/auth/use-user";
import { useCollection, useDoc } from "@/firebase/firestore/hooks";
import type { Debt, UserProfile } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { PlusCircle, Trash2, Pencil } from "lucide-react";
import { EditDebtDialog } from "@/components/edit-debt-dialog";
import { useFirestore, useMemoFirebase } from "@/firebase/provider";
import { collection, doc, arrayUnion, updateDoc } from "firebase/firestore";
import { DebtPieChart } from "@/components/debt-pie-chart";
import { useToast } from "@/hooks/use-toast";


export default function DebtsPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const userDocRef = useMemoFirebase(
    () => (user && firestore ? doc(firestore, `users/${user.uid}`) : null),
    [user, firestore]
  );
  const { data: profile } = useDoc<UserProfile>(userDocRef);

  const debtsColRef = useMemoFirebase(
    () => (user && firestore ? collection(firestore, `users/${user.uid}/debts`) : null),
    [user, firestore]
  );
  const { data: debts = [], add, remove, update } = useCollection<Debt>(debtsColRef);
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDebt, setSelectedDebt] = useState<Debt | null>(null);

  const totalDebt = debts.reduce((sum, debt) => sum + debt.amount, 0);

  const handleAddClick = () => {
    setSelectedDebt(null);
    setIsDialogOpen(true);
  };
  
  const handleEditClick = (debt: Debt) => {
    setSelectedDebt(debt);
    setIsDialogOpen(true);
  };

  const handleSave = (data: Partial<Debt>) => {
    if (selectedDebt?.id) {
      update(selectedDebt.id, data);
    } else {
      add(data as Omit<Debt, "id">);
    }
    setIsDialogOpen(false);
    setSelectedDebt(null);
  };

  const handleRemove = async (debtId: string) => {
    await remove(debtId);
    
    if (userDocRef) {
        // Check if user has already earned this badge
        const earnedBadges = (profile as any)?.earnedBadges || [];
        if (!earnedBadges.includes('debt-demolisher')) {
          await updateDoc(userDocRef, { earnedBadges: arrayUnion('debt-demolisher') });
          toast({
            title: "Achievement Unlocked!",
            description: "You've earned the 'Debt Demolisher' badge. Keep it up!",
          });
        }
    }
  };


  return (
    <div className="flex flex-col gap-8 animate-fade-slide-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Debt Analysis</h1>
          <p className="text-muted-foreground">
            Analyze your outstanding debts and liabilities.
          </p>
        </div>
        <Button onClick={handleAddClick}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Debt
        </Button>
      </div>
      
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
            <Card>
                <CardHeader>
                <CardTitle>All Debts</CardTitle>
                <CardDescription>
                    Your total debt is ${totalDebt.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}.
                </CardDescription>
                </CardHeader>
                <CardContent>
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead>Debt Name</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead className="w-[100px] text-right">Actions</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {debts.map((debt) => (
                        <TableRow key={debt.id}>
                        <TableCell className="font-medium">{debt.name}</TableCell>
                        <TableCell>
                            <Badge
                            variant={
                                debt.type === "Credit Card"
                                ? "destructive"
                                : debt.type === "Loan"
                                ? "secondary"
                                : "outline"
                            }
                            >
                            {debt.type}
                            </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                            ${debt.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </TableCell>
                        <TableCell className="text-right">
                            <Button variant="ghost" size="icon" onClick={() => handleEditClick(debt)}>
                                <Pencil className="h-4 w-4 text-muted-foreground" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => debt.id && handleRemove(debt.id)}>
                                <Trash2 className="h-4 w-4 text-muted-foreground" />
                            </Button>
                        </TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
                </CardContent>
            </Card>
        </div>
        <div className="lg:col-span-1">
            <DebtPieChart debts={debts} />
        </div>
      </div>
       <EditDebtDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSave={handleSave}
        debt={selectedDebt}
      />
    </div>
  );
}
