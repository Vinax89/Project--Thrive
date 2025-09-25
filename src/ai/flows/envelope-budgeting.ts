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
  prompt: `You are a personal finance expert. You will be provided with the users prior debts, expenses, and income. You will use this information to suggest fund allocations to different categories, such as housing, food, transportation, utilities, debt repayment, and savings.

Prior Debts: {{{priorDebts}}}
Expenses: {{{expenses}}}
Income: {{{income}}}

Return a JSON string representing the suggested fund allocations. Be sure to include reasonable categories. The total of the categories should add up to the income. Make sure to reduce debt as much as possible while still giving the user enough spending money to survive.
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
