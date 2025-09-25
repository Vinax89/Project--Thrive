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
import { useUser } from "@/firebase/auth/use-user";
import { useCollection } from "@/firebase/firestore/hooks";
import type { Investment } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { PlusCircle, Trash2, ArrowUp, ArrowDown, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFirestore, useMemoFirebase } from "@/firebase/provider";
import { collection } from "firebase/firestore";
import { EditInvestmentDialog } from "@/components/edit-investment-dialog";


export default function InvestmentsPage() {
  const { user } = useUser();
  const firestore = useFirestore();

  const investmentsColRef = useMemoFirebase(
    () => (user && firestore ? collection(firestore, `users/${user.uid}/investments`) : null),
    [user, firestore]
  );
  const { data: investments = [], add, remove, update } = useCollection<Investment>(investmentsColRef);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedInvestment, setSelectedInvestment] = useState<Investment | null>(null);


  const totalPortfolioValue = investments.reduce(
    (sum, investment) => sum + investment.quantity * investment.currentPrice,
    0
  );

  const handleAddClick = () => {
    setSelectedInvestment(null);
    setIsDialogOpen(true);
  };
  
  const handleEditClick = (investment: Investment) => {
    setSelectedInvestment(investment);
    setIsDialogOpen(true);
  };

  const handleSave = (data: Partial<Investment>) => {
    if (selectedInvestment?.id) {
      update(selectedInvestment.id, data);
    } else {
      add(data as Omit<Investment, "id">);
    }
    setIsDialogOpen(false);
    setSelectedInvestment(null);
  };

  return (
    <div className="flex flex-col gap-8 animate-fade-slide-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Investments</h1>
          <p className="text-muted-foreground">
            Track your investment portfolio.
          </p>
        </div>
        <Button onClick={handleAddClick}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Investment
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Portfolio</CardTitle>
          <CardDescription>
            Your total portfolio value is ${totalPortfolioValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
                <TableHead className="text-right">Current Value</TableHead>
                <TableHead className="text-right">Total Gain/Loss</TableHead>
                <TableHead className="w-[100px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {investments.map((investment) => {
                const currentValue = investment.quantity * investment.currentPrice;
                const purchaseValue = investment.quantity * investment.purchasePrice;
                const gainLoss = currentValue - purchaseValue;
                const isGain = gainLoss >= 0;
                return (
                  <TableRow key={investment.id}>
                    <TableCell className="font-medium">{investment.name}</TableCell>
                    <TableCell>{investment.type}</TableCell>
                    <TableCell className="text-right">{investment.quantity}</TableCell>
                    <TableCell className="text-right">${currentValue.toFixed(2)}</TableCell>
                    <TableCell className={cn("text-right font-medium flex items-center justify-end gap-1", isGain ? "text-green-600" : "text-red-600")}>
                      {isGain ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
                      ${Math.abs(gainLoss).toFixed(2)}
                    </TableCell>
                     <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => handleEditClick(investment)}>
                            <Pencil className="h-4 w-4 text-muted-foreground" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => investment.id && remove(investment.id)}>
                            <Trash2 className="h-4 w-4 text-muted-foreground" />
                        </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <EditInvestmentDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSave={handleSave}
        investment={selectedInvestment}
      />
    </div>
  );
}
