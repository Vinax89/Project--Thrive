"use client";

import * as React from "react";
import { Pie, PieChart, Cell, Tooltip } from "recharts";
import {
  ChartContainer,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type { Debt } from "@/lib/types";

interface DebtPieChartProps {
  debts: Debt[];
}

const chartConfig = {
  amount: {
    label: "Amount",
  },
  'Credit Card': {
    label: "Credit Card",
    color: "hsl(var(--chart-1))",
  },
  'Loan': {
    label: "Loan",
    color: "hsl(var(--chart-2))",
  },
  'BNPL': {
    label: "BNPL",
    color: "hsl(var(--chart-4))",
  },
};

export function DebtPieChart({ debts }: DebtPieChartProps) {
  const chartData = React.useMemo(() => {
    const debtByType = debts.reduce((acc, debt) => {
      if (!acc[debt.type]) {
        acc[debt.type] = 0;
      }
      acc[debt.type] += debt.amount;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(debtByType).map(([type, amount]) => ({
      type,
      amount,
      fill: chartConfig[type as keyof typeof chartConfig]?.color || "hsl(var(--chart-5))",
    }));
  }, [debts]);

  const totalDebt = React.useMemo(() => debts.reduce((sum, debt) => sum + debt.amount, 0), [debts]);

  if (debts.length === 0) {
    return (
        <Card className="flex flex-col">
            <CardHeader>
                <CardTitle>Debt Breakdown</CardTitle>
                <CardDescription>No debt data to display.</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <div className="flex h-[300px] w-full items-center justify-center rounded-md border border-dashed text-center">
                    <p className="text-sm text-muted-foreground">Add a debt to see your breakdown.</p>
                </div>
            </CardContent>
             <div className="flex flex-col items-center justify-center p-6 gap-2">
                <span className="text-sm text-muted-foreground">Total Debt</span>
                <span className="text-3xl font-bold font-headline">$0.00</span>
            </div>
        </Card>
    );
  }

  return (
    <Card className="flex flex-col">
       <CardHeader>
        <CardTitle>Debt Breakdown</CardTitle>
        <CardDescription>Distribution of your total debt by type.</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[300px]"
        >
          <PieChart>
            <Tooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="amount"
              nameKey="type"
              innerRadius={60}
              strokeWidth={5}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
             <ChartLegend content={<ChartLegendContent nameKey="type" />} />
          </PieChart>
        </ChartContainer>
      </CardContent>
       <div className="flex flex-col items-center justify-center p-6 gap-2">
        <span className="text-sm text-muted-foreground">Total Debt</span>
        <span className="text-3xl font-bold font-headline">
          ${totalDebt.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
      </div>
    </Card>
  );
}
