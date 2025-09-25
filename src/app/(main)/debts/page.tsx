
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
import { useCollection } from "@/firebase/firestore/use-collection";
import type { Debt } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlusCircle, Trash2 } from "lucide-react";

export default function DebtsPage() {
  const { user } = useUser();
  const { data: debts = [], add, remove } = useCollection<Debt>(
    user ? `users/${user.uid}/debts` : 'users/dummy/debts'
  );

  const totalDebt = debts.reduce((sum, debt) => sum + debt.amount, 0);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newDebtName, setNewDebtName] = useState("");
  const [newDebtAmount, setNewDebtAmount] = useState("");
  const [newDebtType, setNewDebtType] = useState<Debt['type'] | ''>('');

  const handleAddDebt = () => {
    if (newDebtName && newDebtAmount && newDebtType) {
      add({
        name: newDebtName,
        amount: parseFloat(newDebtAmount),
        type: newDebtType as Debt['type'],
      });
      setNewDebtName("");
      setNewDebtAmount("");
      setNewDebtType("");
      setIsDialogOpen(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 animate-fade-slide-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Debts</h1>
          <p className="text-muted-foreground">
            Manage your outstanding debts.
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Debt
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Debt</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Input
                placeholder="Debt Name (e.g., Visa Card)"
                value={newDebtName}
                onChange={(e) => setNewDebtName(e.target.value)}
              />
              <Input
                type="number"
                placeholder="Amount"
                value={newDebtAmount}
                onChange={(e) => setNewDebtAmount(e.target.value)}
              />
              <Select onValueChange={(value) => setNewDebtType(value as Debt['type'])}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Credit Card">Credit Card</SelectItem>
                  <SelectItem value="Loan">Loan</SelectItem>
                  <SelectItem value="BNPL">BNPL</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleAddDebt}>Add Debt</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
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
                <TableHead className="w-[50px]"></TableHead>
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
                  <TableCell>
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
  );
}
