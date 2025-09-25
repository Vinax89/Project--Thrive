"use client";

import * as React from "react";
import { Line, LineChart, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
import {
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { Transaction } from "@/lib/types";
import { format, startOfMonth, eachMonthOfInterval, subMonths } from 'date-fns';

interface CashFlowLineChartProps {
  transactions: Transaction[];
  income: number;
}

const chartConfig = {
  income: {
    label: "Income",
    color: "hsl(var(--chart-2))",
  },
  expenses: {
    label: "Expenses",
    color: "hsl(var(--chart-5))",
  },
};

export function CashFlowLineChart({ transactions, income }: CashFlowLineChartProps) {
  const chartData = React.useMemo(() => {
    const sixMonthsAgo = subMonths(new Date(), 5);
    const months = eachMonthOfInterval({
      start: startOfMonth(sixMonthsAgo),
      end: startOfMonth(new Date()),
    });

    return months.map(month => {
      const monthStart = startOfMonth(month);
      const monthEnd = new Date(month.getFullYear(), month.getMonth() + 1, 0);

      const monthlyExpenses = transactions
        .filter(t => {
            const tDate = new Date(t.date);
            return tDate >= monthStart && tDate <= monthEnd;
        })
        .reduce((sum, t) => sum + t.amount, 0);

      return {
        month: format(month, 'MMM'),
        income: income,
        expenses: monthlyExpenses,
      };
    });
  }, [transactions, income]);

  if (chartData.length === 0) {
    return (
        <div className="flex h-[300px] w-full items-center justify-center rounded-md border border-dashed text-center">
            <p className="text-sm text-muted-foreground">Not enough data to display cash flow.</p>
        </div>
    )
  }

  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full h-[300px]">
      <ResponsiveContainer>
        <LineChart accessibilityLayer data={chartData} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
            <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            />
            <YAxis tickLine={false} axisLine={false} tickMargin={10}/>
            <Tooltip cursor={false} content={<ChartTooltipContent />} />
            <Legend />
            <Line
            dataKey="income"
            type="monotone"
            stroke="var(--color-income)"
            strokeWidth={2}
            dot={true}
            />
            <Line
            dataKey="expenses"
            type="monotone"
            stroke="var(--color-expenses)"
            strokeWidth={2}
            dot={true}
            />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
