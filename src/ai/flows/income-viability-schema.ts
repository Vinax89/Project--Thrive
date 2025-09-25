import { z } from 'zod';

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
