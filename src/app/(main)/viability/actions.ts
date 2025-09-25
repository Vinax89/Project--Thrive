'use server';

import { z } from 'zod';
import {
  calculateIncomeViability,
  type IncomeViabilityInput,
  type IncomeViabilityOutput,
} from '@/ai/flows/income-viability-flow';

const FormSchema = z.object({
  grossIncome: z.coerce.number().min(1, 'Please enter your annual gross income.'),
  zipCode: z.string().length(5, 'Please enter a valid 5-digit zip code.'),
});

export type FormState = {
  message: string;
  fields?: Record<string, string>;
  issues?: string[];
  output?: IncomeViabilityOutput;
};

export async function getIncomeViabilityAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = FormSchema.safeParse({
    grossIncome: formData.get('grossIncome'),
    zipCode: formData.get('zipCode'),
  });

  if (!validatedFields.success) {
    const errorDetail = validatedFields.error.flatten();
    return {
      message: 'Validation failed. Please check your inputs.',
      fields: {
        grossIncome: formData.get('grossIncome')?.toString() ?? '',
        zipCode: formData.get('zipCode')?.toString() ?? '',
      },
      issues: errorDetail.formErrors,
      ...errorDetail.fieldErrors,
    };
  }

  try {
    const input: IncomeViabilityInput = validatedFields.data;
    const result = await calculateIncomeViability(input);

    if (result) {
      return {
        message: 'Success! Your income viability analysis is ready.',
        output: result,
      };
    } else {
      return { message: 'The AI could not perform the analysis. Please try again.' };
    }
  } catch (error) {
    console.error('Error calculating income viability:', error);
    return { message: 'An unexpected error occurred. Please try again later.' };
  }
}
