'use server';

import { z } from 'zod';
import {
  getTaxOptimizationSuggestions,
  type TaxOptimizerInput,
} from '@/ai/flows/tax-optimizer-flow';

const FormSchema = z.object({
  income: z.coerce.number().min(1, 'Please enter your annual gross income.'),
  filingStatus: z.enum(['Single', 'Married Filing Jointly', 'Married Filing Separately', 'Head of Household', 'Qualifying Widow(er)']),
  currentDeductions: z.string().min(1, 'Please describe your current deductions.'),
  retirementContribution: z.coerce.number().min(0, 'Please enter your annual retirement contribution.'),
});

export type FormState = {
  message: string;
  suggestions?: string;
  errors?: {
    [key: string]: string[] | undefined;
  };
};

export async function getTaxSuggestionsAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = FormSchema.safeParse({
    income: formData.get('income'),
    filingStatus: formData.get('filingStatus'),
    currentDeductions: formData.get('currentDeductions'),
    retirementContribution: formData.get('retirementContribution'),
  });

  if (!validatedFields.success) {
    return {
      message: 'Validation failed. Please check your inputs.',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const input: TaxOptimizerInput = validatedFields.data;
    const result = await getTaxOptimizationSuggestions(input);

    if (result && result.suggestions) {
      return {
        message: 'Success! Your suggestions are ready.',
        suggestions: result.suggestions,
      };
    } else {
      return { message: 'The AI could not generate suggestions. Please try again.' };
    }
  } catch (error) {
    console.error('Error generating tax suggestions:', error);
    return { message: 'An unexpected error occurred. Please try again later.' };
  }
}
