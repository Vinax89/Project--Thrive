'use server';
/**
 * @fileOverview Provides AI-driven cash flow insights and suggests adjustments.
 *
 * - aiCashFlowAdvisor - A function that provides cash flow advice.
 * - AICashFlowAdvisorInput - The input type for the aiCashFlowAdvisor function.
 * - AICashFlowAdvisorOutput - The return type for the aiCashFlowAdvisor function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AICashFlowAdvisorInputSchema = z.object({
  income: z.number().describe('Total monthly income.'),
  expenses: z.number().describe('Total monthly expenses.'),
  debts: z.number().describe('Total outstanding debts.'),
  savings: z.number().describe('Total savings.'),
  spendingHabits: z
    .string()
    .describe(
      'A summary of the user spending habits over the past few months.'
    ),
});
export type AICashFlowAdvisorInput = z.infer<typeof AICashFlowAdvisorInputSchema>;

const AICashFlowAdvisorOutputSchema = z.object({
  insights: z
    .string()
    .describe('AI-driven insights on the user current financial situation.'),
  suggestions: z
    .string()
    .describe(
      'AI-driven suggestions for adjusting spending habits and managing finances.'
    ),
});
export type AICashFlowAdvisorOutput = z.infer<typeof AICashFlowAdvisorOutputSchema>;

export async function aiCashFlowAdvisor(
  input: AICashFlowAdvisorInput
): Promise<AICashFlowAdvisorOutput> {
  return aiCashFlowAdvisorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiCashFlowAdvisorPrompt',
  input: {schema: AICashFlowAdvisorInputSchema},
  output: {schema: AICashFlowAdvisorOutputSchema},
  prompt: `You are an AI-powered financial advisor. Provide insights and suggestions to the user based on their current financial situation.

Current Financial Situation:
- Income: {{income}}
- Expenses: {{expenses}}
- Debts: {{debts}}
- Savings: {{savings}}
- Spending Habits: {{spendingHabits}}

Provide concise insights into the user's financial health and suggest actionable adjustments to improve their cash flow.`,
});

const aiCashFlowAdvisorFlow = ai.defineFlow(
  {
    name: 'aiCashFlowAdvisorFlow',
    inputSchema: AICashFlowAdvisorInputSchema,
    outputSchema: AICashFlowAdvisorOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
