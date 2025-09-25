'use server';

import { z } from 'zod';
import {
  modelIncome,
  type IncomeModelingInput,
  type IncomeModelingOutput,
} from '@/ai/flows/income-modeling-flow';

const FormSchema = z.object({
  scheduleDescription: z.string().min(10, 'Please provide a more detailed description of your schedule.'),
});

export type FormState = {
  message: string;
  output?: IncomeModelingOutput;
  errors?: {
    [key: string]: string[] | undefined;
  };
};

export async function modelIncomeAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = FormSchema.safeParse({
    scheduleDescription: formData.get('scheduleDescription'),
  });

  if (!validatedFields.success) {
    return {
      message: 'Validation failed. Please check your inputs.',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const input: IncomeModelingInput = validatedFields.data;
    const result = await modelIncome(input);

    if (result) {
      return {
        message: 'Success! Your income model is ready.',
        output: result,
      };
    } else {
      return { message: 'The AI could not generate the model. Please try again.' };
    }
  } catch (error) {
    console.error('Error modeling income:', error);
    return { message: 'An unexpected error occurred. Please try again later.' };
  }
}
