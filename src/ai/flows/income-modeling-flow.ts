'use server';

/**
 * @fileOverview An AI agent for modeling income based on complex work schedules.
 *
 * - modelIncome - A function that calculates income from a text description.
 * - IncomeModelingInput - The input type for the modelIncome function.
 * - IncomeModelingOutput - The return type for the modelIncome function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

export const IncomeModelingInputSchema = z.object({
  scheduleDescription: z
    .string()
    .describe(
      'A natural language description of the work schedule, including base pay, hours, overtime rules, and any shift differentials.'
    ),
});
export type IncomeModelingInput = z.infer<typeof IncomeModelingInputSchema>;

export const IncomeModelingOutputSchema = z.object({
  reasoning: z
    .string()
    .describe('A step-by-step breakdown of how the calculation was performed.'),
  estimatedWeeklyIncome: z
    .number()
    .describe('The estimated total income for one week.'),
  estimatedMonthlyIncome: z
    .number()
    .describe('The estimated total income for one month (assuming 4.33 weeks).'),
});
export type IncomeModelingOutput = z.infer<typeof IncomeModelingOutputSchema>;

export async function modelIncome(
  input: IncomeModelingInput
): Promise<IncomeModelingOutput> {
  return incomeModelingFlow(input);
}

const prompt = ai.definePrompt({
  name: 'incomeModelingPrompt',
  input: { schema: IncomeModelingInputSchema },
  output: { schema: IncomeModelingOutputSchema },
  prompt: `You are an expert income calculator. Your task is to calculate the estimated weekly and monthly income based on a natural language description of a work schedule.

  User's Schedule:
  "{{{scheduleDescription}}}"

  Instructions:
  1.  Carefully parse the user's description to identify all components: base hourly rate, regular hours, overtime rules (e.g., "time and a half" over 40 hours), and any shift differentials (e.g., "15% extra for weekend hours").
  2.  Provide a clear, step-by-step 'reasoning' of your calculation. Show the math for regular pay, overtime pay, and differential pay separately.
  3.  Calculate the 'estimatedWeeklyIncome'.
  4.  Calculate the 'estimatedMonthlyIncome' by multiplying the weekly income by 4.33.
  5.  Return the results in the specified JSON format.

  Example Calculation:
  -   **Schedule**: "I make $20/hour for a 40-hour week. I get time and a half for anything over 40 hours. I worked 45 hours last week."
  -   **Reasoning**:
      -   Regular Pay: 40 hours * $20/hour = $800
      -   Overtime Hours: 45 hours - 40 hours = 5 hours
      -   Overtime Rate: $20/hour * 1.5 = $30/hour
      -   Overtime Pay: 5 hours * $30/hour = $150
      -   Total Weekly: $800 + $150 = $950
      -   Total Monthly: $950 * 4.33 = $4113.50
  -   **Output**: \`{"reasoning": "...", "estimatedWeeklyIncome": 950, "estimatedMonthlyIncome": 4113.50}\`
  `,
});

const incomeModelingFlow = ai.defineFlow(
  {
    name: 'incomeModelingFlow',
    inputSchema: IncomeModelingInputSchema,
    outputSchema: IncomeModelingOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
