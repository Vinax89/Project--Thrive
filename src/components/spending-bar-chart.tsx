
"use client";

import * as React from "react";
import { Bar, BarChart, XAxis, YAxis, Tooltip } from "recharts";
import {
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { Transaction } from "@/lib/types";
import { startOfMonth, isWithinInterval } from 'date-fns';

interface SpendingBarChartProps {
  transactions: Transaction[];
}

const chartConfig = {
  amount: {
    label: "Amount",
    color: "hsl(var(--primary))",
  },
};

export function SpendingBarChart({ transactions }: SpendingBarChartProps) {
  const chartData = React.useMemo(() => {
    const currentMonthStart = startOfMonth(new Date());
    const currentMonthEnd = new Date();

    const spendingByCategory = transactions
      .filter(t => isWithinInterval(new Date(t.date), { start: currentMonthStart, end: currentMonthEnd }))
      .reduce((acc, transaction) => {
        const { category, amount } = transaction;
        if (!acc[category]) {
          acc[category] = 0;
        }
        acc[category] += amount;
        return acc;
      }, {} as Record<string, number>);

    return Object.entries(spendingByCategory)
      .map(([category, amount]) => ({
        category,
        amount,
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [transactions]);


  if (chartData.length === 0) {
    return (
         <div className="flex h-[300px] w-full items-center justify-center rounded-md border border-dashed text-center">
            <p className="text-sm text-muted-foreground">No spending data for this month yet.</p>
        </div>
    )
  }

  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full h-[300px]">
      <BarChart accessibilityLayer data={chartData} margin={{ top: 20, right: 20, left: 20, bottom: 5 }}>
        <XAxis
          dataKey="category"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          angle={-45}
          textAnchor="end"
          height={60}
          interval={0}
        />
        <YAxis />
        <Tooltip
          cursor={false}
          content={<ChartTooltipContent indicator="dot" />}
        />
        <Bar dataKey="amount" fill="var(--color-amount)" radius={4} />
      </BarChart>
    </ChartContainer>
  );
}
