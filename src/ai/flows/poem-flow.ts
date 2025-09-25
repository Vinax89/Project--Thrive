'use server';
/**
 * @fileOverview A simple poem generation AI agent.
 *
 * - generatePoem - A function that handles the poem generation process.
 * - GeneratePoemInput - The input type for the generatePoem function.
 * - GeneratePoemOutput - The return type for the generatePoem function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePoemInputSchema = z.object({
  subject: z.string().describe('The subject for the poem.'),
});
export type GeneratePoemInput = z.infer<typeof GeneratePoemInputSchema>;

const GeneratePoemOutputSchema = z.object({
  poem: z.string().describe('The generated poem.'),
});
export type GeneratePoemOutput = z.infer<typeof GeneratePoemOutputSchema>;

export async function generatePoem(
  input: GeneratePoemInput
): Promise<GeneratePoemOutput> {
  return generatePoemFlow(input);
}

const generatePoemFlow = ai.defineFlow(
  {
    name: 'generatePoemFlow',
    inputSchema: GeneratePoemInputSchema,
    outputSchema: GeneratePoemOutputSchema,
  },
  async ({ subject }) => {
    const { text } = await ai.generate({prompt: `Compose a poem about ${subject}.`});
    return { poem: text() };
  },
);
