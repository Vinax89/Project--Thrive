
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
import { DebtPieChart } from "@/components/debt-pie-chart";
import { Badge } from "@/components/ui/badge";
import { useUser } from "@/firebase/auth/use-user";
import { useCollection } from "@/firebase/firestore/hooks";
import type { Debt } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Pencil, PlusCircle, Trash2 } from "lucide-react";
import { useFirestore, useMemoFirebase } from "@/firebase/provider";
import { collection } from "firebase/firestore";
import { EditDebtDialog } from "@/components/edit-debt-dialog";


export default function DebtsPage() {
  const { user } = useUser();
  const firestore = useFirestore();

  const debtsColRef = useMemoFirebase(
    () => (user && firestore ? collection(firestore, `users/${user.uid}/debts`) : null),
    [user, firestore]
  );
  const { data: debts = [], add, remove, update } = useCollection<Debt>(debtsColRef);

  const totalDebt = debts.reduce((sum, debt) => sum + debt.amount, 0);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingDebt, setEditingDebt] = useState<Debt | null>(null);

  const handleAddDebt = (debt: Omit<Debt, 'id'>) => {
    add(debt);
    setIsAddDialogOpen(false);
  };
  
  const handleUpdateDebt = (id: string, debt: Partial<Debt>) => {
    update(id, debt);
    setEditingDebt(null);
  };


  return (
    <div className="flex flex-col gap-8 animate-fade-slide-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Debts</h1>
          <p className="text-muted-foreground">
            Manage and visualize your outstanding debts.
          </p>
        </div>
        <EditDebtDialog 
            isOpen={isAddDialogOpen}
            onOpenChange={setIsAddDialogOpen}
            onSave={handleAddDebt}
            trigger={
                <Button onClick={() => setIsAddDialogOpen(true)}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Debt
                </Button>
            }
        />
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <DebtPieChart debts={debts} />
        </div>
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>All Debts</CardTitle>
              <CardDescription>
                A complete list of your financial obligations. Totaling ${totalDebt.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}.
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
                        <Button variant="ghost" size="icon" onClick={() => setEditingDebt(debt)}>
                            <Pencil className="h-4 w-4 text-muted-foreground" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => debt.id && remove(debt.id)}>
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
      </div>
      {editingDebt && (
        <EditDebtDialog
            isOpen={!!editingDebt}
            onOpenChange={(isOpen) => !isOpen && setEditingDebt(null)}
            onSave={(data) => editingDebt?.id && handleUpdateDebt(editingDebt.id, data)}
            debt={editingDebt}
        />
      )}
    </div>
  );
}
