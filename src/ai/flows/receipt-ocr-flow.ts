'use server';
/**
 * @fileOverview An AI agent for processing receipts using OCR.
 *
 * - processReceipt - A function that extracts information from a receipt image.
 * - ReceiptOcrInput - The input type for the processReceipt function.
 * - ReceiptOcrOutput - The return type for the processReceipt function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ReceiptOcrInputSchema = z.object({
  receiptImage: z
    .string()
    .describe(
      "A photo of a receipt, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ReceiptOcrInput = z.infer<typeof ReceiptOcrInputSchema>;

const ReceiptOcrOutputSchema = z.object({
  vendor: z.string().describe('The name of the vendor or store.'),
  date: z
    .string()
    .describe('The date of the transaction in YYYY-MM-DD format.'),
  total: z.number().describe('The total amount of the transaction.'),
});
export type ReceiptOcrOutput = z.infer<typeof ReceiptOcrOutputSchema>;

export async function processReceipt(
  input: ReceiptOcrInput
): Promise<ReceiptOcrOutput> {
  return receiptOcrFlow(input);
}

const prompt = ai.definePrompt({
  name: 'receiptOcrPrompt',
  input: {schema: ReceiptOcrInputSchema},
  output: {schema: ReceiptOcrOutputSchema},
  prompt: `You are an expert receipt processor. Extract the vendor name, transaction date (in YYYY-MM-DD format), and the final total amount from the following receipt image.

Receipt: {{media url=receiptImage}}`,
});

const receiptOcrFlow = ai.defineFlow(
  {
    name: 'receiptOcrFlow',
    inputSchema: ReceiptOcrInputSchema,
    outputSchema: ReceiptOcrOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
