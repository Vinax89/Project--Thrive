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
import { useCollection } from "@/firebase/firestore/hooks";
import type { Transaction } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { PlusCircle, Trash2, Pencil } from "lucide-react";
import { EditTransactionDialog } from "@/components/edit-transaction-dialog";
import { useFirestore, useMemoFirebase } from "@/firebase/provider";
import { collection } from "firebase/firestore";

export default function TransactionsPage() {
  const { user } = useUser();
  const firestore = useFirestore();

  const transactionsColRef = useMemoFirebase(
    () => (user && firestore ? collection(firestore, `users/${user.uid}/transactions`) : null),
    [user, firestore]
  );
  const { data: transactions = [], add, remove, update } = useCollection<Transaction>(transactionsColRef);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  const handleAddClick = () => {
    setSelectedTransaction(null);
    setIsDialogOpen(true);
  };
  
  const handleEditClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsDialogOpen(true);
  };

  const handleSave = (data: Partial<Transaction>) => {
    if (selectedTransaction?.id) {
      update(selectedTransaction.id, data);
    } else {
      add(data as Omit<Transaction, "id">);
    }
    setIsDialogOpen(false);
    setSelectedTransaction(null);
  };

  return (
    <div className="flex flex-col gap-8 animate-fade-slide-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
          <p className="text-muted-foreground">
            A record of your income and expenses.
          </p>
        </div>
        <Button onClick={handleAddClick}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Transaction
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>All Transactions</CardTitle>
          <CardDescription>Your complete transaction history.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="w-[100px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions
                .sort(
                  (a, b) =>
                    new Date(b.date).getTime() - new Date(a.date).getTime()
                )
                .map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-medium">
                      {transaction.name}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{transaction.category}</Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(transaction.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      ${transaction.amount.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => handleEditClick(transaction)}>
                            <Pencil className="h-4 w-4 text-muted-foreground" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => transaction.id && remove(transaction.id)}>
                            <Trash2 className="h-4 w-4 text-muted-foreground" />
                        </Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <EditTransactionDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSave={handleSave}
        transaction={selectedTransaction}
      />
    </div>
  );
}
