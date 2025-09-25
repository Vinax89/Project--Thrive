'use server';
/**
 * @fileOverview An AI-powered tool for providing tax optimization suggestions.
 *
 * - getTaxOptimizationSuggestions - A function that returns tax-saving ideas.
 * - TaxOptimizerInput - The input type for the getTaxOptimizationSuggestions function.
 * - TaxOptimizerOutput - The return type for the getTaxOptimizationSuggestions function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const TaxOptimizerInputSchema = z.object({
  income: z.number().describe("The user's annual gross income."),
  filingStatus: z
    .enum(['Single', 'Married Filing Jointly', 'Married Filing Separately', 'Head of Household', 'Qualifying Widow(er)'])
    .describe('The user\'s tax filing status.'),
  currentDeductions: z.string().describe('A summary of the user\'s current known deductions, e.g., "Standard deduction", "Mortgage interest, property taxes".'),
  retirementContribution: z.number().describe('The user\'s current annual contribution to retirement accounts like 401(k) or IRA.'),
});
export type TaxOptimizerInput = z.infer<typeof TaxOptimizerInputSchema>;

const TaxOptimizerOutputSchema = z.object({
  suggestions: z.string().describe('A markdown-formatted string with actionable tax optimization suggestions.'),
});
export type TaxOptimizerOutput = z.infer<typeof TaxOptimizerOutputSchema>;


export async function getTaxOptimizationSuggestions(
  input: TaxOptimizerInput
): Promise<TaxOptimizerOutput> {
  return taxOptimizerFlow(input);
}


const prompt = ai.definePrompt({
  name: 'taxOptimizerPrompt',
  input: { schema: TaxOptimizerInputSchema },
  output: { schema: TaxOptimizerOutputSchema },
  prompt: `You are an AI financial assistant providing educational tax optimization suggestions.

IMPORTANT: Start your response with a clear disclaimer: "**Disclaimer:** I am an AI assistant and not a certified tax professional. These are general educational suggestions, not financial advice. Please consult a qualified professional for personalized tax planning."

Based on the user's financial profile, provide a list of common tax-saving strategies they might consider exploring. For each suggestion, provide a brief, easy-to-understand explanation.

User Profile:
- Annual Income: \${{{income}}}
- Filing Status: {{{filingStatus}}}
- Current Known Deductions: {{{currentDeductions}}}
- Annual Retirement Contribution: \${{{retirementContribution}}}

Suggestions should be actionable and relevant to the user's profile. Focus on common areas like retirement accounts (401k, IRA), HSAs, and potential itemized deductions if applicable. Format the output as a markdown list.
  `,
});


const taxOptimizerFlow = ai.defineFlow(
  {
    name: 'taxOptimizerFlow',
    inputSchema: TaxOptimizerInputSchema,
    outputSchema: TaxOptimizerOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
