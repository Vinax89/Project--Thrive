'use server';
/**
 * @fileOverview An AI agent for calculating income viability based on location.
 *
 * - calculateIncomeViability - A function that calculates viability.
 * - IncomeViabilityInput - The input type for the function.
 * - IncomeViabilityOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// Tool to get financial data based on zip code
const getFinancialDataForZip = ai.defineTool(
  {
    name: 'getFinancialDataForZip',
    description: 'Returns the estimated annual federal tax burden and annual cost of living for a given US zip code.',
    inputSchema: z.object({
      zipCode: z.string().describe('The 5-digit US zip code.'),
      grossIncome: z.number().describe('The annual gross income.'),
    }),
    outputSchema: z.object({
        taxBurden: z.number().describe('Estimated annual federal tax amount.'),
        costOfLiving: z.number().describe('Estimated annual cost of living.'),
    }),
  },
  async ({ zipCode, grossIncome }) => {
    // In a real application, this would call a tax API and a cost of living index API.
    // For this demo, we'll use a simplified estimation.
    console.log(`Fetching financial data for zip: ${zipCode}`);

    // Simplified progressive tax calculation
    let taxBurden = 0;
    if (grossIncome > 100000) {
        taxBurden = 15000 + (grossIncome - 100000) * 0.25;
    } else if (grossIncome > 50000) {
        taxBurden = 5000 + (grossIncome - 50000) * 0.20;
    } else {
        taxBurden = grossIncome * 0.15;
    }

    // Simplified cost of living based on arbitrary zip code ranges
    const zipNum = parseInt(zipCode.substring(0, 3));
    let costOfLiving = 45000; // Base
    if (zipNum >= 100 && zipNum < 200) costOfLiving = 65000; // Northeast
    if (zipNum >= 900 && zipNum < 970) costOfLiving = 75000; // California / West Coast
    
    return {
      taxBurden: Math.round(taxBurden),
      costOfLiving: costOfLiving,
    };
  }
);


export const IncomeViabilityInputSchema = z.object({
  grossIncome: z.number().describe('Annual gross income.'),
  zipCode: z.string().length(5).describe('The 5-digit US zip code.'),
});
export type IncomeViabilityInput = z.infer<typeof IncomeViabilityInputSchema>;

export const IncomeViabilityOutputSchema = z.object({
  taxBurden: z.number().describe('The estimated annual tax burden.'),
  costOfLiving: z.number().describe('The estimated annual cost of living.'),
  netIncome: z.number().describe('The net income after taxes.'),
  disposableIncome: z.number().describe('The income remaining after taxes and cost of living.'),
  assessment: z.string().describe('A brief, qualitative assessment of the financial viability.'),
});
export type IncomeViabilityOutput = z.infer<typeof IncomeViabilityOutputSchema>;

export async function calculateIncomeViability(input: IncomeViabilityInput): Promise<IncomeViabilityOutput> {
  return incomeViabilityFlow(input);
}


const prompt = ai.definePrompt({
    name: 'incomeViabilityPrompt',
    input: { schema: IncomeViabilityInputSchema },
    output: { schema: IncomeViabilityOutputSchema },
    tools: [getFinancialDataForZip],
    prompt: `You are an AI financial analyst. Your goal is to calculate the income viability for a user based on their gross income and zip code.
  
  1. Use the 'getFinancialDataForZip' tool to get the estimated tax burden and cost of living for the user's location.
  2. Calculate the net income by subtracting the tax burden from the gross income.
  3. Calculate the disposable income by subtracting the cost of living from the net income.
  4. Provide a brief, one-sentence qualitative assessment of the viability. For example, if disposable income is highly positive, the assessment could be "This income is highly viable for the selected location." If it's negative, it could be "This income may not be viable without significant budgeting in the selected location."
  
  User's Gross Income: {{{grossIncome}}}
  User's Zip Code: {{{zipCode}}}
  
  Perform the calculations and return the results in the specified format.`,
  });


const incomeViabilityFlow = ai.defineFlow(
  {
    name: 'incomeViabilityFlow',
    inputSchema: IncomeViabilityInputSchema,
    outputSchema: IncomeViabilityOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
