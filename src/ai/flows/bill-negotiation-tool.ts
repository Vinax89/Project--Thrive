// src/ai/flows/bill-negotiation-tool.ts
'use server';
/**
 * @fileOverview A bill negotiation tool that uses an LLM to generate a negotiation script based on user-provided bill details.
 *
 * - generateNegotiationScript - A function that generates the negotiation script.
 * - BillNegotiationInput - The input type for the generateNegotiationScript function.
 * - BillNegotiationOutput - The return type for the generateNegotiationScript function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const BillNegotiationInputSchema = z.object({
  billType: z.string().describe('The type of bill, e.g., internet, phone, cable, medical.'),
  currentProvider: z.string().describe('The name of the current service provider.'),
  monthlyCost: z.number().describe('The current monthly cost of the bill.'),
  servicesProvided: z.string().describe('A description of the services provided in the bill.'),
  reasonForNegotiation: z.string().describe('The reason for negotiation, e.g., financial hardship, competitor offers, service issues.'),
  desiredOutcome: z.string().describe('The desired outcome of the negotiation, e.g., lower monthly cost, additional services, one-time credit.'),
});
export type BillNegotiationInput = z.infer<typeof BillNegotiationInputSchema>;

const BillNegotiationOutputSchema = z.object({
  negotiationScript: z.string().describe('A script to help the user negotiate with the service provider.'),
});
export type BillNegotiationOutput = z.infer<typeof BillNegotiationOutputSchema>;

export async function generateNegotiationScript(
  input: BillNegotiationInput
): Promise<BillNegotiationOutput> {
  return billNegotiationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'billNegotiationPrompt',
  input: {schema: BillNegotiationInputSchema},
  output: {schema: BillNegotiationOutputSchema},
  prompt: `You are an expert negotiator, skilled at helping people lower their bills. Based on the information provided, generate a negotiation script the user can read to their service provider.

  Bill Type: {{{billType}}}
  Current Provider: {{{currentProvider}}}
  Monthly Cost: {{{monthlyCost}}}
  Services Provided: {{{servicesProvided}}}
  Reason for Negotiation: {{{reasonForNegotiation}}}
  Desired Outcome: {{{desiredOutcome}}}

  Here is the negotiation script:
  `,
});

const billNegotiationFlow = ai.defineFlow(
  {
    name: 'billNegotiationFlow',
    inputSchema: BillNegotiationInputSchema,
    outputSchema: BillNegotiationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
