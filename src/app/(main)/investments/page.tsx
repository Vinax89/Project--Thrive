
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
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PlusCircle, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";

export default function InvestmentsPage() {
  const { user } = useUser();
  const { data: investments = [], add, remove } = useCollection<Investment>(
    user ? `users/${user.uid}/investments` : null
  );

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newInvestmentName, setNewInvestmentName] = useState("");
  const [newInvestmentType, setNewInvestmentType] = useState("");
  const [newInvestmentQuantity, setNewInvestmentQuantity] = useState("");
  const [newInvestmentPurchasePrice, setNewInvestmentPurchasePrice] =
    useState("");
  const [newInvestmentCurrentPrice, setNewInvestmentCurrentPrice] =
    useState("");

  const totalPortfolioValue = investments.reduce(
    (sum, investment) => sum + investment.quantity * investment.currentPrice,
    0
  );

  const handleAddInvestment = () => {
    if (
      newInvestmentName &&
      newInvestmentType &&
      newInvestmentQuantity &&
      newInvestmentPurchasePrice &&
      newInvestmentCurrentPrice
    ) {
      add({
        name: newInvestmentName,
        type: newInvestmentType,
        quantity: parseFloat(newInvestmentQuantity),
        purchasePrice: parseFloat(newInvestmentPurchasePrice),
        currentPrice: parseFloat(newInvestmentCurrentPrice),
      });
      setNewInvestmentName("");
      setNewInvestmentType("");
      setNewInvestmentQuantity("");
      setNewInvestmentPurchasePrice("");
      setNewInvestmentCurrentPrice("");
      setIsDialogOpen(false);
    }
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
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Investment
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Investment</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Input
                placeholder="Investment Name (e.g., Apple Inc.)"
                value={newInvestmentName}
                onChange={(e) => setNewInvestmentName(e.target.value)}
              />
              <Input
                placeholder="Type (e.g., Stock, ETF)"
                value={newInvestmentType}
                onChange={(e) => setNewInvestmentType(e.target.value)}
              />
              <Input
                type="number"
                placeholder="Quantity"
                value={newInvestmentQuantity}
                onChange={(e) => setNewInvestmentQuantity(e.target.value)}
              />
              <Input
                type="number"
                placeholder="Purchase Price per Share"
                value={newInvestmentPurchasePrice}
                onChange={(e) => setNewInvestmentPurchasePrice(e.target.value)}
              />
              <Input
                type="number"
                placeholder="Current Price per Share"
                value={newInvestmentCurrentPrice}
                onChange={(e) => setNewInvestmentCurrentPrice(e.target.value)}
              />
              <Button onClick={handleAddInvestment}>Add Investment</Button>
            </div>
          </DialogContent>
        </Dialog>
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
                <TableHead className="w-[50px]"></TableHead>
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
                    <TableCell className={cn("text-right font-medium flex items-center justify-end", isGain ? "text-green-600" : "text-red-600")}>
                      {isGain ? <ArrowUp className="h-4 w-4 mr-1" /> : <ArrowDown className="h-4 w-4 mr-1" />}
                      ${Math.abs(gainLoss).toFixed(2)}
                    </TableCell>
                    <TableCell>
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
    </div>
  );
}
