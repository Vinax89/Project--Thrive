
'use server';

/**
 * @fileOverview An AI-powered financial education agent.
 *
 * - getFinancialEducationContent - A function that handles the retrieval of personalized financial education content.
 * - FinancialEducationInput - The input type for the getFinancialEducationContent function.
 * - FinancialEducationOutput - The return type for the getFinancialEducationContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FinancialEducationInputSchema = z.object({
  income: z.number().describe("The user's monthly income."),
  debts: z.string().describe("A JSON string representing the user's debts including type, amount, interest rate, and minimum payment."),
  expenses: z.string().describe("A JSON string representing the user's monthly expenses by category."),
  savings: z.number().describe("The user's current savings balance."),
  financialGoals: z.string().describe("The user's financial goals, e.g., saving for a down payment on a house, paying off debt, investing for retirement."),
});

export type FinancialEducationInput = z.infer<typeof FinancialEducationInputSchema>;

const FinancialEducationOutputSchema = z.object({
  suggestedContent: z.string().describe('A list of suggested financial education topics or resources that would be helpful for the user, formatted as a markdown list.'),
});

export type FinancialEducationOutput = z.infer<typeof FinancialEducationOutputSchema>;

export async function getFinancialEducationContent(input: FinancialEducationInput): Promise<FinancialEducationOutput> {
  return getFinancialEducationContentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'financialEducationPrompt',
  input: {schema: FinancialEducationInputSchema},
  output: {schema: FinancialEducationOutputSchema},
  prompt: `You are a financial advisor who provides personalized financial education content based on a user's financial situation and goals.

  Analyze the user's income, debts, expenses, savings, and financial goals to identify areas where they could benefit from financial education.

  Provide a list of specific financial education topics or resources that would be helpful for the user. Format the response as a markdown list.

  Income: {{{income}}}
  Debts: {{{debts}}}
  Expenses: {{{expenses}}}
  Savings: {{{savings}}}
  Financial Goals: {{{financialGoals}}}

  Suggested Content:`,
});

const getFinancialEducationContentFlow = ai.defineFlow(
  {
    name: 'getFinancialEducationContentFlow',
    inputSchema: FinancialEducationInputSchema,
    outputSchema: FinancialEducationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
