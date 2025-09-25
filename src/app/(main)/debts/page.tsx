
"use client";

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
import { sampleDebts } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { useLocalStorage } from "@/hooks/use-local-storage";
import type { Debt } from "@/lib/types";

export default function DebtsPage() {
  const [debts] = useLocalStorage<Debt[]>("debts", sampleDebts);
  const totalDebt = debts.reduce((sum, debt) => sum + debt.amount, 0);

  return (
    <div className="flex flex-col gap-8 animate-fade-slide-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Debts</h1>
        <p className="text-muted-foreground">
          Manage and visualize your outstanding debts.
        </p>
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
                A complete list of your financial obligations. Totaling ${totalDebt.toLocaleString()}.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Debt Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {debts.map((debt) => (
                    <TableRow key={debt.name}>
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
                        ${debt.amount.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
