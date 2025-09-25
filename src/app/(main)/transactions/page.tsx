
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
import { Pencil, PlusCircle, Trash2 } from "lucide-react";
import { useFirestore, useMemoFirebase } from "@/firebase/provider";
import { collection } from "firebase/firestore";
import { EditTransactionDialog } from "@/components/edit-transaction-dialog";

export default function TransactionsPage() {
  const { user } = useUser();
  const firestore = useFirestore();

  const transactionsColRef = useMemoFirebase(
    () => (user && firestore ? collection(firestore, `users/${user.uid}/transactions`) : null),
    [user, firestore]
  );
  const { data: transactions = [], add, remove, update } = useCollection<Transaction>(transactionsColRef);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  const handleAddTransaction = (transaction: Omit<Transaction, "id">) => {
    add(transaction);
    setIsAddDialogOpen(false);
  };
  
  const handleUpdateTransaction = (id: string, transaction: Partial<Transaction>) => {
    update(id, transaction);
    setEditingTransaction(null);
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
        <EditTransactionDialog 
            isOpen={isAddDialogOpen}
            onOpenChange={setIsAddDialogOpen}
            onSave={handleAddTransaction}
            trigger={
                <Button onClick={() => setIsAddDialogOpen(true)}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Transaction
                </Button>
            }
        />
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
              {transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="font-medium">{transaction.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{transaction.category}</Badge>
                  </TableCell>
                  <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    ${transaction.amount.toFixed(2)}
                  </TableCell>
                   <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => setEditingTransaction(transaction)}>
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
        {editingTransaction && (
            <EditTransactionDialog
                isOpen={!!editingTransaction}
                onOpenChange={(isOpen) => !isOpen && setEditingTransaction(null)}
                onSave={(data) => editingTransaction?.id && handleUpdateTransaction(editingTransaction.id, data)}
                transaction={editingTransaction}
            />
        )}
    </div>
  );
}
