
'use server';

/**
 * @fileOverview An envelope budgeting AI agent.
 *
 * - envelopeBudgeting - A function that suggests fund allocations based on prior debts, expenses, and income.
 * - EnvelopeBudgetingInput - The input type for the envelopeBudgeting function.
 * - EnvelopeBudgetingOutput - The return type for the envelopeBudgeting function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EnvelopeBudgetingInputSchema = z.object({
  priorDebts: z
    .string()
    .describe('The users prior debts, provided as a JSON string.'),
  expenses: z
    .string()
    .describe('The user expenses, provided as a JSON string.'),
  income: z.number().describe('The user income.'),
});
export type EnvelopeBudgetingInput = z.infer<typeof EnvelopeBudgetingInputSchema>;

const EnvelopeBudgetingOutputSchema = z.object({
  suggestedAllocations: z
    .string()
    .describe(
      'A JSON string representing suggested fund allocations to different categories, based on prior debts, expenses, and income.'
    ),
});
export type EnvelopeBudgetingOutput = z.infer<typeof EnvelopeBudgetingOutputSchema>;

export async function envelopeBudgeting(input: EnvelopeBudgetingInput): Promise<EnvelopeBudgetingOutput> {
  return envelopeBudgetingFlow(input);
}

const prompt = ai.definePrompt({
  name: 'envelopeBudgetingPrompt',
  input: {schema: EnvelopeBudgetingInputSchema},
  output: {schema: EnvelopeBudgetingOutputSchema},
  prompt: `You are a personal finance expert. You will be provided with the user's prior debts, expenses, and income. Your task is to suggest a balanced monthly budget allocation.

- Analyze the user's financial situation.
- Create a set of budget categories (e.g., Housing, Food, Transport, Utilities, Debt Repayment, Savings, Discretionary).
- Allocate the user's total income across these categories.
- Ensure the total allocation equals the user's income.
- The output MUST be a valid JSON string, where keys are the category names and values are the allocated amounts.

Prior Debts: {{{priorDebts}}}
Expenses: {{{expenses}}}
Income: {{{income}}}

Return a JSON string representing the suggested fund allocations. The total of all allocations must sum up exactly to the income. Prioritize debt repayment and savings after essential expenses.
`,
});

const envelopeBudgetingFlow = ai.defineFlow(
  {
    name: 'envelopeBudgetingFlow',
    inputSchema: EnvelopeBudgetingInputSchema,
    outputSchema: EnvelopeBudgetingOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
